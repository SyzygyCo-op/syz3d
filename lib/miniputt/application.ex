defmodule Miniputt.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Miniputt.Repo,
      # Start the Telemetry supervisor
      MiniputtWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Miniputt.PubSub},
      # Start the Endpoint (http/https)
      MiniputtWeb.Endpoint
      # Start a worker by calling: Miniputt.Worker.start_link(arg)
      # {Miniputt.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Miniputt.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    MiniputtWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
