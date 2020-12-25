defmodule MiniputtWeb.RoomChannel do
  use Phoenix.Channel
  alias MiniputtWeb.Presence

  def join(_topic, _params, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} = Presence.track(socket, socket.assigns.player_id, %{
      online_at: inspect(System.system_time(:second)),
      player_id: socket.assigns.player_id
    })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
