defmodule Syz3dWeb.Router do
  use Syz3dWeb, :router

  import Plug.BasicAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {Syz3dWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :admins_only do
    plug :basic_auth, username: "syzygy", password: System.get_env("SYZ3D_ADMIN_PASSWORD") || ""
  end

  pipeline :web_app do
    plug :put_root_layout, {Syz3dWeb.LayoutView, :web_app_root}
  end

  scope "/", Syz3dWeb do
    pipe_through :browser

    live "/", PageLive, :index

    scope "/room" do
      pipe_through :web_app
      # live "/new", Room.NewLive, :new, as: :new_room

      # TODO drop the as: alias here?
      get "/:slug", Room.Show, :show, as: :show_room

      get "/:slug/overcap", Room.Overcap, :show, as: :room_overcap
    end

  end

  # Other scopes may use custom stacks.
  # scope "/api", Syz3dWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  import Phoenix.LiveDashboard.Router

  scope "/backstage" do
    pipe_through [:browser, :admins_only]
    live_dashboard "/dashboard", metrics: Syz3dWeb.Telemetry
    live "/players", Syz3dWeb.Player.IndexLive
  end
end
