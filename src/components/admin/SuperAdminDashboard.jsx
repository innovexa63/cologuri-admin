import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Shield, MapPin, Users, BarChart2,
  CheckCircle, XCircle, AlertTriangle, TrendingUp, ChevronRight, LogOut, FileText
} from 'lucide-react';
import { tourGroups, liveTourPackages } from '../../data/mockData';
import BrandLogo from '../common/BrandLogo';
import { useStore } from '../../store/useStore';

const initialAgencies = [
  { id: 'pa1', name: 'সিলেট অ্যাডভেঞ্চার ক্লাব', owner: 'মোহাম্মদ সাইফুল', location: 'সিলেট', applied: '১৫ সেপ্টেম্বর ২০২৬', tours: 0, tradeLicense: true, nid: true, safetyScore: 82 },
  { id: 'pa2', name: 'সুন্দরবন ক্রুজ লাইন', owner: 'নাসরিন আক্তার', location: 'খুলনা', applied: '১৪ সেপ্টেম্বর ২০২৬', tours: 0, tradeLicense: true, nid: false, safetyScore: 74 },
  { id: 'pa3', name: 'হাওর ট্রেকার্স', owner: 'রফিকুল ইসলাম', location: 'সুনামগঞ্জ', applied: '১২ সেপ্টেম্বর ২০২৬', tours: 0, tradeLicense: false, nid: true, safetyScore: 68 },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [agencies, setAgencies] = useState(initialAgencies);
  const [agencyStatus, setAgencyStatus] = useState({
    pa1: 'pending',
    pa2: 'pending',
    pa3: 'pending',
  });

  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);

  const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleApprove = (id) => {
    setAgencyStatus((prev) => ({ ...prev, [id]: 'approved' }));
  };

  const handleReject = (id) => {
    setAgencyStatus((prev) => ({ ...prev, [id]: 'rejected' }));
  };

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: 'প্ল্যাটফর্ম ওভারভিউ' },
    { id: 'kyc', icon: Shield, label: 'এজেন্সি ভেরিফিকেশন' },
    { id: 'destinations', icon: MapPin, label: 'দর্শনীয় স্থান' },
    { id: 'disputes', icon: AlertTriangle, label: 'ডিসপিউট ও অডিট' },
    { id: 'analytics', icon: BarChart2, label: 'বিশ্লেষণ' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-slate-800">
      {/* Super Admin Top Header */}
      <header className="bg-[#0A1A14] py-3 px-6 flex items-center justify-between shadow-md border-b border-emerald-950/80 sticky top-0 z-30">
        <div className="flex items-center">
          <BrandLogo theme="dark" className="h-9 sm:h-10 w-auto" portalSubtitle="সুপার অ্যাডমিন পোর্টাল" alt="চলোঘুড়ি" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ⚙️ সুপার অ্যাডমিন
          </span>

          <a
            href={clientUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl border border-white/15 transition-all"
            title="মূল ভ্রমণকারী সাইট"
          >
            <span>🌐 মেইন সাইট</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>

          <p className="font-medium text-white text-xs hidden md:block">
            {currentUser?.email || 'superadmin@cologuri.com'}
          </p>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs ml-1"
            title="লগআউট"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-slate-200/90 flex-shrink-0 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="px-3 pb-3 mb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                সুপার অ্যাডমিন মেনু
              </span>
            </div>
            <ul role="list" className="space-y-1.5">
              {tabs.map(({ id, icon: Icon, label }) => {
                const isActive = activeTab === id;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[#0A1A14] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-950'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon size={17} className={isActive ? 'text-emerald-300' : 'text-slate-400'} aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">প্ল্যাটফর্ম সিকিউরিটি v২.১</span>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                  প্ল্যাটফর্ম ওভারভিউ
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">চলোঘুড়ি মার্কেটপ্লেসের সামগ্রিক পরিসংখ্যান ও অপারেশনস</p>
              </div>

              {/* Platform KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'মোট GMV (এই মাস)', value: '৳ ৪২.৭ লাখ', icon: TrendingUp, sub: '+২৩% মাসিক বৃদ্ধি', color: 'text-emerald-700 bg-emerald-100' },
                  { label: 'ভেরিফায়েড এজেন্সি', value: '২৮৪টি', icon: Shield, sub: '৩টি আবেদন পেন্ডিং', color: 'text-teal-700 bg-teal-100' },
                  { label: 'লাইভ সিট বুকিং', value: '৭৫টি', icon: Users, sub: 'গত ২৪ ঘণ্টায় সম্পন্ন', color: 'text-amber-700 bg-amber-100' },
                  { label: 'প্ল্যাটফর্ম রেভিনিউ (৮%)', value: '৳ ৩.৪ লাখ', icon: BarChart2, sub: 'সরাসরি কমিশন আয়', color: 'text-yellow-700 bg-yellow-100' },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
                        <Icon size={19} aria-hidden="true" />
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                        {kpi.value}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{kpi.label}</p>
                      <p className="text-[11px] font-semibold text-emerald-700 mt-1">{kpi.sub}</p>
                    </div>
                  );
                })}
              </div>

              {/* Active Tour Groups */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    নিবন্ধিত শীর্ষ ট্যুর গ্রুপ
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">মোট ২৮৪টি অ্যাক্টিভ গ্রুপ</span>
                </div>

                <div className="space-y-2.5">
                  {tourGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-emerald-50/40 rounded-xl border border-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-center">
                          <span className="font-bold text-emerald-900 text-sm">
                            {group.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900 text-sm">{group.name}</p>
                            {group.verified && (
                              <CheckCircle size={14} className="text-emerald-600" aria-label="ভেরিফায়েড" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">📍 {group.location} • {group.totalTours}টি পরিচালিত ট্যুর</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                          ★ {group.rating}
                        </span>
                        <button
                          onClick={() => alert(`এজেন্সি "${group.name}" এর পূর্ণাঙ্গ রেকর্ড লোড করা হয়েছে।`)}
                          className="text-xs font-bold text-slate-600 hover:text-emerald-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          অডিট
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AGENCY KYC AUDIT */}
          {activeTab === 'kyc' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                  এজেন্সি ভেরিফিকেশন ও KYC অডিট
                </h1>
                <p className="text-xs text-slate-500">ট্রেড লাইসেন্স, এনআইডি ও ব্যাকগ্রাউন্ড চেকের ভিত্তিতে প্ল্যাটফর্মে অনুমোদন দিন</p>
              </div>

              <div className="space-y-4">
                {agencies.map((agency) => {
                  const status = agencyStatus[agency.id];
                  return (
                    <div
                      key={agency.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-slate-900">{agency.name}</h3>
                            <span className="text-xs text-slate-500">• {agency.location}</span>
                          </div>
                          <p className="text-xs text-slate-600">স্বত্বাধিকারী: <strong>{agency.owner}</strong> • আবেদনের তারিখ: {agency.applied}</p>

                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                              agency.tradeLicense ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              <FileText size={12} />
                              {agency.tradeLicense ? 'ট্রেড লাইসেন্স যাচাইকৃত' : 'ট্রেড লাইসেন্স বাকি'}
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                              agency.nid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              <Shield size={12} />
                              {agency.nid ? 'এনআইডি ক্লিয়ারেন্স' : 'এনআইডি নেই'}
                            </span>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                              সেফটি স্কোর: {agency.safetyScore}/১০০
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {status === 'approved' ? (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-xl flex items-center gap-1">
                              <CheckCircle size={14} />
                              অনুমোদিত
                            </span>
                          ) : status === 'rejected' ? (
                            <span className="text-xs font-bold text-red-800 bg-red-100 border border-red-300 px-3.5 py-1.5 rounded-xl flex items-center gap-1">
                              <XCircle size={14} />
                              বাতিলকৃত
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApprove(agency.id)}
                                className="text-xs font-bold bg-[#168B5E] hover:bg-[#03251A] text-white px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle size={14} />
                                অনুমোদন করুন
                              </button>
                              <button
                                onClick={() => handleReject(agency.id)}
                                className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              >
                                <XCircle size={14} />
                                বাতিল
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    দর্শনীয় স্থান নিয়ন্ত্রণ
                  </h1>
                  <p className="text-xs text-slate-500">অনুমোদিত ট্যুর গন্তব্য ও রুট সেটিংস</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'সাজেক ভ্যালি', division: 'রাঙামাটি', tours: 18, status: 'সক্রিয়' },
                  { name: 'সুন্দরবন ম্যানগ্রোভ', division: 'খুলনা/বাগেরহাট', tours: 12, status: 'সক্রিয়' },
                  { name: 'কক্সবাজার সমুদ্র সৈকত', division: 'চট্টগ্রাম', tours: 24, status: 'সক্রিয়' },
                  { name: 'সেন্টমার্টিন প্রবাল দ্বীপ', division: 'কক্সবাজার', tours: 9, status: 'সক্রিয়' },
                  { name: 'শ্রীমঙ্গল চা বাগান', division: 'মৌলভীবাজার', tours: 15, status: 'সক্রিয়' },
                  { name: 'টাঙ্গুয়ার হাওর', division: 'সুনামগঞ্জ', tours: 8, status: 'সক্রিয়' },
                ].map((dest, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900 text-base">{dest.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {dest.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">বিভাগ/জেলা: {dest.division}</p>
                    <p className="text-xs font-semibold text-emerald-800 mt-2">বর্তমানে {dest.tours}টি সক্রিয় প্যাকেজ</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DISPUTES & AUDIT */}
          {activeTab === 'disputes' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                  ডিসপিউট ও কমপ্লায়েন্স অডিট
                </h1>
                <p className="text-xs text-slate-500">ভ্রমণকারীদের অভিযোগ ও সিট রিফান্ড সংক্রান্ত অনুসন্ধান</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 text-center py-12">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-800">কোনো অমীমাংসিত অভিযোগ নেই</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  বর্তমানে সকল ট্যুর অপারেটর সফলভাবে ট্রিপ পরিচালনা করছেন এবং গ্রাহক সন্তুষ্টি হার ৯৮.২%।
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                  মার্কেটপ্লেস অ্যানালিটিক্স
                </h1>
                <p className="text-xs text-slate-500">গ্রাহক বৃদ্ধি, সিট বিক্রির ট্রেন্ড ও ভবিষ্যৎ বুকিং প্রক্ষেপণ</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">জনপ্রিয় ভ্রমণ গন্তব্য ভাগাভাগি</h3>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { name: 'সাজেক ভ্যালি', pct: 38 },
                      { name: 'কক্সবাজার', pct: 28 },
                      { name: 'শ্রীমঙ্গল ও সিলেট', pct: 18 },
                      { name: 'সুন্দরবন ও হাওর', pct: 16 },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>{item.name}</span>
                          <span>{item.pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">বুকিং চ্যানেল বন্টন</h3>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { name: 'বিকাশ সরাসরি গেটওয়ে', pct: 54 },
                      { name: 'নগদ ডিজিটাল পেমেন্ট', pct: 26 },
                      { name: 'ভিসা / মাস্টারকার্ড', pct: 20 },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>{item.name}</span>
                          <span>{item.pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-600 rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
