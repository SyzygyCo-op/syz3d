defmodule Syz3dWeb.Room.Show do
  @moduledoc """
  Route for joining a game room.
  """

  use Syz3dWeb, :controller

  def show(conn, params) do
    config = Application.get_env(:syz3d, :room_config)
    collection = Application.get_env(:syz3d, :player_collection)
    slug_param = params["slug"]
    max_ccu = config.get_max_ccu(slug_param)
    ccu = collection.size(room_slug: slug_param, is_online: true)
    IO.puts("CCU = #{ccu}")

    case ccu do
      x when x < max_ccu ->
        %{ id: player_id } = collection.insert(%Syz3d.Player{room_slug: slug_param})
        render(conn, slug: slug_param, player_id: player_id)
      _ ->
        conn
        |> put_status(307)
        |> redirect(to: Routes.room_overcap_path(conn, :show, slug_param))
    end
  end

end
