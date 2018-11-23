defmodule WsThingsWeb.PageController do
  use WsThingsWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
