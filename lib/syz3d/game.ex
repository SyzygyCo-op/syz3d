defmodule  Syz3d.Game do
  def get_initial_data() do
    {:ok, content} = File.read("./assets/static/gamedata.json")
    Jason.decode!(content)
  end
end
