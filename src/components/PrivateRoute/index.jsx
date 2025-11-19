// Aqui a gente quer garantir que as telas protegidas (passadas como children) sejam vistas somente para usuários logados
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();


  // Verifica se o usuário tá logado
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>Carregando...</h3>
      </div>
    );
  }

  // Se não estiver logado, redireciona pra login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Se estiver usando children diretamente
  if (children) return children;

  // Se estiver usando como wrapper para rotas aninhadas
  return <Outlet />;
}

export default PrivateRoute;