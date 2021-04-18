defmodule Syz3d.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Syz3d.Repo,
      # Start the Telemetry supervisor
      Syz3dWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Syz3d.PubSub},
      # Start our Presence module.
      Syz3dWeb.Presence,
      # Start the Endpoint (http/https)
      Syz3dWeb.Endpoint,
      # Start a worker by calling: Syz3d.Worker.start_link(arg)
      {Syz3d.World, Syz3d.Game.get_initial_data()},
      {Syz3d.Player.Collection, %{}}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Syz3d.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Syz3dWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
