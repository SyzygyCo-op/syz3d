defmodule Syz3dWeb.Room.Show do
  @moduledoc """
  Route for joining a game room.
  """

  use Syz3dWeb, :controller

  def show(conn, params) do
    config = Application.get_env(:syz3d, :room_config)
    collection = Application.get_env(:syz3d, :player_collection)
    max_ccu = config.get_max_ccu(params["slug"])
    case collection.size() do
      x when x <= max_ccu ->
        render(conn, slug: params["slug"])
      x ->
        conn
        |> put_status(307)
        |> redirect(to: Routes.room_overcap_path(conn, :show, params["slug"]))
    end
  end

end
