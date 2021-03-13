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

    # TODO need to come up with a way to handle when the server restarts and
    # looses all players but clients still have tokens containing player_ids
    # that do not exist. Maybe clients should be forced to refresh? Or should
    # players be persisted?
    Player.Collection.update(player_id, &Map.put(&1, :is_online, true))

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
    player_ids = Map.keys(Player.Collection.select_by_room(room_slug))
    diff = World.Diff.from_presence_socket(socket, player_ids)
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
