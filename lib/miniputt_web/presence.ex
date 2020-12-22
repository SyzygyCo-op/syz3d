defmodule MiniputtWeb.Presence do
  use Phoenix.Presence,
    otp_app: :miniputt,
    pubsub_server: Miniputt.PubSub
end
