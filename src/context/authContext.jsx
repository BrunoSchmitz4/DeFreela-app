import { createContext, useContext, useState, useEffect } from "react";
import { AuthRepository } from "../repos/AuthRepository";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);      // Carregando sessão inicial
  const [authLoading, setAuthLoading] = useState(false); // Carregando login/register
  const [error, setError] = useState(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  // 🧭 Carregar sessão ao abrir a app
  useEffect(() => {
    async function loadSession() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await AuthRepository.getProfile(); // { user }
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
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

  // 🔐 LOGIN
  async function handleLogin(email, password) {
    setAuthLoading(true);
    setError(null);

    try {
      const { user, token } = await AuthRepository.login(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { error: null, user };
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setError(msg);
      return { error: msg };
    } finally {
      setAuthLoading(false);
    }
  }

  // 📝 REGISTER
  async function handleRegister(name, email, password) {
    setAuthLoading(true);
    setError(null);

    try {
      const { user, token } = await AuthRepository.register(
        name,
        email,
        password
      );

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { error: null, user };
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setError(msg);
      return { error: msg };
    } finally {
      setAuthLoading(false);
    }
  }

  // 🚪 LOGOUT
  async function handleLogout() {
    try {
      await AuthRepository.logout(); // mesmo que Mirage não use
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
