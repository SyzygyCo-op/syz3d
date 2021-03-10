defmodule Syz3dWeb.Room.Overcap do
  @moduledoc """
  Route for showing a message when a room is over capacity
  """

  use Syz3dWeb, :controller

  def show(conn, params) do
    render(conn, "over_capacity.html", room_url: Routes.show_room_path(conn, :show, params["slug"]))
  end
end
