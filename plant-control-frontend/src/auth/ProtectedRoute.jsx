import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50">
        <LoadingSpinner label="Loading your garden..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
