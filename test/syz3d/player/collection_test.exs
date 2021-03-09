defmodule Syz3d.Player.CollectionTest do
  use ExUnit.Case

  alias Syz3d.Player
  alias Syz3d.Player.Collection

  setup do
    Collection.start_link(%{})
    Collection.insert(%Player{name: "goku", room_slug: "papaya_island"})
    Collection.insert(%Player{name: "krillin", room_slug: "papaya_island"})
    Collection.insert(%Player{name: "gohan", room_slug: "heaven"})
  end

  test "size/0 returns total CCU" do
    assert Collection.size([]) == 3
  end

  test "size/1 returns CCU for a given room" do
    assert Collection.size(room_slug: "papaya_island") == 2
  end

  test "select_by_room/1 returns all players in a room" do
    assert Collection.select_by_room("papaya_island") == %{
      0 => %Player{id: 0, name: "goku", room_slug: "papaya_island"},
      1 => %Player{id: 1, name: "krillin", room_slug: "papaya_island"},
    }
  end

  test "inserting a player with an :id does not overwrite an existing field" do
    Collection.insert(%Player{id: 0, name: "arale", room_slug: "penguin_village"})

    assert Collection.get(0).name == "goku"

    # It does, however, insert
    assert Collection.select_by_room("penguin_village") == %{
      3 => %Player{id: 3, name: "arale", room_slug: "penguin_village"},
    }
  end
end
