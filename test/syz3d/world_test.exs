defmodule Syz3d.WorldTest do
  use ExUnit.Case, async: true
  alias Syz3d.World

  # TODO support multiple worlds using a GenServer to manage one agent per world,
  # TODO @docs

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
    World.apply_diff(%World.Diff{
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
    }, :a)

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

    {:ok, wid} = World.start_link(data_with_more_stuff, :c)

    World.apply_diff(%{
      upsert: %{},
      remove: %{
        anEntity: %{
          anotherComponent: true
        },
        anotherEntity: true
      }
    }, :c)

    assert World.get(wid) === initial_data
  end

  test "Diff.from_presence" do
    presence_diff = %{
      joins: %{},
      leaves: %{
        "player:a385" => %{
          metas: [%{phx_ref: "FmoyQpF0NpOd8gAF"}]
        },
        "player:a386" => %{
          metas: [%{phx_ref: "FmoyQpF0NpOd8gAF"}]
        }
      }
    }

    assert World.Diff.from_presence(presence_diff) === %World.Diff{
      upsert: %{},
      remove: %{
        "player:a385" => true,
        "player:a386" => true
      }
    }
  end
end
