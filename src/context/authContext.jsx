// Aqui a gente compartilha o estado de usuário entre todas as páginas
// Seria  "Contexto de autênticação"
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, login, logout } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(email, password) {
    await login(email, password);
    const res = await getProfile();
    setUser(res.data);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
