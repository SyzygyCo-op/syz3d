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
    current_ccu = collection.size(room_slug: slug_param)
    IO.puts("current_ccu #{current_ccu}")

    case current_ccu do
      x when x <= max_ccu ->
        collection.insert(%Syz3d.Player{room_slug: slug_param})
        render(conn, slug: slug_param)
      _ ->
        conn
        |> put_status(307)
        |> redirect(to: Routes.room_overcap_path(conn, :show, slug_param))
    end
  end

end
