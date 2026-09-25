import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, Users, BarChart2,
  MapPin, Calendar, ChevronRight, Wallet, TrendingUp,
  CheckCircle, AlertTriangle, Settings, LogOut, X,
  ArrowRightLeft, Bus
} from 'lucide-react';
import { liveTourPackages, tourGroups } from '../../data/mockData';
import BrandLogo from '../common/BrandLogo';
import { useStore } from '../../store/useStore';
import CreateTourInline from './CreateTourInline';
import CentralSeatMonitor from './CentralSeatMonitor';

export default function GroupAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tourList, setTourList] = useState(liveTourPackages);
  const navigate = useNavigate();

  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);

  const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleTourCreated = (newTour) => {
    setTourList([newTour, ...tourList]);
  };

  const handleSeatTransferred = ({ tourId, seats, fromGroupId, toGroupId, record }) => {
    setTourList((prev) =>
      prev.map((t) => {
        if (t.id !== tourId) return t;
        const updatedPartners = (t.partnerGroups || []).map((p) => {
          if (p.groupId === fromGroupId) {
            return {
              ...p,
              allocatedSeats: (p.allocatedSeats || []).filter((s) => !seats.includes(s)),
            };
          }
          if (p.groupId === toGroupId) {
            return {
              ...p,
              allocatedSeats: [...new Set([...(p.allocatedSeats || []), ...seats])],
            };
          }
          return p;
        });
        return {
          ...t,
          partnerGroups: updatedPartners,
          seatTransfers: [record, ...(t.seatTransfers || [])],
        };
      })
    );
  };

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
    { id: 'create', icon: PlusCircle, label: 'নতুন ট্যুর তৈরি' },
    { id: 'tours', icon: MapPin, label: 'আমার ট্যুর' },
    { id: 'seats', icon: Users, label: 'সিট ম্যানেজমেন্ট' },
    { id: 'joint', icon: ArrowRightLeft, label: 'যৌথ সিট মনিটরিং' },
    { id: 'earnings', icon: Wallet, label: 'আয় ও পেমেন্ট' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-slate-800">
      {/* Admin Top Header */}
      <header className="bg-[#03251A] py-3 px-6 flex items-center justify-between shadow-md border-b border-emerald-900/50 sticky top-0 z-30">
        <div className="flex items-center">
          <BrandLogo theme="dark" className="h-9 sm:h-10 w-auto" portalSubtitle="গ্রুপ অ্যাডমিন পোর্টাল" alt="চলোঘুড়ি" />
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-800/80 border border-emerald-500/30 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-xs">
            <CheckCircle size={13} className="text-emerald-300" aria-hidden="true" />
            <span className="text-emerald-100 text-xs font-semibold">ভেরিফায়েড অপারেটর</span>
          </div>

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

          <div className="text-right hidden md:block">
            <p className="text-white text-xs font-bold leading-tight">{currentUser?.name || 'ঘুরি বাংলাদেশ'}</p>
            <p className="text-emerald-300/70 text-[11px] leading-tight">{currentUser?.email || 'operator@cologuri.com'}</p>
          </div>

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
                ম্যানেজমেন্ট মেনু
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
                          ? 'bg-[#03251A] text-white shadow-sm'
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

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Settings size={15} aria-hidden="true" />
              <span>সিস্টেম সেটিংস</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    ড্যাশবোর্ড ওভারভিউ
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    আপনার ট্যুর গ্রুপ ও সিট বুকিং সংক্রান্ত সাম্প্রতিক আপডেট
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-[#168B5E] hover:bg-[#03251A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle size={15} aria-hidden="true" />
                  <span>নতুন ট্যুর তৈরি</span>
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'সক্রিয় ট্যুর', value: '৭টি', icon: MapPin, color: 'text-emerald-700 bg-emerald-100' },
                  { label: 'মোট বুকিং', value: '১৪৩ জন', icon: Users, color: 'text-teal-700 bg-teal-100' },
                  { label: 'এই মাসের আয়', value: '৳ ২.৪ লাখ', icon: TrendingUp, color: 'text-amber-700 bg-amber-100' },
                  { label: 'গ্রাহক সন্তুষ্টি', value: '৪.৮ ★', icon: BarChart2, color: 'text-yellow-700 bg-yellow-100' },
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
                    </div>
                  );
                })}
              </div>

              {/* Recent Tours List */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    সাম্প্রতিক ট্যুর প্যাকেজ
                  </h2>
                  <button
                    onClick={() => setActiveTab('tours')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>সকল ট্যুর দেখুন</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {tourList.map((pkg) => {
                    const pct = Math.round((pkg.bookedSeats / pkg.totalSeats) * 100);
                    return (
                      <div
                        key={pkg.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/80 hover:bg-emerald-50/40 rounded-xl border border-slate-200/70 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {pkg.title}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-2">
                            <span>📅 {pkg.startDate}</span>
                            <span>•</span>
                            <span>{pkg.duration}</span>
                          </p>
                        </div>

                        <div className="w-36 shrink-0">
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span className="font-bold text-emerald-800">{pct}% বুকড</span>
                            <span>{pkg.bookedSeats}/{pkg.totalSeats} সিট</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            pkg.status === 'live'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {pkg.status === 'live' ? '🟢 লাইভ' : 'আসছে'}
                          </span>
                          <button
                            onClick={() => setActiveTab('seats')}
                            className="p-1.5 text-slate-400 hover:text-emerald-800 rounded-lg hover:bg-white transition-colors cursor-pointer"
                            title="সিট ম্যানেজমেন্ট"
                          >
                            <ChevronRight size={17} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOURS */}
          {activeTab === 'tours' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    আমার ট্যুর প্যাকেজ
                  </h1>
                  <p className="text-xs text-slate-500">আপনার অপারেটরের অধীনে সকল ট্যুর ও রুট তালিকা</p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-[#168B5E] hover:bg-[#03251A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle size={15} />
                  <span>নতুন ট্যুর প্রকাশ</span>
                </button>
              </div>

              <div className="grid gap-4">
                {tourList.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                            {pkg.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            pkg.isJointTour ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {pkg.isJointTour ? '🤝 জয়েন্ট ট্যুর' : 'একক ট্যুর'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin size={13} className="text-emerald-700" />
                          <span>{pkg.route}</span>
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{pkg.startDate} ({pkg.duration})</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setActiveTab('seats')}
                          className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          সিট বুকিং ({pkg.bookedSeats}/{pkg.totalSeats})
                        </button>
                        <button
                          onClick={() => alert(`প্যাকেজ "${pkg.title}" সম্পাদনা মোড সক্রিয় করা হয়েছে।`)}
                          className="text-xs font-bold border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          সম্পাদনা
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SEATS MANAGEMENT */}
          {activeTab === 'seats' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    রিয়েল-টাইম সিট ম্যানেজমেন্ট
                  </h1>
                  <p className="text-xs text-slate-500">বাসের সিট সংখ্যা, বুকিং অবস্থা ও লাইভ লকিং ওভারভিউ</p>
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex gap-3 shadow-xs">
                <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Race Condition সুরক্ষা সক্রিয়:</strong> একই সিটে একাধিক সমসাময়িক বুকিং এড়াতে
                  ওয়েবসকেট সিট লকিং সিস্টেম চালুকৃত আছে। কোনো ব্যবহারকারী সিট সিলেক্ট করলে সেটি ১৫ মিনিটের জন্য সংরক্ষিত থাকে।
                </div>
              </div>

              <div className="grid gap-5">
                {tourList.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">বাসের মোট সিট: {pkg.totalSeats}টি</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {pkg.totalSeats - pkg.bookedSeats}টি সিট খালি
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          {pkg.bookedSeats}টি বুকড
                        </span>
                      </div>
                    </div>

                    {/* Seat Grid */}
                    <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 mb-4">
                      {Array.from({ length: pkg.totalSeats }).map((_, i) => {
                        const isBooked = i < pkg.bookedSeats;
                        return (
                          <div
                            key={i}
                            className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                              isBooked
                                ? 'bg-[#03251A] text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 border border-slate-200 cursor-pointer'
                            }`}
                            title={`সিট ${i + 1}: ${isBooked ? 'বুক হয়েছে' : 'খালি আছে'}`}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 bg-[#03251A] rounded-md" />
                        <span>বুক হয়েছে ({pkg.bookedSeats})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 bg-slate-100 border border-slate-300 rounded-md" />
                        <span>খালি রয়েছে ({pkg.totalSeats - pkg.bookedSeats})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CENTRAL JOINT MONITORING */}
          {activeTab === 'joint' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <CentralSeatMonitor
                tours={tourList}
                currentGroup={currentUser}
                onSeatTransferred={handleSeatTransferred}
              />
            </div>
          )}

          {/* TAB 5: EARNINGS & PAYOUTS */}
          {activeTab === 'earnings' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                  আয় ও পেমেন্ট হিস্ট্রি
                </h1>
                <p className="text-xs text-slate-500">ট্যুর বুকিংয়ের মাধ্যমে অর্জিত আয় ও ব্যাঙ্ক ট্রান্সফার স্থিতি</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'এই মাসের মোট বিক্রয়', value: '৳ ৩,২৪,৫০০', sub: 'আগের মাস থেকে +১৮% বৃদ্ধি', color: 'text-emerald-800' },
                  { label: 'প্ল্যাটফর্ম কমিশন (৮%)', value: '৳ ২৫,৯৬০', sub: 'স্বয়ংক্রিয়ভাবে সমন্বিত', color: 'text-slate-800' },
                  { label: 'নেট উত্তোলিতব্য অর্থ', value: '৳ ২,৯৮,৫৪০', sub: 'আগামীকাল ব্যাংক ট্রান্সফার শিডিউল', color: 'text-teal-800' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
                    <p className="text-xs font-medium text-slate-500 mb-2">{item.label}</p>
                    <p className={`text-2xl font-extrabold ${item.color} mb-1`} style={{ fontFamily: '"Tiro Bangla", serif' }}>
                      {item.value}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-700">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* Transaction Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
                <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                  সাম্প্রতিক বুকিং ট্রানজেকশন
                </h2>
                <div className="space-y-2.5">
                  {[
                    { name: 'রাহেলা বেগম', tour: 'সাজেক পূর্ণিমা ট্যুর (২ সিট)', amount: '৳ ৯,৬০০', method: 'bKash', date: '১৮ সেপ্টেম্বর' },
                    { name: 'মোহাম্মদ কামাল', tour: 'সুন্দরবন ক্রুজ সাফারি (১ সিট)', amount: '৳ ৬,৫০০', method: 'SSLCommerz', date: '১৭ সেপ্টেম্বর' },
                    { name: 'ফারহানা ইসলাম', tour: 'বান্দরবান কাস্টম কর্পোরেট ট্রিপ', amount: '৳ ৪৪,০০০', method: 'Nagad', date: '১৬ সেপ্টেম্বর' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{tx.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{tx.tour} • {tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-900 text-sm">{tx.amount}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {tx.method} • পেইড
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CREATE TOUR (INLINE FULL PAGE) */}
          {activeTab === 'create' && (
            <CreateTourInline
              onTourCreated={(newTour) => {
                handleTourCreated(newTour);
                setActiveTab('tours');
              }}
              onCancel={() => setActiveTab('dashboard')}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}