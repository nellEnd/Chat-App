import { createContext, useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [connection, setConnection] = useState(null);
  const [authorized, setAuthorized] = useState(true);

  const navigate = useNavigate();

 // Set up SignalR on component mount
 useEffect(() => {
    const token = sessionStorage.getItem("jwtToken"); // Hämta JWT-token från sessionStorage
    if (token) {
        // Decode token to access username
        const decodedJwt = JSON.parse(atob(token.split(".")[1]));
        setUsername(decodedJwt.unique_name);

        // Create new SignalR connection with JWT-token
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:5001/chathub", {
                accessTokenFactory: () => token,
            })
            .build();

        // Start SignalR connection
        newConnection
            .start()
            .then(() => {
                console.log("Connected to the hub!");
                setConnection(newConnection); // set connection in state
            })
            .catch((err) => console.error("Connection error:", err));
    } else {
        setAuthorized(false); // If token don't exist, user is not authorized
    }

    // Clean up connection on unmount
    return () => {
        if (connection) connection.stop();
    };
}, []);

// listen for incoming messages from the server when the connection is established
useEffect(() => {
    if (connection) {
        // Handle receiving messages from server
        const receiveMessageHandler = (user, message) => {
            // Sanitize user & message to prevent XXS attacks
            const sanitizedUser = DOMPurify.sanitize(user, { ALLOWED_TAGS: ["b"] });
            const sanitizedMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: ["b"] });

            // Update message state with new message
            setMessages((prevMessages) => [
                ...prevMessages,
                { user: sanitizedUser, message: sanitizedMessage },
            ]);
        };

        // Register event listener to receive messages from server
        connection.on("ReceiveMessage", receiveMessageHandler);

        // Remove event event listener on component unmount or connection changes
        return () => {
            connection.off("ReceiveMessage", receiveMessageHandler);
        };
    }
}, [connection]);

// Send messages to server
const sendMessage = () => {
    if (message.trim() && connection) {
        try {
            // Send message with username to server
            connection.send("sendMessage", username, message).then(() => {
                setMessage(""); // Empty message field when sent
                console.log("Sending message: ", message);
            });
        } catch (err) {
            console.error("Message sending error:", err);
        }
    }
};

// Function to log out the user and stop the connection
const logOut = () => {
    if (connection) {
        // Stop connection and remove JWT-token from sessionStorage
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

// Handle when user presses "Enter" button to send message
const handleKeyPress = (event) => {
    if (event.key === "Enter" && message.trim()) {
        sendMessage();
    }
};

// Give context values to child components with ChatContext.Provider
return (
    <ChatContext.Provider
        value={{
            message,
            setMessage,
            messages,
            username,
            sendMessage,
            handleKeyPress,
            logOut,
            authorized,
        }}
    >
        {children}
    </ChatContext.Provider>
);
};