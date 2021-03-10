defmodule Syz3d.Player do
  @moduledoc """
  For storing and retrieving "player" information.
  """

  @enforce_keys [:room_slug]
  defstruct [:id, :name, is_online: false, room_slug: "lobby"]

  def make_entity_id(player_id) do
    "player:#{player_id}"
  end

  defmodule  Collection do
    defmodule Behaviour do
      alias Syz3d.Player

      @type selection_criteria() :: [room_slug: String.t, is_online: boolean()]

      @callback size(selection_criteria :: selection_criteria()) :: pos_integer()

      @callback get(id :: integer()) :: Player | nil

      @callback select_by(selection_criteria :: selection_criteria()) :: %{optional(integer()) => Player}

      @callback insert(new_player :: Player) :: Player

      @callback update(id :: integer(), update_fn :: (Player -> map())) :: :ok

    end

    @behaviour Behaviour

    use Agent

    def start_link(initial_data, name \\ __MODULE__) do
      Agent.start_link(fn -> initial_data end, name: name)
    end

    def stop(name \\ __MODULE__) do
      Agent.stop(name)
    end

    def size(selection_criteria, agent_name \\ __MODULE__) do
      Map.size(select_by(selection_criteria, agent_name))
    end

    def get(id, agent_name \\ __MODULE__) do
      Agent.get(agent_name, fn map -> Map.get(map, id) end)
    end

    def map_select_by_tuple(map, {select_key, select_val}) do
      for {key, val = %{^select_key => ^select_val}} <- map, into: %{} do
        { key, val }
      end
    end

    def select_by(selection_criteria, agent_name \\ __MODULE__) do
      Agent.get(agent_name, fn map ->
        Enum.reduce(selection_criteria, map, fn tuple, rows -> map_select_by_tuple(rows, tuple) end)
      end)
    end

    def select_by_room(slug, agent_name \\ __MODULE__) do
      select_by([room_slug: slug], agent_name)
    end

    def insert(new_player, agent_name \\ __MODULE__) do
      Agent.get_and_update(agent_name, fn map ->
        # This assumes the rows are never removed
        next_id = Map.size(map)
        player_with_id = %{new_player | id: next_id}
        # player_with_id_and_name = case player_with_id do
        #   %{name: name} when name != nil -> player_with_id
        #   _ -> %{player_with_id | name: "player#{player_with_id.id + 1}"}
        # end
        new_map = Map.put(map, next_id, player_with_id)
        {new_map[next_id], new_map}
      end)
    end

    def update(id, update_fn, agent_name \\ __MODULE__) do
      Agent.update(agent_name, fn map ->
        Map.put(map, id, update_fn.(map[id]))
      end)
    end
  end
end
