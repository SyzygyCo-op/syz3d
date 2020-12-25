defmodule MiniputtWeb.Room.Show do
  @moduledoc """
  Route for joining a game room.
  """

  use MiniputtWeb, :controller

  def show(conn, params) do
    render(conn, slug: params["slug"])
  end

end
