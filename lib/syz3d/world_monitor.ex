defmodule Syz3d.World.Monitor do
  def start_link(initial_state) do
    Agent.start_link(fn -> initial_state end, name: __MODULE__)
  end
end
