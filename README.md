# Syz3d

If `postgres` was installed with Homebrew, then run

```
/usr/local/opt/postgres/bin/createuser -s postgres
```

To start your Phoenix server:

- Install dependencies with `mix deps.get`
- Create and migrate your database with `mix ecto.setup`
- Install Node.js dependencies with `npm install` inside the `assets` directory
- Start postgres database server with `pg_ctl start -D ~/pgsql_data`
- Start Phoenix endpoint with `mix phx.server` or `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

- Official website: https://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Forum: https://elixirforum.com/c/phoenix-forum
- Source: https://github.com/phoenixframework/phoenix

## Status

Following https://littlelines.com/blog/2020/07/06/building-a-video-chat-app-in-phoenix-liveview

```
mix phx.gen.context Organizer Room rooms title:string slug:string
```
