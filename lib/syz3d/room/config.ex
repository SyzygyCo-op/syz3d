defmodule Syz3d.Room.Config.Behaviour do
  @callback get_max_ccu(slug :: term()) :: pos_integer()
end
