import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import AlertsPage from './pages/AlertsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PlantCreatePage from './pages/PlantCreatePage';
import PlantDetailPage from './pages/PlantDetailPage';
import PlantEditPage from './pages/PlantEditPage';
import PlantsPage from './pages/PlantsPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/plants/new" element={<PlantCreatePage />} />
          <Route path="/plants/:plantId" element={<PlantDetailPage />} />
          <Route path="/plants/:plantId/edit" element={<PlantEditPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
