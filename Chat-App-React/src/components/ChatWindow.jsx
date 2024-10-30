// ChatWindow.js
import React, { useRef, useEffect, useContext } from "react";
import DOMPurify from "dompurify";
import "./ChatWindow.css";
import "./Chat.css";
import { ChatContext } from "../context/ChatContext";

const ChatWindow = () => {
  const {
    messages,
    username,
    sendMessage,
    message,
    setMessage,
    handleKeyPress,
  } = useContext(ChatContext);

  return (
    <div>
      <div id="chat">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-box ${
              // Check if the message is sent or received, triggers different css depending on state
              msg.user === username ? "sent" : "received"
            }`}
          >
            <div className="username">{msg.user}:</div>{" "}
            <div className="message-content">
              {DOMPurify.sanitize(msg.message)}
            </div>
          </div>
        ))}
      </div>
      <div className="message-input-wrapper">
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button id="sendBtn" onClick={sendMessage} disabled={!message.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
