import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Start from "./components/Start";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/start" element={<Start />} />
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
