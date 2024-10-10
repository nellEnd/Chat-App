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
      // Scroll the chat to the bottom by setting scrollTop to the scrollHeight
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]); // Run this effect whenever the messages array changes (new message)

  return (
    <div>
      <div id="chat" ref={chatRef}>
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
