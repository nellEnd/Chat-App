import React, { useContext, useState } from "react";
import Toastify from "toastify-js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Chat.css";

const Login = () => {
  const {login, loading} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) =>{
    e.preventDefault();

    // check that username and password are not empty 
    if(username&& password) {
      await login(username, password); // use login function from AuthContext
    }
  };

  return (
    <>
      <div className="container">
        <form className="loginForm" id="loginForm" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button className="loginBtn" type="submit" disabled={loading}>
            Login
          </button>
          <div className="clearfix"></div>
        </form>
      </div>
      {loading && (
        <div id="loader" style={{ display: "flex" }}>
          ⟳ Loading...
        </div>
      )}
    </>
  );
};



export default Login;
