import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/login";
import Signup from "./components/SignUp";
import Start from "./components/Start"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/start" element={<Start />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
