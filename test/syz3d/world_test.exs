defmodule Syz3d.WorldTest do
  use ExUnit.Case, async: true
  alias Syz3d.World

  # TODO support multiple worlds using a GenServer to manage one agent per world,
  # TODO use string keys upsert / remove and snake case inside entities

  setup do
    initial_data = %{
      anEntity: %{
        aComponent: %{
          value: "blue"
        }
      }
    }

    {:ok, _wid} = World.start_link(initial_data, :a)

    %{initial_data: initial_data}
  end

  test "get/1 returns complete state", %{initial_data: initial_data} do
    assert World.get(:a) === initial_data
  end

  test "produce_diff/1 returns complete state when given empty state" do
    # TODO
  end

  test "produce_diff/1 returns complementary partial state when given partial state" do
    # TODO
  end

  test "apply_diff/1 upserts entities/components" do
    World.apply_diff(
      %World.Diff{
        upsert: %{
          anEntity: %{
            anotherComponent: %{
              value: "smurf"
            }
          },
          anotherEntity: %{
            aComponent: %{
              value: "red"
            }
          }
        },
        remove: %{}
      },
      wid: :a
    )

    assert World.get(:a) === %{
      anEntity: %{
        aComponent: %{
          value: "blue"
        },
        anotherComponent: %{
          value: "smurf"
        }
      },
      anotherEntity: %{
        aComponent: %{
          value: "red"
        }
      }
    }
  end

  test "apply_diff/1 removes entities/components", %{initial_data: initial_data} do
    data_with_more_stuff = %{
      anEntity: %{
        aComponent: %{
          value: "blue"
        },
        anotherComponent: %{
          value: "smurf"
        }
      },
      anotherEntity: %{
        aComponent: %{
          value: "red"
        }
      }
    }

    {:ok, wid} = World.start_link(data_with_more_stuff, :b)

    World.apply_diff(
      %{
        upsert: %{},
        remove: %{
          anEntity: %{
            anotherComponent: true
          },
          anotherEntity: true
        }
      },
      wid: :b
    )

    assert World.get(wid) === initial_data
  end

  test "apply_diff/2 provides a callback for when entities are updated" do
    {:ok, _wid} = World.start_link(%{}, :c)

    World.apply_diff(
      %World.Diff{
        upsert: %{
          npcEntity: %{
            color: "green"
          },
          playerEntity: %{
            is_player: true
          },
        }
      },
      on_entity_upsert: fn
        _entity_id,
        _component_map_old,
        component_map_new ->
          case component_map_new do
            %{ is_player: true } ->
              Map.merge(component_map_new, %{updatedAt: "11:11:11"})
            _ ->
              component_map_new
          end
        end,
      wid: :c
    )

    assert World.get(:c) === %{
      npcEntity: %{
        color: "green"
      },
      playerEntity: %{
        is_player: true,
        updatedAt: "11:11:11"
      }
    }
  end
end
