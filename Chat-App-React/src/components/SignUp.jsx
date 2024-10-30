// SignupForm.js
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Signup.css";

const SignupForm = () => {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Invoke signup function from AuthContext
    signup(username, password, confirmPassword);
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
        <button className="signupBtn" type="submit">
          Sign Up
        </button>
      </form>
      <Link to="/login">Already have an account? Log in here!</Link>
    </div>
  );
};

export default SignupForm;
