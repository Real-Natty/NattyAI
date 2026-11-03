import API_URL from "../services/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nattyai-user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("nattyai-token") || null,
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Session expired");
        }

        setUser(data.user);
        localStorage.setItem("nattyai-user", JSON.stringify(data.user));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  function login(data) {
    setToken(data.token);
    setUser(data.user);

    localStorage.setItem("nattyai-token", data.token);
    localStorage.setItem("nattyai-user", JSON.stringify(data.user));
  }

  function logout() {
    setToken(null);
    setUser(null);

    localStorage.removeItem("nattyai-token");
    localStorage.removeItem("nattyai-user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
