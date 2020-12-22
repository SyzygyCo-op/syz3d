defmodule MiniputtWeb.Room.ShowLive do
  @moduledoc """
  A LiveView for creating and joining chat rooms.
  """

  use MiniputtWeb, :live_view

  alias Miniputt.Organizer

  @impl true
  def render(assigns) do
    ~L"""
    <h1><%= @room.title %></h1>
    """
  end

  @impl true
  def mount(%{"slug" => slug}, _session, socket) do
    case Organizer.get_room(slug) do
      nil ->
        {:ok,
          socket
          |> put_flash(:error, "That room does not exist.")
          |> push_redirect(to: Routes.new_room_path(socket, :new))
        }
      room ->
        {:ok,
          socket
          |> assign(:room, room)
        }
    end
  end
end
