defmodule Syz3dWeb.Player.IndexLive do
  use Syz3dWeb, :live_view

  alias Syz3d.Player

  @impl true
  def render(assigns) do
    ~L"""
    <h1>Players</h1>
    <p>Now: <%= DateTime.utc_now() %></p>
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Room Slug</td>
          <td>Online?</td>
          <td>Online at</td>
          <td>Offline at</td>
        </tr>
      </thead>
      <tbody>
        <%= for {id, player} <- Player.Collection.select_by([]) do %>
          <tr>
            <td><%= id %></td>
            <td><%= player.room_slug %></td>
            <td><%= player.is_online %></td>
            <td><%= player.online_at %></td>
            <td><%= player.offline_at %></td>
          </tr>
        <% end %>
      </tbody>
    </table>
    """
  end
end
