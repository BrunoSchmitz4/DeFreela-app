// src/context/authContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as serviceLogin, logout as serviceLogout, getProfile } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);     // loading inicial
  const [authLoading, setAuthLoading] = useState(false); // loading de login
  const [error, setError] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  // 1. Verificar sessão ao carregar o app
  useEffect(() => {
    async function loadStoredSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile(token);
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  // 2. Login
  async function handleLogin(email, password) {
    setAuthLoading(true);
    setError(null);

    try {
      const res = await serviceLogin(email, password);

      // salvar token mockado
      localStorage.setItem("token", res.token);

      // carregar perfil mockado
      const profile = await getProfile(res.token);
      setUser(profile.data);

      return { error: null };
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
      return { error: err.message };
    } finally {
      setAuthLoading(false);
    }
  }

  // 3. Logout
  async function handleLogout() {
    await serviceLogout();
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        error,
        handleLogin,
        handleLogout,
        redirectAfterLogin,
        setRedirectAfterLogin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
