defmodule Syz3dWeb.Presence do
  use Phoenix.Presence,
    otp_app: :syz3d,
    pubsub_server: Syz3d.PubSub


  def is_zombie?(socket, key) do
    [] == get_by_key(socket, key)
  end

  def list_zombies(socket, keys) do
    for key <- keys, is_zombie?(socket, key) do
      key
    end
  end
end
