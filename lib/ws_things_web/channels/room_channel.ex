defmodule WsThingsWeb.RoomChannel do
    use Phoenix.Channel
    alias WsThingsWeb.Presence

    def join("room:lobby", _message, socket) do
        {:ok, socket}
    end

    def join("room:" <> _private_room_id, _message, _socket) do
        {:error, %{reason: :unauthorized}}
    end

    def handle_in("message", %{"body" => body, "author" => author}, socket) do
        broadcast!(socket, "message", %{body: body, author: author})
        {:noreply, socket}
    end

end