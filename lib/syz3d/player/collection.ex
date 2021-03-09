defmodule Syz3d.Player do
  @enforce_keys [:name, :room_slug]
  defstruct [:id, :name, room_slug: "lobby"]

  defmodule  Collection do
    defmodule Behaviour do
      alias Syz3d.Player

      @callback size() :: pos_integer()
      @callback size(selection_criteria :: [room_slug: String.t]) :: pos_integer()

      @callback get(id :: integer()) :: Player | nil

      @callback select_by_room(slug :: String.t) :: %{optional(String.t) => Player}

      @callback insert(new_player :: Player) :: :ok

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
      case Keyword.get(selection_criteria, :room_slug) do
        nil -> Agent.get(agent_name, fn map -> Map.size(map) end)
        slug -> Map.size(select_by_room(slug, agent_name))
      end
    end

    def get(id, agent_name \\ __MODULE__) do
      Agent.get(agent_name, fn map -> Map.get(map, id) end)
    end

    def select_by_room(slug, agent_name \\ __MODULE__) do
      Agent.get(agent_name, fn map ->
        for {key, val = %{room_slug: ^slug}} <- map, into: %{} do
          { key, val }
        end
      end)
    end

    def insert(new_player, agent_name \\ __MODULE__) do
      Agent.update(agent_name, fn map ->
        next_id = Map.size(map)
        player_with_id = %{new_player | id: next_id}
        Map.put(map, next_id, player_with_id)
      end)
    end
  end
end
