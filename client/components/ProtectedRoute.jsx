import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

/**
 * ProtectedRoute Component
 * Validates that user is authenticated before rendering component
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ element, requiredRole = null }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500">Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }

  // Authenticated and role matches - render component
  return element;
};

export default ProtectedRoute;
