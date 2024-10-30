import { useEffect, useState, useRef, useContext } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import "./Chat.css";
import ChatWindow from "./ChatWindow";
import logoutLogo from "../assets/logout.png";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const {messages, username, sendMessage, message, setMessage, handleKeyPress, logOut, authorized} = useContext(ChatContext);

  if (!authorized) {
    return (
      <div className="wrapper">
        <div id="chat">You are not authorized! ⛔</div>
      </div>
    );
  }

  return (
    <div className="container">
      <ChatWindow
        messages={messages}
        username={username}
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
        handleKeyPress={handleKeyPress}
      />
      <img src={logoutLogo} className="logout" onClick={logOut}></img>
    </div>
  );
};

export default Chat;
