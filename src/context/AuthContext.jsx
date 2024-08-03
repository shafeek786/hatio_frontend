import React, { createContext, useContext, useEffect, useState } from "react";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decoding error:", e);
    return null;
  }
};

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    console.log("checkAuth called");
    if (token) {
      try {
        const decoded = parseJwt(token);
        console.log("decoded JWT:", decoded);
        if (decoded) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp > currentTime) {
            setIsAuthenticated(true);
            setUserId(decoded.id);
            setUserName(decoded.username || "");
            console.log("User authenticated:", decoded.id);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUserId("");
            setUserName("");
            console.log("Token expired");
          }
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserId("");
          setUserName("");
          console.log("Invalid token");
        }
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserId("");
        setUserName("");
        console.error("Token parsing error:", error);
      }
    } else {
      setIsAuthenticated(false);
      setUserId("");
      setUserName("");
      console.log("No token found");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUserId("");
      setUserName("");
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        logout,
        checkAuth,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
