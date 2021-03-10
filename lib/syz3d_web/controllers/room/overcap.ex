defmodule Syz3dWeb.Room.Overcap do
  @moduledoc """
  Route for showing a message when a room is over capacity
  """

  use Syz3dWeb, :controller

  def show(conn, _params) do
    render(conn, "over_capacity.html")
  end
end
