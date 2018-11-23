import React, { useEffect, Fragment, useState, useRef } from "react";
import ReactDOM from "react-dom";
import "phoenix_html";

import "../css/app.css";
import { lobbyChannel } from "./socket";

function useMessageFeed() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const messagesHandler = payload => {
      setMessages(messages => {
        messages.push(payload);
        return messages;
      });
    };
    const serverMessagesHandler = payload => {
      setMessages(messages => {
        messages.push({
          ...payload,
          author: "Notification",
          style: { color: "red", fontSize: "25px" }
        });
        return messages;
      });
    };
    lobbyChannel.on("message", messagesHandler);
    lobbyChannel.on("server", serverMessagesHandler);
    return () => {
      lobbyChannel.off("message", messagesHandler);
      lobbyChannel.off("server", serverMessagesHandler);
    };
  }, []);
  const sendMessage = message => {
    lobbyChannel.push("message", {
      body: message.body,
      author: message.author
    });
  };
  return {
    messages,
    sendMessage
  };
}

function App() {
  const { messages, sendMessage } = useMessageFeed();
  const [author, setAuthor] = useState("");
  useEffect(() => {
    fetch("http://faker.hook.io/?property=name.findName&locale=en_IND")
      .then(response => response.text())
      .then(JSON.parse)
      .then(setAuthor);
  }, []);
  return (
    <Fragment>
      <Messages messages={messages} />
      <MessageForm author={author} onMessageSend={sendMessage} />
    </Fragment>
  );
}

function Messages({ messages }) {
  return (
    <Fragment>
      <h1>Message Feed</h1>
      <div id="message-feed">
        {messages.map(({ body, author, style }, index) => (
          <div key={index}>
            <strong style={style}>{author}: </strong>
            {body}
          </div>
        ))}
      </div>
      <hr />
    </Fragment>
  );
}

function MessageForm({ onMessageSend, author }) {
  const [message, setMessage] = useState("");
  const messageInput = useRef(null);
  useEffect(() => {
    messageInput.current.focus();
  }, []);

  const handleMessage = ev => {
    setMessage(ev.target.value);
  };

  const sendMessage = ev => {
    ev.preventDefault();
    onMessageSend({ body: message, author });
    setMessage("");
    messageInput.current.focus();
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        placeholder="Type your message..."
        className="message-input"
        ref={messageInput}
        value={message}
        onChange={handleMessage}
      />
    </form>
  );
}

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
