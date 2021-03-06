defmodule Syz3dWeb.RoomChannel do
  use Phoenix.Channel

  alias Syz3d.World

  # TODO remove entities when associated channel closes instead of relying on
  # the client to send a cleanup message

  def join("room:" <> room_id, _params, socket) do
    send(self(), {:after_join, room_id})
    {:ok, socket}
  end

  def handle_info({:after_join, _room_id}, socket) do
    body = %{
      client_id: UUID.uuid4(),
      world_diff: %World.Diff{
        upsert: World.get(),
        remove: %{}
      }
    }

    push(socket, "init", %{body: body})

    {:noreply, socket}
  end

  def handle_in("world_diff", %{"body" => body}, socket) do
    World.apply_diff(World.Diff.from_map(body))
    broadcast!(socket, "world_diff", %{body: body})
    {:noreply, socket}
  end
end
