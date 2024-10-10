import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();

  const startChat = () => {
    navigate("/chat");
  };

  return (
    <div>
      <button onClick={startChat}>Start chatting</button>
      <button onClick={startPrivateChat}>Start a private chat</button>
    </div>
  );
};

export default Start;
