defmodule Syz3dWeb.Room.ShowTest do
  use Syz3dWeb.ConnCase

  # 1. Import Mox
  import Mox
  # 2. setup fixtures
  setup :verify_on_exit!

  test "accessing the room", %{conn: conn} do
    expect(Syz3d.Room.ConfigMock, :get_max_ccu, 1, fn "xyz" -> 20 end)
    expect(Syz3d.Player.CollectionMock, :size, 1, fn room_slug: "xyz" -> 1 end)
    expect(Syz3d.Player.CollectionMock, :insert, 1, fn %Syz3d.Player{room_slug: "xyz"} -> :ok end)

    conn_post_get = get(conn, Routes.show_room_path(conn, :show, :xyz))

    assert html_response(conn_post_get, 200)
  end

  test "limiting concurrent players (CCU)", %{conn: conn} do
    expect(Syz3d.Room.ConfigMock, :get_max_ccu, 1, fn "xyz" -> 20 end)
    expect(Syz3d.Player.CollectionMock, :size, 1, fn room_slug: "xyz" -> 21 end)

    conn_post_get = get(conn, Routes.show_room_path(conn, :show, :xyz))

    assert redirected_to(conn_post_get, 307) == Routes.room_overcap_path(conn_post_get, :show, :xyz)
  end
end
