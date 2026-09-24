import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import GroupAdminDashboard from './components/groupAdmin/GroupAdminDashboard';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';
import { useStore } from './store/useStore';

// Root Route - Redirects based on logged in role
function RootRedirect() {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'superAdmin') {
    return <Navigate to="/super-admin" replace />;
  }

  return <Navigate to="/group-admin" replace />;
}

// Protected Group Admin Route
function ProtectedGroupAdminRoute() {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'superAdmin') {
    return <Navigate to="/super-admin" replace />;
  }

  return (
    <div className="font-hind">
      <GroupAdminDashboard />
    </div>
  );
}

// Protected Super Admin Route
function ProtectedSuperAdminRoute() {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'groupAdmin') {
    return <Navigate to="/group-admin" replace />;
  }

  return (
    <div className="font-hind">
      <SuperAdminDashboard />
    </div>
  );
}

// Login Route Guard - If already logged in, redirect to dashboard
function LoginRouteGuard() {
  const currentUser = useStore((state) => state.currentUser);

  if (currentUser) {
    if (currentUser.role === 'superAdmin') {
      return <Navigate to="/super-admin" replace />;
    }
    return <Navigate to="/group-admin" replace />;
  }

  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginRouteGuard />} />
        <Route path="/group-admin" element={<ProtectedGroupAdminRoute />} />
        <Route path="/super-admin" element={<ProtectedSuperAdminRoute />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
