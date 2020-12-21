# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :miniputt,
  ecto_repos: [Miniputt.Repo]

# Configures the endpoint
config :miniputt, MiniputtWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "zDKV40bBx0x/KtmyYNOW+ZQRtNziO1GoxZRkjbZm5WEicwK8SrRHLMyHuTABUm+1",
  render_errors: [view: MiniputtWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Miniputt.PubSub,
  live_view: [signing_salt: "YC0uVXxW"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
