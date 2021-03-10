defmodule Syz3d.Room.Config do
  defmodule Behaviour do
    @callback get_max_ccu(slug :: String.t) :: integer()
  end

  @behaviour Behaviour

  def get_max_ccu(_slug) do
    # For now: ignore slug parameter and just use the environment variable
    # Future: allow overriding the environment variable per room
    # may also want a get_max_ccu/0 that returns a global max

    case System.get_env("SYZ3D_ROOM_MAX_CCU_DEFAULT") do
      nil -> 5
      str -> Integer.parse(str)
    end

  end

end
