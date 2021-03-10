defmodule Syz3dWeb.RoomChannel do
  use Phoenix.Channel

  alias Syz3d.World
  alias Syz3d.Player
  alias Syz3dWeb.Presence

  # TODO use token auth
  intercept ["presence_diff"]

  def join("room:" <> room_id, _params, socket) do
    send(self(), {:after_join, room_id})
    {:ok, socket}
  end

  def handle_info({:after_join, _room_id}, socket) do

    body = %{
      # player_id: player_id,
      world_diff: %World.Diff{
        upsert: World.get(),
        remove: %{}
      }
    }

    push(socket, "init", %{body: body})
    {:noreply, socket}
  end

  def handle_out("presence_diff", payload, socket) do
    Enum.each(Map.keys(payload.leaves), fn player_key ->
      { player_id, _ } = Integer.parse(player_key)
      Player.Collection.update(player_id, &Map.put(&1, :is_online, false))
    end)

    diff = World.Diff.from_presence(payload)
    World.apply_diff(diff)
    broadcast!(socket, "world_diff", %{body: diff})
    {:noreply, socket}
  end

  def handle_in("player_is_online", %{"body" => body}, socket) do
    { player_id, _ } = Integer.parse(body["player_id"])

    Player.Collection.update(player_id, &Map.put(&1, :is_online, true))

    {:ok, _} = Presence.track(socket, player_id, %{})

    {:noreply, assign(socket, :player_id, player_id)}
  end

  def handle_in("world_diff", %{"body" => body}, socket) do
    World.apply_diff(World.Diff.from_map(body))

    broadcast!(socket, "world_diff", %{body: body})
    {:noreply, socket}
  end
end
