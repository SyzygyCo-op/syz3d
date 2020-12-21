defmodule Miniputt.Repo do
  use Ecto.Repo,
    otp_app: :miniputt,
    adapter: Ecto.Adapters.Postgres
end
