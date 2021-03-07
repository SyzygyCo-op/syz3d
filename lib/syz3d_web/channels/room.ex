defmodule Syz3dWeb.RoomChannel do
  use Phoenix.Channel

  alias Syz3d.World
  alias Syz3dWeb.Presence

  # TODO use token auth
  intercept ["presence_diff"]

  def join("room:" <> room_id, _params, socket) do
    send(self(), {:after_join, room_id})
    {:ok, assign(socket, :player_id, "player:#{UUID.uuid4}")}
  end

  def handle_info({:after_join, _room_id}, socket) do
    body = %{
      player_id: socket.assigns.player_id,
      world_diff: %World.Diff{
        upsert: World.get(),
        remove: %{}
      }
    }

    {:ok, _} = Presence.track(socket, socket.assigns.player_id, %{})

    push(socket, "init", %{body: body})

    {:noreply, socket}
  end

  def handle_out("presence_diff", payload, socket) do
    diff = World.Diff.from_presence(payload)
    World.apply_diff(diff)
    broadcast!(socket, "world_diff", %{body: diff})
    {:noreply, socket}
  end

  def handle_in("world_diff", %{"body" => body}, socket) do
    World.apply_diff(World.Diff.from_map(body))
    broadcast!(socket, "world_diff", %{body: body})
    {:noreply, socket}
  end
end
