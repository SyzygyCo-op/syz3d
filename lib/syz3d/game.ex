defmodule  Syz3d.Game do
  def random_euler do
    [
      :rand.uniform() * 4 - 2,
      :rand.uniform() * 4 - 2,
      0,
      "YXZ"
    ]
  end
  def random_position do
    [
      :rand.uniform() * 4 - 2,
      :rand.uniform() * 4,
      :rand.uniform() * 4 - 2,
    ]
  end

  def assign_test_entities(world_data, player_id) do
    Enum.reduce(0..25, world_data, fn index, acc ->
      Map.put(acc, "tie_fighter:#{player_id}:#{index}", %{
        "glft_url" => "/3d/TieFighter/model.glb",
        "position" => random_position(),
        "rotation" => random_euler(),
        "scale" => [0.1, 0.1, 0.1],
        "owner" => player_id,
          # "velocity" => [0, 0, 0],
          # "angular_velocity" => [0, :rand.uniform() * 0.3 + 0.1, 0],
        "render_to_canvas" => true
      })
    end)
  end
end
