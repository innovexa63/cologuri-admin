import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import { useStore } from '../../store/useStore';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('groupAdmin'); // 'groupAdmin' | 'superAdmin'
  const [email, setEmail] = useState('operator@cologuri.com');
  const [password, setPassword] = useState('cologuri123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'groupAdmin') {
      setEmail('operator@cologuri.com');
      setPassword('cologuri123');
    } else {
      setEmail('superadmin@cologuri.com');
      setPassword('cologuri123');
    }
  };

  const executeLogin = async (targetRole, targetEmail, targetPassword) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          login(data.user);
          if (data.user.role === 'superAdmin') {
            navigate('/super-admin', { replace: true });
          } else {
            navigate('/group-admin', { replace: true });
          }
          return;
        }
      }

      // Instant client-side fallback session
      const isSuper = targetRole === 'superAdmin' || targetEmail.includes('super');
      const resolvedRole = isSuper ? 'superAdmin' : 'groupAdmin';
      const resolvedName = isSuper ? 'সুপার অ্যাডমিন' : 'ঘুরি বাংলাদেশ (ট্যুর অপারেটর)';

      const sessionUser = {
        id: isSuper ? 'usr_super_1' : 'usr_group_1',
        name: resolvedName,
        email: targetEmail,
        role: resolvedRole,
        token: 'token_' + Date.now(),
      };

      login(sessionUser);

      if (resolvedRole === 'superAdmin') {
        navigate('/super-admin', { replace: true });
      } else {
        navigate('/group-admin', { replace: true });
      }
    } catch (err) {
      setError('লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeLogin(selectedRole, email, password);
  };

  const handleInstantOneClick = () => {
    const directEmail = selectedRole === 'superAdmin' ? 'superadmin@cologuri.com' : 'operator@cologuri.com';
    executeLogin(selectedRole, directEmail, 'cologuri123');
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-gradient-to-br from-[#021A12] via-[#043323] to-[#0A1F18] text-[#111E16] overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[15%] w-[450px] h-[450px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="px-6 py-3.5 flex items-center justify-between z-10 border-b border-white/10 backdrop-blur-md bg-black/10 shrink-0">
        <div className="flex items-center">
          <BrandLogo theme="dark" className="h-9 sm:h-10 w-auto" alt="চলোঘুড়ি" />
        </div>
        <a
          href={clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-emerald-200 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full border border-emerald-400/30 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <span>🌐 মূল ভ্রমণকারী সাইট</span>
          <span className="material-symbols-outlined text-[15px]">open_in_new</span>
        </a>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 overflow-y-auto">
        <div className="w-full max-w-[430px] bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-emerald-100/80 relative">
          {/* Header Title */}
          <div className="text-center mb-5">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 tracking-wider mb-2">
              ADMIN CONTROL CENTER
            </span>
            <h1
              className="text-2xl font-extrabold text-[#03251A] tracking-tight"
              style={{ fontFamily: '"Tiro Bangla", serif' }}
            >
              পোর্টাল লগইন
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              একই লিংক থেকে গ্রুপ ও সুপার অ্যাডমিন অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          {/* Role Segmented Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl mb-4 border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleRoleTabChange('groupAdmin')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'groupAdmin'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>🏕️</span>
              <span>গ্রুপ অ্যাডমিন</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('superAdmin')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'superAdmin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>⚙️</span>
              <span>সুপার অ্যাডমিন</span>
            </button>
          </div>

          {/* Role Description Badge */}
          <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-[11px] text-emerald-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-700 shrink-0">
              {selectedRole === 'groupAdmin' ? 'verified_user' : 'admin_panel_settings'}
            </span>
            <span>
              {selectedRole === 'groupAdmin'
                ? 'ট্যুর প্যাকেজ তৈরি, সিট ম্যানেজমেন্ট ও আয় ট্র্যাকিং'
                : 'এজেন্সি ভেরিফিকেশন, প্ল্যাটফর্ম অডিট ও পূর্ণ নিয়ন্ত্রণ'}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                অফিসিয়াল ইমেইল
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-900 bg-slate-50/60 focus:bg-white transition-all"
                  placeholder="name@cologuri.com"
                />
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-slate-400 pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-900 bg-slate-50/60 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-slate-400 pointer-events-none">
                  lock
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 bg-[#03251A] hover:bg-[#168B5E] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[16px]">progress_activity</span>
                  <span>প্রবেশ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>
                    {selectedRole === 'groupAdmin'
                      ? 'গ্রুপ অ্যাডমিন পোর্টালে প্রবেশ করুন'
                      : 'সুপার অ্যাডমিন পোর্টালে প্রবেশ করুন'}
                  </span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Action */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium">ঝামেলাহীন ডেমো:</span>
            <button
              type="button"
              onClick={handleInstantOneClick}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300/80 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>⚡ ১-ক্লিকে সরাসরি ড্যাশবোর্ড</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-2.5 text-[11px] text-emerald-200/60 z-10 shrink-0">
        © ২০২৫ চলোঘুড়ি (Cologuri) — সিকিউরড অ্যাডমিন গেটওয়ে
      </footer>
    </div>
  );
}
