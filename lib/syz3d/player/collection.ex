defmodule Syz3d.Player do
  @moduledoc """
  For storing and retrieving "player" information.
  """


  @enforce_keys [:room_slug]
  defstruct [:id, :name, :online_at, :offline_at, is_online: false, room_slug: "lobby"]

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

    @unique_name_tuple {
      "Bulbasaur",
      "Ivysaur",
      "Venusaur",
      "Charmander",
      "Charmeleon",
      "Charizard",
      "Squirtle",
      "Wartortle",
      "Blastoise",
      "Caterpie",
      "Metapod",
      "Butterfree",
      "Weedle",
      "Kakuna",
      "Beedrill",
      "Pidgey",
      "Pidgeotto",
      "Pidgeot",
      "Rattata",
      "Raticate",
      "Spearow",
      "Fearow",
      "Ekans",
      "Arbok",
      "Pikachu",
      "Raichu",
      "Sandshrew",
      "Sandslash",
      "Nidoran",
      "Nidorina",
      "Nidoqueen",
      "Nidorino",
      "Nidoking",
      "Clefairy",
      "Clefable",
      "Vulpix",
      "Ninetales",
      "Jigglypuff",
      "Wigglytuff",
      "Zubat",
      "Golbat",
      "Oddish",
      "Gloom",
      "Vileplume",
      "Paras",
      "Parasect",
      "Venonat",
      "Venomoth",
      "Diglett"
      }

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

    def insert(new_player, options \\ [], agent_name \\ __MODULE__) do
      unique_names = Keyword.get(options, :unique_autofill_names, @unique_name_tuple)
      Agent.get_and_update(agent_name, fn map ->
        # This assumes the rows are never removed
        next_id = Map.size(map)
        new_map = map_insert(map, new_player, next_id, get_unique_name(unique_names, next_id))
        {new_map[next_id], new_map}
      end)
    end

    defp map_insert(map, new_player, id, name) do
      complete_row = %{new_player | id: id, name: name}
      if map[id] != nil do
        raise "Player with id #{id} exists!"
      end
      Map.put(map, id, complete_row)
    end

    def update(id, update_fn, agent_name \\ __MODULE__) do
      Agent.update(agent_name, fn map ->
        Map.put(map, id, update_fn.(map[id]))
      end)
    end

    def upsert(id, row, agent_name \\ __MODULE__) do
      if get(id, agent_name) == nil do
        Agent.get_and_update(agent_name, fn map ->
          new_map = map_insert(map, row, id, row.name)
          {new_map[id], new_map}
        end)
      else
        update(id, &(Map.merge(&1, row)), agent_name)
      end
    end

    def get_unique_name(tuple, index) do
      size = tuple_size(tuple)
      case index do
        x when x >= size -> "#{elem(tuple, rem(x, size))}#{div(x, size) + 1}"
        _ -> elem(tuple, index)
      end
    end
  end
end
