defmodule Syz3dWeb.Presence do
  use Phoenix.Presence,
    otp_app: :syz3d,
    pubsub_server: Syz3d.PubSub
end
