defmodule Syz3d.World do
  @moduledoc """
  Either a backend for [my entity diffing wire format]
  (https://www.patrickcanfield.com/posts/thinking-differently-about-wire-format),
  a nascent ECS, or both. Not sure yet to be honest.
  """

  use Agent

  alias Syz3d.Player

  defmodule Diff do
    @derive {Jason.Encoder, only: [:upsert, :remove]}
    defstruct upsert: %{}, remove: %{}

    def from_map(%{"upsert" => upsert, "remove" => remove}),
      do: %Diff{upsert: upsert, remove: remove}

    @doc """
    Transforms a diff generated by Presence in to a World.Diff, transforming
    Player :id into entity ID.

    For now it only handles leaves, because that's all I need it for.
    """
    def from_presence(diff) do
      %{leaves: leaves} = diff

      removes = for {player_id, _data} <- leaves, into: %{} do
        {Player.make_entity_id(player_id), true}
      end

      %Diff{remove: removes}
    end

    def from_presence_socket(socket, player_ids) do
      presence = Application.get_env(:syz3d, :presence)
      removes = for player_id <- player_ids, [] == presence.get_by_key(socket, player_id), into: %{} do
        {Player.make_entity_id(player_id), true}
      end
      %Diff{remove: removes}
    end
  end

  def start_link(initial_data, name \\ __MODULE__) do
    Agent.start_link(fn -> initial_data end, name: name)
  end

  def stop(name \\ __MODULE__) do
    Agent.stop(name)
  end

  def get(wid \\ __MODULE__) do
    Agent.get(wid, fn map -> map end)
  end

  def apply_diff(diff, wid \\ __MODULE__) do
    %{ upsert: upserts, remove: removes } = diff
    Agent.update(wid, fn map ->
      map_with_upserts = do_upserts(map, upserts)

      removes_list = Map.to_list(removes)
      do_removes(map_with_upserts, removes_list, length(removes_list))
    end)
  end

  defp do_upserts(map, upserts) do
    Map.merge(map, upserts, fn _key, v1, v2 ->
     Map.merge(v1, v2)
    end)
  end

  defp do_removes(map, removes_list, removes_length) when removes_length > 0 do
    [ head | tail ] = removes_list
    map_with_removes = case head do
      { key, true } -> Map.delete(map, key)
      { key, data } ->
        removes_list = Map.to_list(data)
        submap = map[key]
        submap_with_removes = do_removes(submap, removes_list, length(removes_list))
        Map.put(map, key, submap_with_removes)
    end

    do_removes(map_with_removes, tail, removes_length - 1)
  end

  defp do_removes(map, _removes_list, removes_length) when removes_length == 0 do
    map
  end
end
