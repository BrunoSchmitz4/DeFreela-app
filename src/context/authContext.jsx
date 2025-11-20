import { createContext, useContext, useState, useEffect } from "react";
import {
  login as serviceLogin,
  logout as serviceLogout,
  register as serviceRegister,
  getProfile as serviceGetProfile
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  useEffect(() => {
    async function loadSession() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // NÃO PASSAR token aqui — interceptor do api.js já anexa o header
        const res = await serviceGetProfile(); // { data }
        const profile = res.data;

        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err) {
        console.warn("Sessão inválida:", err?.response?.data || err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function handleLogin(email, password) {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await serviceLogin(email, password); // returns { data, token }
      const { token, data } = res;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return { error: null, data };
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
      return { error: err?.response?.data?.error || err.message };
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(name, email, password) {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await serviceRegister(name, email, password);
      const { token, data } = res;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return { error: null, data };
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
      return { error: err?.response?.data?.error || err.message };
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await serviceLogout();
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        error,
        isAuthenticated: !!user,
        handleLogin,
        handleRegister,
        handleLogout,
        redirectAfterLogin,
        setRedirectAfterLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}