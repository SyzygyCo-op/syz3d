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

  def get_initial_data() do
    %{
      "river_island" => %{
        "glft_url" => "/3d/game.glb",
        "position" => [0, 0, 0],
        "rotation" => [0, 0, 0, "YXZ"],
        "scale" => [1, 1, 1],
      },
      "river_island_collision" => %{
        "glft_url" => "/3d/collision.glb",
        "position" => [0, 0, 0],
        "rotation" => [0, 0, 0, "YXZ"],
        "scale" => [1, 1, 1],
        "use_gltf_for_collision" => true
      },
    }
  end

  def list_test_entity_ids(player_id) do
    Enum.map(0..1, fn index -> "tie_fighter:#{player_id}:#{index}" end)
  end

  def map_test_entities(world_data, player_id, value_fn) do
    Enum.reduce(list_test_entity_ids(player_id), world_data, fn entity_id, acc ->
      Map.put(acc, entity_id, value_fn.())
    end)
  end

  def assign_test_entities(world_data, player_id) do
    map_test_entities(world_data, player_id, fn ->
      %{
        "glft_url" => "/3d/TieFighter/model.glb",
        "position" => random_position(),
        "rotation" => random_euler(),
        "scale" => [0.1, 0.1, 0.1],
        "owner" => player_id,
          # "velocity" => [0, 0, 0],
          # "angular_velocity" => [0, :rand.uniform() * 0.3 + 0.1, 0],
      }
    end)
  end

end
