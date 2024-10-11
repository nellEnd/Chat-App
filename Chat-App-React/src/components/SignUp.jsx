import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "./Signup.css";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      Toastify({
        text: "Passwords do not match!",
        duration: 3000,
      }).showToast();
      return;
    }

    try {

      // Send POST request to server to create a new user
      const response = await fetch("https://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convert java object to JSON-string
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
        }),
      });

      if (response.ok) {
        // If request was successful navigate to login page
        navigate("/login");
      } else {
        const data = await response.json();
        Toastify({
          text: data.message,
          duration: 3000,
        }).showToast();
      }
    } catch (error) {
      console.error("Error:", error);
      Toastify({
        text: "An unexpected error occurred. Please try again.",
        duration: 3000,
      }).showToast();
    }
  };

  return (
    <div className="signupContainer">
      <h2>Sign up</h2>
      <form className="signupForm" onSubmit={handleSubmit}>
        <div className="inputs">
          <input
            type="text"
            id="username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="inputs">
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="inputs">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className="signupBtn" type="submit">Sign Up</button>
      </form>
      <Link to="/login">Already have an account? Log in here!</Link>

    </div>
  );
};

export default SignupForm;
