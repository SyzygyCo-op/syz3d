defmodule Syz3dWeb.RoomChannel do
  use Phoenix.Channel

  alias Syz3d.World
  alias Syz3d.Player
  alias Syz3d.Game
  alias Syz3dWeb.Presence

  def join("room:" <> room_slug, _params, socket) do
    send(self(), {:after_join, room_slug})
    :timer.send_interval(1000, {:kill_zombies, room_slug})
    {:ok, socket}
  end

  def handle_info({:after_join, _room_slug}, socket) do
    %{player_id: player_id} = socket.assigns

    case Player.Collection.get(player_id) do
      %Player{} ->
        Player.Collection.update(player_id, fn p -> %{ p | is_online: true, online_at: DateTime.utc_now()} end)
        {:ok, _} = Presence.track(socket, player_id, %{})

        body = %{
          world_diff: %World.Diff{
            upsert: Game.assign_test_entities(World.get(), player_id),
            remove: %{}
          }
        }

        push(socket, "init", %{body: body})
      nil ->
        push(socket, "force_reload", %{})
    end

    {:noreply, socket}
  end

  def handle_info({:kill_zombies, room_slug}, socket) do
    zombie_list = Presence.list_zombies(socket, Map.keys(Player.Collection.select_by_room(room_slug)))
    live_zombie_list = Enum.filter(zombie_list, fn id ->
      Player.Collection.get(id).is_online
    end)
    Enum.each(live_zombie_list, fn id ->
      Player.Collection.update(id, fn player ->
        case player do
          %{is_online: true} -> Map.merge(player, %{is_online: false, offline_at: DateTime.utc_now()})
          _ -> player
        end
      end)
    end)
    remove_players = for player_id <- live_zombie_list, into: %{} do
      {Player.make_entity_id(player_id), true}
    end

    remove_players_and_test_entities = Enum.reduce(live_zombie_list, remove_players, fn player_id, acc ->
      Game.map_test_entities(acc, player_id, fn -> true end)
    end)

    diff = %World.Diff{remove: remove_players_and_test_entities}
    if length(live_zombie_list) > 0 do
      broadcast!(socket, "world_diff", %{body: diff})
    end
    World.apply_diff(diff)
    {:noreply, socket}
  end

  def handle_in("world_diff", %{"body" => body}, socket) do
    World.apply_diff(World.Diff.from_map(body))

    broadcast!(socket, "world_diff", %{body: body})
    {:noreply, socket}
  end
end
