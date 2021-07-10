# Syz3d

## Design goals

- Accessibility > high-end features
- Low cost development and maintenance
- high availability
- Create an experience that comes as close as possible to a physical community space
- Facilitates creative expression, easy for non-technical creatives to contribute to the experience

## Developer notes

If `postgres` was installed with Homebrew, then run

```
/usr/local/opt/postgres/bin/createuser -s postgres
```

To start your Phoenix server:

- Install dependencies with `mix deps.get`
- Create and migrate your database with `mix ecto.setup`
- Install Node.js dependencies with `npm install` inside the `assets` directory
- Start postgres database server with `pg_ctl start -D ~/pgsql_data`
- Start Phoenix endpoint with `mix dev` or `iex -S mix dev`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more about relevant technology

- Phoenix docs: https://hexdocs.pm/phoenix
- Backend tech walkthrough (aspirational): https://littlelines.com/blog/2020/07/06/building-a-video-chat-app-in-phoenix-liveview
- ECS: https://ecsy.io/
- Rendering tech: https://github.com/pmndrs/react-three-fiber
