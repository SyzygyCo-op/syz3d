defmodule Syz3d.Repo do
  use Ecto.Repo,
    otp_app: :syz3d,
    adapter: Ecto.Adapters.Postgres
end
