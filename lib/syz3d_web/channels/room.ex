defmodule Syz3dWeb.RoomChannel do
  use Phoenix.Channel
  alias Syz3dWeb.Presence

  def join(_topic, _params, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} = Presence.track(socket, socket.assigns.player_id, %{
      online_at: inspect(System.system_time(:second)),
      player_id: socket.assigns.player_id,
      texture: socket.assigns.texture
    })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  def handle_in("change_avatar", %{"body" => body}, socket) do
    broadcast!(socket, "change_avatar", %{body: body})
    {:noreply, socket}
  end
end
