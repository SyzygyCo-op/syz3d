defmodule Syz3d.Player.CollectionTest do
  use ExUnit.Case

  alias Syz3d.Player
  alias Syz3d.Player.Collection

  setup do
    agent_name = Syz3d.Player.CollectionTest
    Collection.start_link(%{}, agent_name)
    Collection.insert(%Player{name: "goku", room_slug: "papaya_island"}, agent_name)
    Collection.insert(%Player{name: "krillin", room_slug: "papaya_island"}, agent_name)
    Collection.insert(%Player{name: "gohan", room_slug: "heaven"}, agent_name)
    %{agent_name: agent_name}
  end

  test "size/1 returns total CCU", %{agent_name: agent_name} do
    assert Collection.size([], agent_name) == 3
  end

  test "size/1 returns CCU for a given room", %{agent_name: agent_name} do
    assert Collection.size([room_slug: "papaya_island"], agent_name) == 2
  end

  test "select_by_room/1 returns all players in a room", %{agent_name: agent_name} do
    assert Collection.select_by_room("papaya_island", agent_name) == %{
      0 => %Player{id: 0, name: "goku", room_slug: "papaya_island"},
      1 => %Player{id: 1, name: "krillin", room_slug: "papaya_island"},
    }
  end

  test "insert/1 returns the newly added player", %{agent_name: agent_name} do
    player = Collection.insert(%Player{room_slug: "penguin_village"}, agent_name)

    assert %{ 3 => %Player{room_slug: "penguin_village"} } = player
  end

  test "inserting a player with an :id does not overwrite an existing field", %{agent_name: agent_name} do
    Collection.insert(%Player{id: 0, name: "arale", room_slug: "penguin_village"}, agent_name)

    assert Collection.get(0, agent_name).name == "goku"

    # It doesn't fail, however
    assert Collection.select_by_room("penguin_village", agent_name) == %{
      3 => %Player{id: 3, name: "arale", room_slug: "penguin_village"},
    }
  end

  # test "inserting a player without a :name causes a unique name to be assigned", %{agent_name: agent_name} do
  #   Collection.insert(%Player{room_slug: "penguin_village"}, agent_name)
  #   assert %{
  #     3 => %Player{name: "player4"},
  #   } = Collection.select_by_room("penguin_village", agent_name)
  # end
end
