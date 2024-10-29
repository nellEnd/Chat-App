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

 // Sätter upp SignalR on component mount
 useEffect(() => {
    const token = sessionStorage.getItem("jwtToken"); // Hämta JWT-token från sessionStorage
    if (token) {
        // Dekodera token för att få användarnamnet
        const decodedJwt = JSON.parse(atob(token.split(".")[1]));
        setUsername(decodedJwt.unique_name);

        // Skapa en ny SignalR-anslutning med JWT-token
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:5001/chathub", {
                accessTokenFactory: () => token,
            })
            .build();

        // Starta SignalR-anslutningen
        newConnection
            .start()
            .then(() => {
                console.log("Connected to the hub!");
                setConnection(newConnection); // Sätt anslutningen i state
            })
            .catch((err) => console.error("Connection error:", err));
    } else {
        setAuthorized(false); // Om ingen token finns, är användaren ej auktoriserad
    }

    // Clean up anslutningen vid avmontering
    return () => {
        if (connection) connection.stop();
    };
}, []);

// lyssna på inkommande meddelanden från servern när anslutningen är etablerad
useEffect(() => {
    if (connection) {
        // Hantera mottagande av meddelanden från servern
        const receiveMessageHandler = (user, message) => {
            // Sanera användarnamn och meddelande för att undvika XSS-attacker
            const sanitizedUser = DOMPurify.sanitize(user, { ALLOWED_TAGS: ["b"] });
            const sanitizedMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: ["b"] });

            // Uppdatera meddelanden-state med det nya meddelandet
            setMessages((prevMessages) => [
                ...prevMessages,
                { user: sanitizedUser, message: sanitizedMessage },
            ]);
        };

        // Registrera event listener för att ta emot meddelanden från servern
        connection.on("ReceiveMessage", receiveMessageHandler);

        // Ta bort event listener när komponenten avmonteras eller anslutningen ändras
        return () => {
            connection.off("ReceiveMessage", receiveMessageHandler);
        };
    }
}, [connection]);

// Funktion för att skicka meddelanden till servern
const sendMessage = () => {
    if (message.trim() && connection) {
        try {
            // Skicka meddelandet med användarnamn till servern
            connection.send("sendMessage", username, message).then(() => {
                setMessage(""); // Töm meddelandefältet efter att ha skickat
                console.log("Sending message: ", message);
            });
        } catch (err) {
            console.error("Message sending error:", err);
        }
    }
};

// Funktion för att logga ut användaren och stoppa anslutningen
const logOut = () => {
    if (connection) {
        // Stoppa anslutningen och ta bort JWT-token från sessionStorage
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

// Funktion för att hantera när användaren trycker på Enter-tangenten (för att skicka meddelande)
const handleKeyPress = (event) => {
    if (event.key === "Enter" && message.trim()) {
        sendMessage();
    }
};

// Ge contextvärdena till child components genom ChatContext.Provider
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