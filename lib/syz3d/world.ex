defmodule Syz3d.World do
  @moduledoc """
  Either a backend for [my entity diffing wire format]
  (https://www.patrickcanfield.com/posts/thinking-differently-about-wire-format),
  a nascent ECS, or both. Not sure yet to be honest.
  """

  use Agent

  defmodule Diff do
    @derive {Jason.Encoder, only: [:upsert, :remove]}
    defstruct upsert: %{}, remove: %{}

    def from_map(%{"upsert" => upsert, "remove" => remove}),
      do: %Diff{upsert: upsert, remove: remove}
  end

  def start_link(initial_data, wid \\ __MODULE__) do
    Agent.start_link(fn -> initial_data end, name: wid)
  end

  def stop(wid \\ __MODULE__) do
    Agent.stop(wid)
  end

  def get(wid \\ __MODULE__) do
    Agent.get(wid, fn map -> map end)
  end

  def apply_diff(diff, options \\ []) do
    wid = Keyword.get(options, :wid, __MODULE__)
    hooks = Keyword.drop(options, [:wid])
    %{ upsert: upserts, remove: removes } = diff
    Agent.update(wid, fn map ->
      map_with_upserts = do_upserts(map, upserts, hooks)

      removes_list = Map.to_list(removes)
      do_removes(map_with_upserts, removes_list, length(removes_list))
    end)
  end

  defp do_upserts(map, upserts, hooks) do
    map_post_merge = Map.merge(map, upserts, fn _entity_id, component_map_old, component_map_new ->
      Map.merge(component_map_old, component_map_new)
    end)

    upsert_key_value_list = List.zip([Map.keys(upserts), Map.values(upserts)])
    do_upsert_entity_hooks(map_post_merge, upsert_key_value_list, hooks)
  end

  defp do_upsert_entity_hooks(map, upsert_list, hooks) when length(upsert_list) > 0 and length(hooks) > 0 do
    on_entity_upsert = Keyword.get(hooks, :on_entity_upsert)
    [{entity_id, component_map_new} | tail] = upsert_list
    component_map_old = Map.get(map, entity_id)

    component_map_new_post_hook = if on_entity_upsert do
      on_entity_upsert.(entity_id, component_map_old, component_map_new)
    else
      component_map_new
    end

    new_map = Map.put(map, entity_id, component_map_new_post_hook)
    do_upsert_entity_hooks(new_map, tail, hooks)
  end

  defp do_upsert_entity_hooks(map, _list, []) do
    map
  end

  defp do_removes(map, removes_list, removes_length) when removes_length > 0 do
    [ head | tail ] = removes_list
    map_with_removes = case head do
      { key, true } -> Map.delete(map, key)
      { key, data } ->
        removes_list = Map.to_list(data)
        submap = Map.get(map, key)
        submap_with_removes = do_removes(submap, removes_list, length(removes_list))
        Map.put(map, key, submap_with_removes)
    end

    do_removes(map_with_removes, tail, removes_length - 1)
  end

  defp do_removes(map, _removes_list, removes_length) when removes_length == 0 do
    map
  end
end
