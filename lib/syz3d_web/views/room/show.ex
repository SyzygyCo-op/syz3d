defmodule Syz3dWeb.Room.ShowView do
  @moduledoc """
  Route for joining a game room.
  """
  use Syz3dWeb, :view

  def js_script_tag do
    if Mix.env == :prod do
      ~s(<script defer phx-track-static src="/js/app.js"></script>)
    else
      {:ok, hostname} = :inet.gethostname
      ~s(<script defer phx-track-static crossorigin src="http://#{hostname}:8080/js/app.js"></script>)
    end
  end
end
