defmodule Mix.Tasks.CopyAssets do
  use Mix.Task

  def run(_) do
    shell = Mix.shell()
    shell.info("copying static assets")
    shell.cmd("rm -rf priv/static && cp -a assets/static priv")
  end
end
