defmodule Syz3dWeb.RoomChannel do
  use Phoenix.Channel

  alias Syz3d.World
  alias Syz3d.Player
  alias Syz3dWeb.Presence

  def join("room:" <> room_slug, _params, socket) do
    send(self(), {:after_join, room_slug})
    :timer.send_interval(1000, {:kill_zombies, room_slug})
    {:ok, socket}
  end

  def handle_info({:after_join, _room_id}, socket) do
    %{player_id: player_id} = socket.assigns

    # TODO upsert player and see if that works for now. If not, may need to
    # use a real database.
    Player.Collection.update(player_id, &Map.merge(&1, %{is_online: true, online_at: DateTime.utc_now()}))

    {:ok, _} = Presence.track(socket, player_id, %{})

    body = %{
      world_diff: %World.Diff{
        upsert: World.get(),
        remove: %{}
      }
    }

    push(socket, "init", %{body: body})
    {:noreply, socket}
  end

  def handle_info({:kill_zombies, room_slug}, socket) do
    zombie_list = Presence.list_zombies(socket, Map.keys(Player.Collection.select_by_room(room_slug)))
    Enum.each(zombie_list, fn id ->
      Player.Collection.update(id, &Map.merge(&1, %{is_online: false, offline_at: DateTime.utc_now()}))
    end)
    removes = for player_id <- zombie_list, into: %{} do
      {Player.make_entity_id(player_id), true}
    end
    diff = %World.Diff{remove: removes}
    broadcast!(socket, "world_diff", %{body: diff})
    World.apply_diff(diff)
    {:noreply, socket}
  end

  def handle_in("world_diff", %{"body" => body}, socket) do
    World.apply_diff(World.Diff.from_map(body))

    broadcast!(socket, "world_diff", %{body: body})
    {:noreply, socket}
  end
end
