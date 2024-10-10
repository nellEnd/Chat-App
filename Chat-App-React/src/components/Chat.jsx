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

  // useEffect to handle the setup of the SignalR connection on component mount
  useEffect(() => {

    // Get JWT token form session storage
    const token = sessionStorage.getItem("jwtToken");

    // if token exists decote it and establish SignalR connection
    if (token) {
      const decodedJwt = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedJwt.unique_name);

      // Create a new signalR connection
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub", {
          accessTokenFactory: () => token, // Attach JWT token to the connection
        })
        .build();

        // Start sinalR connection
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

  // useEffect to handle receiving messages from the server when the connection is established
  useEffect(() => {
    if (connection) {

      // Function for receiveing messages from the server
      const receiveMessageHandler = (user, message) => {
        console.log("Received message:", "User:", user, "Message:", message);

        // Sanitize the received user and message to prevent XSS attacks
        const sanitizedUser = DOMPurify.sanitize(user, { ALLOWED_TAGS: ["b"] });
        const sanitizedMessage = DOMPurify.sanitize(message, {
          ALLOWED_TAGS: ["b"],
        });
        
        // Update the messages state to include new message
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: sanitizedUser, message: sanitizedMessage },
        ]);
      };

      // Register event listener to listen for messages from server
      connection.on("ReceiveMessage", receiveMessageHandler);

      // Clean up the event listener when the component unmounts or connection changes
      return () => {
        connection.off("ReceiveMessage", receiveMessageHandler);
      };
    }
  }, [connection]);

  // Send message function
  const sendMessage = () => {
    if (message.trim() && connection) {
      try {
        // Send message with username to server
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

      // Stop conncetion and remove JWT token from session storage
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

  // If user not authorized, tell user
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
