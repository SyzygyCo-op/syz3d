defmodule Syz3d.World do
  @moduledoc """
  Either a backend for [my entity diffing wire format]
  (https://www.patrickcanfield.com/posts/thinking-differently-about-wire-format),
  a nascent ECS, or both. Not sure yet to be honest.
  """

  use Agent

  alias Syz3d.Player

  defmodule InitialData do
    def random_euler do
      [
        :rand.uniform() * 4 - 2,
        :rand.uniform() * 4 - 2,
        :rand.uniform() * 4 - 2,
        "YXZ"
      ]
    end
    def random_position do
      [
        :rand.uniform() * 4 - 2,
        :rand.uniform() * 4,
        :rand.uniform() * 4 - 2,
      ]
    end
    def get() do
      %{
        "river_island" => %{
          "glft_url" => "/3d/RiverIsland/model.glb",
          "position" => [0, 0, 0],
          "rotation" => [0, 0, 0, "YXZ"],
          "render_to_canvas" => true
        },
      }
    end
  end

  defmodule Diff do
    @derive {Jason.Encoder, only: [:upsert, :remove]}
    defstruct upsert: %{}, remove: %{}

    def from_map(%{"upsert" => upsert, "remove" => remove}),
      do: %Diff{upsert: upsert, remove: remove}

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
