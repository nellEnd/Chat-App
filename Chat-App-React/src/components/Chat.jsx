import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import "./Chat.css";
import ChatWindow from "./ChatWindow";
import logoutLogo from "../assets/logout.png";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [connection, setConnection] = useState(null);
  const [authorized, setAuthorized] = useState(true);
  const chatRef = useRef(null);
  const navigate = useNavigate();

  // On component mount, set up SignalR connection
  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");

    if (token) {
      const decodedJwt = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedJwt.unique_name);

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub", {
          accessTokenFactory: () => token,
        })
        .build();

      newConnection
        .start()
        .then(() => {
          console.log("Connected to the hub!");
          setConnection(newConnection);
        })
        .catch((err) => console.error("Connection error:", err));
    } else {
      setAuthorized(false);
    }

    // Clean up on unmount
    return () => {
      if (connection) connection.stop();
    };
  }, []);

  // Handle receiving messages from the server
  useEffect(() => {
    if (connection) {
      const receiveMessageHandler = (user, message) => {
        console.log("Received message:", "User:", user, "Message:", message);
        const sanitizedUser = DOMPurify.sanitize(user, { ALLOWED_TAGS: ["b"] });
        const sanitizedMessage = DOMPurify.sanitize(message, {
          ALLOWED_TAGS: ["b"],
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: sanitizedUser, message: sanitizedMessage },
        ]);
      };
      // Register event listener
      connection.on("ReceiveMessage", receiveMessageHandler);
      // Clean up the event listener when the component unmounts or connection changes
      return () => {
        connection.off("ReceiveMessage", receiveMessageHandler);
      };
    }
  }, [connection]);

  /*if (connection) {
       connection.on("ReceiveMessage", (user, message) => {
        console.log("Received message:", "User:", user, "Message:", message);
        const sanitizedUser = DOMPurify.sanitize(user, { ALLOWED_TAGS: ["b"] });
        const sanitizedMessage = DOMPurify.sanitize(message, {
          ALLOWED_TAGS: ["b"],
        });
        setMessages((prevMessages) => {
          const newMessages = [
            ...prevMessages,
            { user: sanitizedUser, message: sanitizedMessage },
          ];
          console.log("Updated messages:", newMessages);
          return newMessages;
        });
      });
    }
  }, [connection]); */

  // Send message function
  const sendMessage = () => {
    if (message.trim() && connection) {
      try {
        connection.send("sendMessage", username, message).then(() => {
          setMessage(""); // Clear input field after sending
          console.log("Sending message: ", message);
        });
      } catch (err) {
        console.error("Message sending error:", err);
      }
    }
  };

  // Log out and stop the connection
  const logOut = () => {
    if (connection) {
      connection
        .stop()
        .then(() => {
          sessionStorage.removeItem("jwtToken");
          navigate("/");
        })
        .catch((err) => console.error("Error while stopping connection:", err));
    } else {
      sessionStorage.removeItem("jwtToken");
      navigate("/");
    }
  };

  // Handle key press event (enter to send message)
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && message.trim()) {
      sendMessage();
    }
  };

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
      {/* <button className="logout" onClick={logOut}>Log Out</button> */}
    </div>
  );
};

export default Chat;
