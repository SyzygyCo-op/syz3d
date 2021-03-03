defmodule Syz3d.World do
  use Agent

  defmodule Diff do
    defstruct upsert: %{}, remove: %{}
  end

  def start_link(initial_data) do
    Agent.start_link(fn -> initial_data end)
  end

  def get(wid) do
    Agent.get(wid, fn map -> map end)
  end

  def apply_diff(wid, diff) do
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
    { key, data } = head
    map_with_removes = if data === true do
      Map.delete(map, key)
    else
      removes_list = Map.to_list(data)
      submap_with_removes = do_removes(Map.get(map, key), removes_list, length(removes_list))
      Map.put(map, key, submap_with_removes)
    end

    do_removes(map_with_removes, tail, removes_length - 1)
  end

  defp do_removes(map, _removes_list, removes_length) when removes_length == 0 do
    map
  end
end
