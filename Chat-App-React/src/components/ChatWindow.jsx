// ChatWindow.js
import React, { useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import "./ChatWindow.css";
import "./Chat.css";

const ChatWindow = ({
  messages,
  username,
  sendMessage,
  message,
  setMessage,
  handleKeyPress,
}) => {
  const chatRef = useRef(null);

  // Scroll to the bottom when a new message is received
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <div id="chat" ref={chatRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-box ${
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
