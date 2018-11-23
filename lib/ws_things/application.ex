defmodule WsThings.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the endpoint when the application starts
      WsThingsWeb.Endpoint,
      # Starts a worker by calling: WsThings.Worker.start_link(arg)
      # {WsThings.Worker, arg},
      WsThingsWeb.Presence
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: WsThings.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    WsThingsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
