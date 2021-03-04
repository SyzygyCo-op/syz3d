defmodule Syz3d.WorldTest do
  use ExUnit.Case, async: true
  alias Syz3d.World

  # TODO support multiple worlds using a GenServer to manage one agent per world,
  # TODO @docs, fix tests

  test "get/1 returns complete state" do
    initial_data = %{
      anEntity: %{
        aComponent: %{
          value: "blue"
        }
      }
    }
    {:ok, wid} = World.start_link(initial_data)

    assert World.get(wid) === initial_data
  end

  test "produce_diff/1 returns complete state when given empty state" do
    # TODO
  end

  test "produce_diff/1 returns complementary partial state when given partial state" do
    # TODO
  end

  test "apply_diff/1 upserts entities/components" do
    initial_data = %{
      anEntity: %{
        aComponent: %{
          value: "blue"
        }
      }
    }
    {:ok, wid} = World.start_link(initial_data)

    World.apply_diff(wid, %World.Diff{
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
    })

    assert World.get(wid) === %{
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

  test "apply_diff/1 removes entities/components" do
    initial_data = %{
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

    {:ok, wid} = World.start_link(initial_data)

    World.apply_diff(wid, %{
      upsert: %{},
      remove: %{
        anEntity: %{
          anotherComponent: true
        },
        anotherEntity: true
      }
    })

    assert World.get(wid) === %{
      anEntity: %{
        aComponent: %{
          value: "blue"
        }
      }
    }
  end
end
