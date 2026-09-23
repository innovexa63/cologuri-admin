import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import GroupAdminDashboard from './components/groupAdmin/GroupAdminDashboard';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';
import { useStore } from './store/useStore';

// Top Switcher for switching between Group Admin and Super Admin portals
function AdminRoleSwitcher({ currentRole, onRoleChange }) {
  const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  return (
    <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
      <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-md flex items-center gap-1.5">
        <button
          onClick={() => onRoleChange('groupAdmin')}
          className={`font-hind text-xs px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-medium ${
            currentRole === 'groupAdmin'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'text-gray-700 hover:bg-emerald-50'
          }`}
          aria-pressed={currentRole === 'groupAdmin'}
        >
          🏕️ গ্রুপ অ্যাডমিন
        </button>
        <button
          onClick={() => onRoleChange('superAdmin')}
          className={`font-hind text-xs px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-medium ${
            currentRole === 'superAdmin'
              ? 'bg-emerald-950 text-white shadow-sm font-bold'
              : 'text-gray-700 hover:bg-emerald-50'
          }`}
          aria-pressed={currentRole === 'superAdmin'}
        >
          ⚙️ সুপার অ্যাডমিন
        </button>
      </div>

      <a
        href={clientUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-hind text-xs px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition-all flex items-center gap-1 shadow-sm"
        title="ভ্রমণকারী সাইট ওপেন করুন"
      >
        <span>🌐 মেইন সাইট</span>
        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
      </a>
    </div>
  );
}

// Group Admin Route
function GroupAdminRoute() {
  const { role, setRole } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    setRole('groupAdmin');
  }, [setRole]);

  const handleRoleChange = (r) => {
    setRole(r);
    if (r === 'superAdmin') navigate('/super-admin');
    else navigate('/group-admin');
  };

  return (
    <div className="font-hind">
      <AdminRoleSwitcher currentRole={role} onRoleChange={handleRoleChange} />
      <GroupAdminDashboard />
    </div>
  );
}

// Super Admin Route
function SuperAdminRoute() {
  const { role, setRole } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    setRole('superAdmin');
  }, [setRole]);

  const handleRoleChange = (r) => {
    setRole(r);
    if (r === 'groupAdmin') navigate('/group-admin');
    else navigate('/super-admin');
  };

  return (
    <div className="font-hind">
      <AdminRoleSwitcher currentRole={role} onRoleChange={handleRoleChange} />
      <SuperAdminDashboard />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/group-admin" replace />} />
        <Route path="/group-admin" element={<GroupAdminRoute />} />
        <Route path="/super-admin" element={<SuperAdminRoute />} />
        <Route path="*" element={<Navigate to="/group-admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
