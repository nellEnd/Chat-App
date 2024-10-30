import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

const Start = () => {
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [connection, setConnection] = useState(null);
  const [users, setUsers] = useState([]);
  const [inviter, setInviter] = useState("");

  // On component mount, set up signalR connection & get token from jwt
  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      const decodedJwt = JSON.parse(atob(token.split(".")[1]));
      const inviterName = decodedJwt.unique_name;
      setInviter(inviterName);
      console.log("Inviter: ", inviterName);

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub", {
          accessTokenFactory: () => sessionStorage.getItem("jwtToken"),
        })
        .build();

      newConnection
        .start()
        .then(() => {
          console.log("Conntected to the hub!");
          setConnection(newConnection);
        })
        .catch((err) => console.error("Connection error: ", err));
      return () => {
        if (connection) connection.stop();
      };
    } else {
      navigate("/login");
    }

    // Stop connection on unmount
  }, [navigate]); // Empty array = will only run on component mount

  //Listen for invitations
  useEffect(() => {
    if (connection) {
      connection.on("ReceiveInvitation", (inviter, chatRoomId) => {
        setInvitation({ inviter, chatRoomId }); // save invitations
        alert(`${inviter} has invited you to a private chat!`);
        console.log(`${inviter} has invited you to a private chat!`);
      });
      // Clean up listener when component unmounts or connection changes
      return () => {
        connection.off("ReceiveInvitation");
      };
    }
  }, [connection]);

  // fetch all users in database
  useEffect(() => {
    fetch("https://localhost:5001/api/auth/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users: ", error));
  }, []);

  const startChat = () => {
    navigate("/chat");
  };

  const startPrivateChat = (userId) => {
    if (connection) {
      const chatRoomId = generateChatRoomId();
      console.log("Sending invitation with:", { userId, chatRoomId, inviter });

      connection
        .send("SendInvitation", userId, chatRoomId, inviter)
        .then(() => {
          navigate(`/privatechat/${chatRoomId}`);
        })
        .catch((error) => console.error("Error sending invitation:", error));
    }
  };

  const generateChatRoomId = () => {
    return `private_${Date.now()}`;
  };

  return (
    <div>
      <button onClick={startChat}>Start chatting</button>
      <h3>Start a private chat with:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username}{" "}
            <button onClick={() => startPrivateChat(user.id)}>Invite</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Start;
