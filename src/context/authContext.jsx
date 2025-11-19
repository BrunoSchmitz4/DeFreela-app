import { createContext, useContext, useEffect, useState } from "react";

// MOCK TEMPORÁRIO (remover quando o back existir)
import mockUser from "../mocks/auth/user.json";
import { getProfile, login } from "../services/authService";

 // Quando tivermos a API
 //import * as authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Persistência de sessão
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);   // Loading global
  const [error, setError] = useState(null);       // Erro global

  // Padronização do retorno
  function response(data = null, error = null) {
    return { data, error, loading: false };
  }

  // Função de login (mock → API futura)
  async function handleLogin(email, password) {
    try {
      setLoading(true);
      setError(null);

      // MOCK (temporário)
      if (email !== mockUser.email || password !== "123456") {
        throw new Error("Credenciais inválidas.");
      }
      // API real:
      // const { data } = await authService.login({ email, password });
      const { user: loggedUser, token } = await login(email, password);
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", token);
      
      
    return response(loggedUser, null);
    } catch (err) {
      setError(err.message || "Erro ao autenticar.");
      return response(null, err.message);
    } finally {
      setLoading(false);
    }
  }

  // Carregar perfil do usuário logado (mock → API futura)
  async function loadUserProfile() {
    try {
      setLoading(true);
      setError(null);

      // MOCK
      if (!user) return response(null, "Nenhum usuário autenticado");

      const token = localStorage.getItem("token");
      const data = await getProfile(token);

      // API real:
      // const { data } = await authService.getProfile();

      return response(data, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function handleLogout() {
    try {
      setLoading(true);
      setError(null);

      // MOCK (limpar sessão)
      localStorage.removeItem("user");

      // API real:
      // await authService.logout();

      setUser(null);
      return response(true, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // Efeito para recarregar sessão ao entrar na aplicação
  useEffect(() => {
    async function initialize() {
      if (!user) return; // Nenhum usuário salvo

      try {
        setLoading(true);

        // MOCK
        const data = mockUser;

        // API real:
        // const { data } = await authService.getProfile();

        setUser(data);
      } catch {
        // Se falhar, remove sessão
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        handleLogin,
        handleLogout,
        loadUserProfile,
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
