defmodule Syz3dWeb.LayoutView do
  use Syz3dWeb, :view

def js_script_tag do
  if Mix.env == :prod do
    ~s(<script defer phx-track-static src="/js/app.js"></script>)
  else
    ~s(<script defer phx-track-static crossorigin src="http://localhost:8080/js/app.js"></script>)
  end
  end

  def css_link_tag do
    if Mix.env == :prod do
      ~s(<link rel="stylesheet" type="text/css" href="/css/app.css" media="screen,projection" />)
    else
      ""
    end
  end
end
