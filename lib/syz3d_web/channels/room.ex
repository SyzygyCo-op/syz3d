defmodule Syz3dWeb.RoomChannel do
  use Phoenix.Channel

  def join(_topic, _params, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    body = %{
      client_id: UUID.uuid4()
    }
    push(socket, "world_init", %{body: body})

    {:noreply, socket}
  end

  def handle_in("world_diff", %{"body" => body}, socket) do
    broadcast!(socket, "world_diff", %{body: body})
    {:noreply, socket}
  end
end
