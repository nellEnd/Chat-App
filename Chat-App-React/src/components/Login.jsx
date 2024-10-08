import React, { useState } from "react";
import Toastify from "toastify-js";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true); // show loader

      await loginSuccess();

      setLoading(false);
    }
  };

  const loginSuccess = async () => {
    try {
      const response = await fetch("https://localhost:7188/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("jwtToken", data.token);
        Toastify({
          text: data.message,
          duration: 2000,
        }).showToast();
        setTimeout(() => navigate("/chat"), 2000);
      } else {
        Toastify({
          text: "Username or password is incorrect. Try again.",
          duration: 3000,
        }).showToast();
      }
    } catch (error) {
      console.error("Error: ", error);
      Toastify({
        text: "An unexpected error occurred. Please try again.",
        duration: 3000,
      }).showToast();
    }
  };

  return (
    <>
      <div className="container">
        <form id="loginForm" onSubmit={handleSubmit}>
          <h1>Login</h1>
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
          <button type="submit" disabled={loading}>
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
