# TODO migrate to https://hexdocs.pm/elixir/master/Config.html?
use Mix.Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :syz3d, Syz3d.Repo,
  username: "postgres",
  password: "postgres",
  database: "syz3d_test#{System.get_env("MIX_TEST_PARTITION")}",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :syz3d, Syz3dWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :syz3d, :player_collection, Syz3d.Player.CollectionMock
config :syz3d, :room_config, Syz3d.Room.ConfigMock
config :syz3d, :presence, Syz3dWeb.PresenceMock
