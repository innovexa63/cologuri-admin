import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, Users, BarChart2,
  MapPin, Calendar, ChevronRight, Wallet, TrendingUp,
  CheckCircle, AlertTriangle, Settings, LogOut, X,
  ArrowRightLeft, Bus, Edit3, Lock, Unlock, Eye, Sparkles
} from 'lucide-react';
import { liveTourPackages, tourGroups } from '../../data/mockData';
import BrandLogo from '../common/BrandLogo';
import { useStore } from '../../store/useStore';
import CreateTourInline from './CreateTourInline';
import CentralSeatMonitor from './CentralSeatMonitor';
import EditTourModal from './EditTourModal';

export default function GroupAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tourList, setTourList] = useState(liveTourPackages);
  const navigate = useNavigate();

  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);

  // Active group management (allows switching between Creator & Partner for testing/demo)
  const [activeGroupId, setActiveGroupId] = useState(currentUser?.id || 'tg1');
  const activeGroup = useMemo(() => {
    return tourGroups.find((g) => g.id === activeGroupId) || {
      id: activeGroupId,
      name: currentUser?.name || 'ঘুরি বাংলাদেশ',
      slug: 'ghuri-bd',
    };
  }, [activeGroupId, currentUser]);

  // Selected tour for seat management tab
  const [selectedSeatTourId, setSelectedSeatTourId] = useState(liveTourPackages[0]?.id || 'tp1');

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tourToEdit, setTourToEdit] = useState(null);

  // Hovered seat for tooltip
  const [hoveredSeatInfo, setHoveredSeatInfo] = useState(null);

  const clientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleTourCreated = (newTour) => {
    setTourList((prev) => {
      const next = [newTour, ...prev];
      try {
        localStorage.setItem('cologuri_saved_tours', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleSeatTransferred = ({ tourId, seats, fromGroupId, toGroupId, record }) => {
    setTourList((prev) => {
      const next = prev.map((t) => {
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
      });
      try {
        localStorage.setItem('cologuri_saved_tours', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleOpenEdit = (tour) => {
    setTourToEdit(tour);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedTour = (updatedTour) => {
    setTourList((prev) => {
      const next = prev.map((t) => (t.id === updatedTour.id ? updatedTour : t));
      try {
        localStorage.setItem('cologuri_saved_tours', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Filter tours for current active group
  const myTours = useMemo(() => {
    return tourList.filter((pkg) => {
      const creatorId = pkg.creatorGroupId || pkg.operator?.id || 'tg1';
      if (creatorId === activeGroupId || pkg.operator?.name === activeGroup.name) return true;
      const isPartner = (pkg.partnerGroups || []).some(
        (p) => p.groupId === activeGroupId || p.groupName === activeGroup.name
      );
      return isPartner;
    });
  }, [tourList, activeGroupId, activeGroup]);

  // Selected tour for seats
  const activeSeatTour = useMemo(() => {
    return myTours.find((t) => t.id === selectedSeatTourId) || myTours[0] || tourList[0];
  }, [myTours, selectedSeatTourId, tourList]);

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
        <div className="flex items-center gap-4">
          <BrandLogo theme="dark" className="h-9 sm:h-10 w-auto" portalSubtitle="গ্রুপ অ্যাডমিন পোর্টাল" alt="চলোঘুড়ি" />

          {/* Quick Operator Switcher (Creator vs Partner Demonstration) */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-300">অপারেটর প্রোফাইল:</span>
            <select
              value={activeGroupId}
              onChange={(e) => setActiveGroupId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="tg1" className="text-slate-900 font-bold">ঘুরি বাংলাদেশ (মূল ক্রিয়েটর / হোস্ট)</option>
              <option value="tg2" className="text-slate-900 font-bold">সবুজ পথিক (অংশীদার পার্টনার)</option>
              <option value="tg5" className="text-slate-900 font-bold">সুন্দরবন এক্সপ্লোরার (পার্টনার)</option>
            </select>
          </div>
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
            <p className="text-white text-xs font-bold leading-tight">{activeGroup.name}</p>
            <p className="text-emerald-300/70 text-[11px] leading-tight">
              {activeGroupId === 'tg1' ? '👑 মূল ক্রিয়েটর (হোস্ট)' : '🤝 পার্টনার গ্রুপ (অংশীদার)'}
            </p>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    আমার ট্যুর প্যাকেজ তালিকা
                  </h1>
                  <p className="text-xs text-slate-500">
                    অপারেটর <strong>"{activeGroup.name}"</strong>-এর অধীনে সরাসরি তৈরি ও যৌথ অংশীদারিত্বের ট্যুরসমূহ
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-[#168B5E] hover:bg-[#03251A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle size={15} />
                  <span>নতুন ট্যুর প্রকাশ</span>
                </button>
              </div>

              {myTours.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
                  <Bus size={36} className="mx-auto text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-700">কোনো সক্রিয় ট্যুর পাওয়া যায়নি</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    "{activeGroup.name}"-এর জন্য নতুন ট্যুর তৈরি করুন অথবা সুপার অ্যাডমিন দ্বারা যৌথ কোটায় অন্তর্ভুক্ত হোন।
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myTours.map((pkg) => {
                    const creatorId = pkg.creatorGroupId || pkg.operator?.id || 'tg1';
                    const isCreator = creatorId === activeGroupId || pkg.operator?.name === activeGroup.name;
                    const partnerRecord = (pkg.partnerGroups || []).find(
                      (p) => p.groupId === activeGroupId || p.groupName === activeGroup.name
                    );

                    const displayTitle = partnerRecord?.customTitle || pkg.title;
                    const displayPrice = partnerRecord?.price || pkg.pricePerPerson || pkg.price;
                    const displayOriginalPrice = partnerRecord?.originalPrice || pkg.originalPrice || 5500;
                    const displayDiscount = partnerRecord?.discount || (displayOriginalPrice - displayPrice > 0 ? displayOriginalPrice - displayPrice : 0);

                    // Quota breakdown
                    const myAllocatedCount = partnerRecord ? (partnerRecord.allocatedSeats?.length || 0) : pkg.totalSeats;
                    const myBookedCount = partnerRecord
                      ? (partnerRecord.bookedSeats?.length || partnerRecord.allocatedSeats?.filter((s) => pkg.busInfo?.bookedSeats?.includes(s)).length || 0)
                      : pkg.bookedSeats;
                    const myUnsold = myAllocatedCount - myBookedCount;

                    return (
                      <div
                        key={pkg.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                                {displayTitle}
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                  isCreator
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                }`}
                              >
                                {isCreator ? (
                                  <>
                                    <Unlock size={10} />
                                    <span>👑 মূল ক্রিয়েটর (হোস্ট)</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock size={10} />
                                    <span>🤝 পার্টনার গ্রুপ (অংশীদার)</span>
                                  </>
                                )}
                              </span>
                              {pkg.isJointTour && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                                  বাস শেয়ারিং
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                                <MapPin size={13} />
                                {pkg.route}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={13} />
                                {pkg.startDate} ({pkg.duration})
                              </span>
                              <span>•</span>
                              <span>
                                মূল্য: <strong className="text-slate-900 font-bold">৳ {displayPrice.toLocaleString()}</strong>
                                {displayDiscount > 0 && (
                                  <span className="text-[11px] text-emerald-700 ml-1 font-semibold">(৳ {displayDiscount} ছাড়)</span>
                                )}
                              </span>
                            </div>

                            {/* Quota breakdown tags */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                                মোট বরাদ্দ: {myAllocatedCount}টি সিট
                              </span>
                              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                                বুকড: {myBookedCount}টি
                              </span>
                              <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                                খালি রয়েছে: {myUnsold}টি
                              </span>
                              {!isCreator && (
                                <span className="text-[11px] text-slate-400 italic">
                                  মূল হোস্ট: {pkg.creatorGroupName || pkg.operator?.name}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            <button
                              onClick={() => {
                                setSelectedSeatTourId(pkg.id);
                                setActiveTab('seats');
                              }}
                              className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <Users size={14} />
                              <span>সিট ম্যানেজমেন্ট ({myBookedCount}/{myAllocatedCount})</span>
                            </button>
                            <button
                              onClick={() => handleOpenEdit(pkg)}
                              className="text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Edit3 size={14} />
                              <span>সম্পাদনা</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SEATS MANAGEMENT (AUTHENTIC BUS LAYOUT & VISUAL STATES) */}
          {activeTab === 'seats' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header & Tour Picker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    রিয়েল-টাইম সিট ম্যানেজমেন্ট
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    অপারেটর <strong>"{activeGroup.name}"</strong>-এর বরাদ্দকৃত সিট এবং সম্মিলিত বাসের লাইভ স্ট্যাটাস
                  </p>
                </div>

                {/* Tour Selector Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500">ট্যুর নির্বাচন:</label>
                  <select
                    value={activeSeatTour?.id || ''}
                    onChange={(e) => setSelectedSeatTourId(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 cursor-pointer shadow-xs focus:ring-2 focus:ring-emerald-700"
                  >
                    {myTours.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.startDate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Alert */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex gap-3 shadow-xs">
                <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>সম্মিলিত বাস ও সিট সুরক্ষা নীতি:</strong> আপনার গ্রুপের বরাদ্দকৃত সিটগুলো উজ্জ্বল
                  রঙে দেখানো হয়েছে। অন্য গ্রুপের খালি সিটগুলো <strong>অ্যাশ (ধূসর) রঙে</strong> এবং অন্য গ্রুপের বুকড সিটগুলো{' '}
                  <strong>হালকা সবুজ (Low Opacity Green)</strong> রঙে রয়েছে। যেকোনো বুকড সিটে মাউস নিলে সংশ্লিষ্ট গ্রুপের নাম প্রদর্শিত হবে।
                </div>
              </div>

              {activeSeatTour && (() => {
                const partnerRecord = (activeSeatTour.partnerGroups || []).find(
                  (p) => p.groupId === activeGroupId || p.groupName === activeGroup.name
                );
                const isCreator = (activeSeatTour.creatorGroupId || activeSeatTour.operator?.id || 'tg1') === activeGroupId;

                const myAllocatedSeats = partnerRecord?.allocatedSeats || [];
                const bookedSeatsList = activeSeatTour.busInfo?.bookedSeats || activeSeatTour.bookedSeatsList || [];
                const myBookedSeats = partnerRecord?.bookedSeats || myAllocatedSeats.filter((s) => bookedSeatsList.includes(s));
                const myUnsoldCount = myAllocatedSeats.length - myBookedSeats.length;

                const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

                return (
                  <div className="space-y-6">
                    {/* KPI Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
                        <p className="text-xs text-slate-500 font-medium">বাসের মোট সিট</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                          {activeSeatTour.totalSeats || 40}টি
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isCreator ? '👑 আপনি এই বাসের মূল হোস্ট' : '🤝 পার্টনার কোটা'}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-emerald-200/90 shadow-xs bg-emerald-50/20">
                        <p className="text-xs text-emerald-800 font-medium">আপনার বরাদ্দকৃত কোটা</p>
                        <p className="text-2xl font-extrabold text-emerald-900 mt-1" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                          {myAllocatedSeats.length}টি
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">১০০% অ্যাক্টিভ ভিজিবিলিটি</p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
                        <p className="text-xs text-slate-500 font-medium">আপনার বিক্রিত সিট</p>
                        <p className="text-2xl font-extrabold text-[#03251A] mt-1" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                          {myBookedSeats.length}টি
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">পূর্ণ সবুজ / ডার্ক বুকড</p>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-xs bg-amber-50/20">
                        <p className="text-xs text-amber-800 font-medium">আপনার খালি সিট</p>
                        <p className="text-2xl font-extrabold text-amber-900 mt-1" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                          {myUnsoldCount}টি
                        </p>
                        <p className="text-[11px] text-amber-700 mt-0.5">অবিক্রিত / বিক্রির জন্য প্রস্তুত</p>
                      </div>
                    </div>

                    {/* Main Seat Workspace Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                            <Bus size={18} className="text-emerald-700" />
                            <span>{partnerRecord?.customTitle || activeSeatTour.title}</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            গাড়ি: {activeSeatTour.busInfo?.busName || 'লাক্সারি চেয়ার কোচ'} • রুট: {activeSeatTour.route}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(activeSeatTour)}
                            className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 size={13} />
                            <span>প্যাকেজ এডিট</span>
                          </button>
                        </div>
                      </div>

                      {/* Four-State Visual Legend (Prominently displayed) */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
                        {/* 1. My empty */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-white border-2 border-emerald-600 shadow-2xs flex items-center justify-center text-[9px] text-emerald-800 font-bold">
                            ○
                          </span>
                          <span>আপনার খালি সিট (১০০% অপাসিটি)</span>
                        </div>

                        {/* 2. My booked */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-[#03251A] text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
                            ✓
                          </span>
                          <span>আপনার বুকড সিট (পূর্ণ অপাসিটি)</span>
                        </div>

                        {/* 3. Other empty (Low opacity ash) */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-slate-300 opacity-40 border border-slate-400 flex items-center justify-center text-[9px] text-slate-600">
                            -
                          </span>
                          <span>অন্য গ্রুপের খালি সিট (লো-অপাসিটি অ্যাশ)</span>
                        </div>

                        {/* 4. Other booked (Low opacity green + hoverable) */}
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-emerald-500/30 border-2 border-emerald-500/50 text-emerald-950 flex items-center justify-center text-[9px] font-extrabold shadow-2xs">
                            ✓
                          </span>
                          <span>অন্য গ্রুপে বুকড সিট (লো-অপাসিটি গ্রিন — হোভারে গ্রুপের নাম)</span>
                        </div>
                      </div>

                      {/* Floating Interactive Hover Tooltip Display (if hovered) */}
                      {hoveredSeatInfo && (
                        <div className="bg-[#03251A] text-white p-3 rounded-2xl shadow-lg border border-emerald-500/40 flex items-center justify-between text-xs animate-fadeIn max-w-md mx-auto">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-white text-xs">
                              {hoveredSeatInfo.seatNo}
                            </span>
                            <div>
                              <p className="font-bold text-emerald-100 text-xs">
                                বুক করেছে: <span className="text-amber-300 font-extrabold">{hoveredSeatInfo.groupName}</span>
                              </p>
                              <p className="text-[10px] text-emerald-300/80">
                                স্ট্যাটাস: {hoveredSeatInfo.isMySeat ? 'আপনার নিজস্ব গ্রুপ বুকিং' : 'পার্টনার গ্রুপের নিশ্চিত আসন'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-500/30 text-emerald-200">
                            কনফার্মড
                          </span>
                        </div>
                      )}

                      {/* Bus Seat Layout */}
                      <div className="max-w-[420px] mx-auto bg-[#F9FBFA] rounded-3xl p-5 border-2 border-slate-300/80 shadow-md">
                        {/* Bus Front: Door on Left, Driver on Right */}
                        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-dashed border-slate-200 text-xs font-bold text-slate-500">
                          <div className="flex items-center gap-1.5 text-amber-900 bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-lg">
                            <span>🚪 সামনের দরজা</span>
                          </div>

                          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold">
                            সামনের দিক (FRONT)
                          </span>

                          <div className="flex items-center gap-1.5 text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                            <span className="font-bold">ড্রাইভার</span>
                            <svg className="w-4 h-4 text-emerald-800 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Steering wheel">
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="2.5" />
                              <line x1="12" y1="2" x2="12" y2="9.5" />
                              <line x1="2.5" y1="14" x2="9.8" y2="13" />
                              <line x1="21.5" y1="14" x2="14.2" y2="13" />
                            </svg>
                          </div>
                        </div>

                        {/* Bus Seat Rows (A to J) */}
                        <div className="space-y-2.5">
                          {rows.map((row) => (
                            <div key={row} className="flex items-center justify-between gap-1 sm:gap-2">
                              {/* Left Pair: Seats 1 and 2 */}
                              <div className="flex items-center gap-2">
                                {[1, 2].map((num) => {
                                  const seatNo = `${row}${num}`;
                                  const ownerGroup = (activeSeatTour.partnerGroups || []).find((g) =>
                                    (g.allocatedSeats || []).includes(seatNo)
                                  );
                                  const isMySeat = ownerGroup?.groupId === activeGroupId || ownerGroup?.groupName === activeGroup.name;

                                  const isBookedInBus = (activeSeatTour.busInfo?.bookedSeats || []).includes(seatNo);
                                  const bookingGroup = (activeSeatTour.partnerGroups || []).find((g) =>
                                    (g.bookedSeats || []).includes(seatNo)
                                  ) || (isBookedInBus ? ownerGroup : null);

                                  const isBooked = Boolean(bookingGroup || isBookedInBus);

                                  // Calculate styling based on user's exact specification:
                                  // 1. My seat unbooked: full opacity white with solid border
                                  // 2. My seat booked: full opacity dark emerald/black with ✓
                                  // 3. Other group unbooked: low opacity ash color
                                  // 4. Other group booked: low opacity green + hover tooltip showing group name
                                  let seatClasses = '';
                                  let seatTitle = '';

                                  if (isMySeat) {
                                    if (isBooked) {
                                      seatClasses = 'bg-[#03251A] text-white shadow-xs border-2 border-emerald-950 font-bold';
                                      seatTitle = `সিট ${seatNo} | আপনার গ্রুপের বুকড সিট`;
                                    } else {
                                      seatClasses = 'bg-white text-emerald-950 border-2 border-emerald-600 shadow-xs font-bold hover:scale-105 hover:bg-emerald-50 cursor-pointer';
                                      seatTitle = `সিট ${seatNo} | আপনার খালি সিট (বিক্রির জন্য প্রস্তুত)`;
                                    }
                                  } else {
                                    if (isBooked) {
                                      seatClasses = 'bg-emerald-500/25 border-2 border-emerald-500/40 text-emerald-950 font-extrabold hover:bg-emerald-500/45 hover:border-emerald-600 transition-all cursor-pointer';
                                      seatTitle = `সিট ${seatNo} | বুক করেছে: ${bookingGroup?.groupName || ownerGroup?.groupName || 'অন্যান্য পার্টনার'}`;
                                    } else {
                                      seatClasses = 'opacity-35 bg-slate-200 border border-slate-300 text-slate-500 cursor-default select-none';
                                      seatTitle = `সিট ${seatNo} | অন্য গ্রুপ: ${ownerGroup?.groupName || 'অন্যান্য'} (অবিক্রিত)`;
                                    }
                                  }

                                  return (
                                    <div
                                      key={seatNo}
                                      onMouseEnter={() => {
                                        if (isBooked) {
                                          setHoveredSeatInfo({
                                            seatNo,
                                            groupName: bookingGroup?.groupName || ownerGroup?.groupName || 'অন্য গ্রুপ',
                                            isMySeat,
                                          });
                                        }
                                      }}
                                      onMouseLeave={() => setHoveredSeatInfo(null)}
                                      title={seatTitle}
                                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs flex flex-col items-center justify-center relative select-none transition-all ${seatClasses}`}
                                    >
                                      <span className="leading-none text-[10px] font-bold">{seatNo}</span>
                                      {isMySeat ? (
                                        isBooked ? (
                                          <span className="text-[7px] leading-none mt-0.5 opacity-90">✓ বুকড</span>
                                        ) : (
                                          <span className="text-[7px] leading-none mt-0.5 text-emerald-700 font-bold">খালি</span>
                                        )
                                      ) : isBooked ? (
                                        <span className="text-[7px] leading-none mt-0.5 text-emerald-900 font-extrabold">বুকড</span>
                                      ) : (
                                        <span className="text-[7px] leading-none mt-0.5 text-slate-400">অ্যাশ</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Aisle (হাঁটার পথ) */}
                              <div className="w-5 sm:w-6 flex items-center justify-center">
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                              </div>

                              {/* Right Pair: Seats 3 and 4 */}
                              <div className="flex items-center gap-2">
                                {[3, 4].map((num) => {
                                  const seatNo = `${row}${num}`;
                                  const ownerGroup = (activeSeatTour.partnerGroups || []).find((g) =>
                                    (g.allocatedSeats || []).includes(seatNo)
                                  );
                                  const isMySeat = ownerGroup?.groupId === activeGroupId || ownerGroup?.groupName === activeGroup.name;

                                  const isBookedInBus = (activeSeatTour.busInfo?.bookedSeats || []).includes(seatNo);
                                  const bookingGroup = (activeSeatTour.partnerGroups || []).find((g) =>
                                    (g.bookedSeats || []).includes(seatNo)
                                  ) || (isBookedInBus ? ownerGroup : null);

                                  const isBooked = Boolean(bookingGroup || isBookedInBus);

                                  let seatClasses = '';
                                  let seatTitle = '';

                                  if (isMySeat) {
                                    if (isBooked) {
                                      seatClasses = 'bg-[#03251A] text-white shadow-xs border-2 border-emerald-950 font-bold';
                                      seatTitle = `সিট ${seatNo} | আপনার গ্রুপের বুকড সিট`;
                                    } else {
                                      seatClasses = 'bg-white text-emerald-950 border-2 border-emerald-600 shadow-xs font-bold hover:scale-105 hover:bg-emerald-50 cursor-pointer';
                                      seatTitle = `সিট ${seatNo} | আপনার খালি সিট (বিক্রির জন্য প্রস্তুত)`;
                                    }
                                  } else {
                                    if (isBooked) {
                                      seatClasses = 'bg-emerald-500/25 border-2 border-emerald-500/40 text-emerald-950 font-extrabold hover:bg-emerald-500/45 hover:border-emerald-600 transition-all cursor-pointer';
                                      seatTitle = `সিট ${seatNo} | বুক করেছে: ${bookingGroup?.groupName || ownerGroup?.groupName || 'অন্যান্য পার্টনার'}`;
                                    } else {
                                      seatClasses = 'opacity-35 bg-slate-200 border border-slate-300 text-slate-500 cursor-default select-none';
                                      seatTitle = `সিট ${seatNo} | অন্য গ্রুপ: ${ownerGroup?.groupName || 'অন্যান্য'} (অবিক্রিত)`;
                                    }
                                  }

                                  return (
                                    <div
                                      key={seatNo}
                                      onMouseEnter={() => {
                                        if (isBooked) {
                                          setHoveredSeatInfo({
                                            seatNo,
                                            groupName: bookingGroup?.groupName || ownerGroup?.groupName || 'অন্য গ্রুপ',
                                            isMySeat,
                                          });
                                        }
                                      }}
                                      onMouseLeave={() => setHoveredSeatInfo(null)}
                                      title={seatTitle}
                                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs flex flex-col items-center justify-center relative select-none transition-all ${seatClasses}`}
                                    >
                                      <span className="leading-none text-[10px] font-bold">{seatNo}</span>
                                      {isMySeat ? (
                                        isBooked ? (
                                          <span className="text-[7px] leading-none mt-0.5 opacity-90">✓ বুকড</span>
                                        ) : (
                                          <span className="text-[7px] leading-none mt-0.5 text-emerald-700 font-bold">খালি</span>
                                        )
                                      ) : isBooked ? (
                                        <span className="text-[7px] leading-none mt-0.5 text-emerald-900 font-extrabold">বুকড</span>
                                      ) : (
                                        <span className="text-[7px] leading-none mt-0.5 text-slate-400">অ্যাশ</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bus Back Exit / Footer */}
                        <div className="pt-3 mt-4 border-t-2 border-dashed border-slate-200 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          পেছনের অংশ (Rear) • মোট সিট {activeSeatTour.totalSeats || 40}টি
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 4: CENTRAL JOINT MONITORING */}
          {activeTab === 'joint' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <CentralSeatMonitor
                tours={tourList}
                currentGroup={{ id: activeGroupId, name: activeGroup.name, slug: activeGroup.slug }}
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

          {/* Edit Tour Modal */}
          {isEditModalOpen && tourToEdit && (
            <EditTourModal
              tour={tourToEdit}
              currentUser={{
                id: activeGroupId,
                name: activeGroup.name,
                slug: activeGroup.slug,
              }}
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setTourToEdit(null);
              }}
              onSave={handleSaveEditedTour}
            />
          )}
        </main>
      </div>
    </div>
  );
}
