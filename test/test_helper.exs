ExUnit.start()
Ecto.Adapters.SQL.Sandbox.mode(Syz3d.Repo, :manual)

# define dynamic mocks, which will be used to override real modules in
# `config/test.exs`
Mox.defmock(Syz3d.Player.CollectionMock, for: Syz3d.Player.CollectionBehaviour)
Mox.defmock(Syz3d.DynamicConfigMock, for: Syz3d.DynamicConfigBehaviour)

