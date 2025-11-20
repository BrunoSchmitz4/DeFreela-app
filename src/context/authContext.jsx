import { createContext, useContext, useState, useEffect } from "react";
import {
  login as serviceLogin,
  logout as serviceLogout,
  getProfile as serviceGetProfile,
  register as serviceRegister
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true); // loading inicial
  const [authLoading, setAuthLoading] = useState(false);

  const [error, setError] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  // 1) Verificar sessão inicial (pesado)
  useEffect(() => {
    async function loadSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await serviceGetProfile(token); // <-- res = { data }
        const profile = res.data;

        setUser(profile);

        localStorage.setItem("user", JSON.stringify(profile));
        localStorage.setItem("token", token);
      } catch (err) {
        console.warn("Sessão inválida:", err.message);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  // 2) Login
  async function handleLogin(email, password) {
    setAuthLoading(true);
    setError(null);

    try {
      const res = await serviceLogin(email, password); // { data, token }
      const { token, data } = res;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);

      return { error: null, data };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setAuthLoading(false);
    }
  }

  // 3) Register + auto-login
  async function handleRegister(name, email, password) {
    setAuthLoading(true);
    setError(null);

    try {
      const res = await serviceRegister(name, email, password); // { data, token }
      const { token, data } = res;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);

      return { error: null, data };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setAuthLoading(false);
    }
  }

  // 4) Logout
  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");
      await serviceLogout(token);
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
        setRedirectAfterLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}