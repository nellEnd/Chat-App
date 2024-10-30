// AuthContext.jsx
import { useState, createContext } from "react";
import Toastify from "toastify-js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (username, password, confirmPassword) => {
    setLoading(true);

    if (password !== confirmPassword) {
      Toastify({
        text: "Passwords do not match!",
        duration: 3000,
      }).showToast();
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      if (response.ok) {
        Toastify({
          text: "Registration successful!",
          duration: 3000,
        }).showToast();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
