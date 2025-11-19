import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/authContext";
import AuthLoadingScreen from "../ui/AuthLoadingScreen";
import { useEffect, useState } from "react";

function PrivateRoute() {
  const {
    isAuthenticated,
    loading,
    setRedirectAfterLogin,
  } = useAuth();

  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Quando usuário NÃO está autenticado, marcamos a rota original
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setRedirectAfterLogin(location.pathname);
      setShouldRedirect(true);
    }
  }, [loading, isAuthenticated, location.pathname, setRedirectAfterLogin]);

  // Enquanto carrega sessão
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Se precisamos redirecionar
  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado → deixa entrar
  return <Outlet />;
}

export default PrivateRoute;