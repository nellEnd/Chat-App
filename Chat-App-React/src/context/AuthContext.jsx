import { useState, createContext } from "react";
import Toastify from "toastify-js";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AppService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = async (username, password) => {
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      sessionStorage.setItem("jwtToken", data.token);
      setIsAuthenticated(true);
      Toastify({
        text: "⟳ Loading...",
        duration: 1000,
      }).showToast();

      setTimeout(() => navigate("/chat"), 1000);
    } catch (error) {
      Toastify({
        text: error.message,
        duration: 3000,
      }).showToast();
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
