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
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if username and password are entered
    if (username && password) {
      await loginSuccess();
    }
  };

  const loginSuccess = async () => {
    try {
      // Send a POST request to the login API with the username and password
      const response = await fetch("https://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Pass username and password in the request b
      });

      // If login is successful
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("jwtToken", data.token);

        // Show success message via toast notification
        Toastify({
          text: "⟳ Loading...",
          duration: 1000,
        }).showToast();

        // Navigate to Chat page after 1 second
        setTimeout(() => navigate("/chat"), 1000);
      } else {
        Toastify({
          text: "Username or password is incorrect. Try again.",
          duration: 3000,
        }).showToast();
      }
    } catch (error) {
      // Log any unexpected errors and show a toast notification
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
      {/* Display loading spinner when loading state is true */}
      {loading && (
        <div id="loader" style={{ display: "flex" }}>
          ⟳ Loading...
        </div>
      )}
    </>
  );
};

export default Login;
