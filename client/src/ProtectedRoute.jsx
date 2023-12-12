import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ role, ...props }) {
  const { loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return <h1>Loading...</h1>;

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && !hasRole(role)) {
    // El usuario no tiene el rol requerido para acceder a esta ruta
    return <Navigate to="/" replace />;
  }

  // Evitar que el administrador acceda a rutas específicas
  const restrictedRoutesForAdmin = [
    '/dashboard',
    '/dashboardByCategory',
    '/revenue-by-category',
    '/sales-by-neighborhood',
    '/sales-trend-over-time',
    '/sales-by-month',
    '/sales-by-state',
    '/orders-by-month',
    '/uploadfile'
  ];

  if (hasRole('admin') && restrictedRoutesForAdmin.some(route => location.pathname.startsWith(route))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet {...props} />;
}

export default ProtectedRoute;
