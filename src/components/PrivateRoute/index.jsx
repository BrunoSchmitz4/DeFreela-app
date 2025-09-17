// Aqui a gente quer garantir que as telas protegidas (passadas como children) sejam vistas somente para usuários logados
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  return user ? children : <Navigate to="/auth/login" />;
}

export default PrivateRoute;