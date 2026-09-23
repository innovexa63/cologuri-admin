import { useState } from 'react';
import {
  LayoutDashboard, PlusCircle, Users, BarChart2,
  MapPin, Calendar, ChevronRight, Wallet, TrendingUp,
  CheckCircle, AlertTriangle, Settings
} from 'lucide-react';
import { liveTourPackages, tourGroups } from '../../data/mockData';

export default function GroupAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
    { id: 'tours', icon: MapPin, label: 'আমার ট্যুর' },
    { id: 'seats', icon: Users, label: 'সিট ম্যানেজমেন্ট' },
    { id: 'joint', icon: PlusCircle, label: 'জয়েন্ট ট্যুর' },
    { id: 'earnings', icon: Wallet, label: 'আয় ও পেমেন্ট' },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      {/* Admin Header */}
      <header className="bg-primary py-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <span className="font-tiro text-white text-base">ঘ</span>
          </div>
          <div>
            <p className="font-tiro text-white text-sm">ঘুরবেসবাই</p>
            <p className="font-hind text-secondary text-xs">গ্রুপ অ্যাডমিন পোর্টাল</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-secondary rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <CheckCircle size={13} className="text-white" aria-hidden="true" />
            <span className="font-hind text-white text-xs font-semibold">ভেরিফায়েড</span>
          </div>
          <div className="text-right">
            <p className="font-hind text-white text-sm font-semibold">ঘুরি বাংলাদেশ</p>
            <p className="font-hind text-white/50 text-xs">tour.operator@ghurbe.com</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-56 bg-white border-r border-surface-muted flex-shrink-0 p-4"
             aria-label="অ্যাডমিন নেভিগেশন">
          <ul role="list" className="space-y-1">
            {tabs.map(({ id, icon: Icon, label }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                              font-hind text-sm transition-all duration-150
                              focus-visible:ring-2 focus-visible:ring-secondary
                              ${activeTab === id
                                ? 'bg-primary text-white font-semibold'
                                : 'text-text-dark hover:bg-bg-section'
                              }`}
                  aria-current={activeTab === id ? 'page' : undefined}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                               font-hind text-sm text-text-muted hover:bg-bg-section
                               transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-secondary">
              <Settings size={16} aria-hidden="true" />
              সেটিংস
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {activeTab === 'dashboard' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-tiro text-primary text-2xl">ড্যাশবোর্ড ওভারভিউ</h1>
                <button onClick={() => setShowCreateModal(true)}
                  className="btn-accent text-sm"
                  id="create-tour-btn">
                  <PlusCircle size={15} aria-hidden="true" />
                  নতুন ট্যুর তৈরি
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'সক্রিয় ট্যুর', value: '৭', icon: MapPin, color: 'text-secondary bg-secondary/10' },
                  { label: 'মোট বুকিং', value: '১৪৩', icon: Users, color: 'text-primary bg-primary/10' },
                  { label: 'এই মাসের আয়', value: '৳২.৪ লাখ', icon: TrendingUp, color: 'text-accent bg-accent/10' },
                  { label: 'গ্রাহক সন্তুষ্টি', value: '৪.৮★', icon: BarChart2, color: 'text-yellow-600 bg-yellow-50' },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className="bg-white rounded-xl p-4 card-shadow">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${kpi.color}`}>
                        <Icon size={17} aria-hidden="true" />
                      </div>
                      <p className="font-tiro text-primary text-xl font-bold">{kpi.value}</p>
                      <p className="font-hind text-text-muted text-xs">{kpi.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Tours */}
              <div className="bg-white rounded-xl card-shadow p-5">
                <h2 className="font-tiro text-primary text-base mb-4">সাম্প্রতিক ট্যুর</h2>
                <div className="space-y-3">
                  {liveTourPackages.map((pkg) => {
                    const pct = Math.round((pkg.bookedSeats / pkg.totalSeats) * 100);
                    return (
                      <div key={pkg.id}
                        className="flex items-center gap-4 p-3 bg-bg-light rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-hind font-semibold text-text-dark text-sm truncate">
                            {pkg.title}
                          </p>
                          <p className="font-hind text-text-muted text-xs">{pkg.startDate}</p>
                        </div>
                        <div className="w-24">
                          <div className="flex justify-between text-xs font-hind text-text-muted mb-1">
                            <span>{pct}%</span>
                            <span>{pkg.bookedSeats}/{pkg.totalSeats}</span>
                          </div>
                          <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full"
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <span className={`badge text-xs ${
                          pkg.status === 'live' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {pkg.status === 'live' ? 'লাইভ' : 'আসছে'}
                        </span>
                        <button className="text-text-muted hover:text-primary transition-colors"
                          aria-label={`${pkg.title} বিস্তারিত দেখুন`}>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seats' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">সিট ম্যানেজমেন্ট ও লকিং</h1>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" aria-hidden="true" />
                <div className="font-hind text-amber-800 text-sm leading-relaxed">
                  <strong>Race Condition সুরক্ষা চালু আছে।</strong> একই সিটে একাধিক বুকিং প্রতিরোধে
                  Redis Distributed Lock সিস্টেম ব্যবহার করা হচ্ছে। লক টাইম: ১৫ মিনিট।
                </div>
              </div>
              <div className="grid gap-4">
                {liveTourPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-xl card-shadow p-5">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-tiro text-primary text-base">{pkg.title}</h3>
                      <div className="flex gap-2">
                        <span className="badge bg-secondary/15 text-secondary">
                          {pkg.totalSeats - pkg.bookedSeats} সিট বাকি
                        </span>
                        <span className={`badge ${
                          pkg.isJointTour ? 'bg-accent/15 text-accent' : 'bg-primary/10 text-primary'
                        }`}>
                          {pkg.isJointTour ? 'জয়েন্ট ট্যুর' : 'একক ট্যুর'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-1.5 mb-3">
                      {Array.from({ length: pkg.totalSeats }).map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-md text-xs flex items-center justify-center
                                      font-hind font-semibold
                                      ${i < pkg.bookedSeats
                                        ? 'bg-primary text-white'
                                        : 'bg-bg-section text-text-muted border border-surface-muted'
                                      }`}
                          title={i < pkg.bookedSeats ? 'বুক হয়েছে' : 'খালি'}
                          aria-label={`সিট ${i + 1}: ${i < pkg.bookedSeats ? 'বুক হয়েছে' : 'খালি'}`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-hind text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-primary rounded-sm" aria-hidden="true" />
                        বুক হয়েছে ({pkg.bookedSeats})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-bg-section border border-surface-muted rounded-sm" aria-hidden="true" />
                        খালি ({pkg.totalSeats - pkg.bookedSeats})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'joint' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">জয়েন্ট ট্যুর পার্টনারশিপ</h1>
              <div className="grid md:grid-cols-2 gap-4">
                {tourGroups.slice(1).map((group) => (
                  <div key={group.id} className="bg-white rounded-xl card-shadow p-5
                                                  flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-hind font-semibold text-text-dark">{group.name}</p>
                        {group.verified && (
                          <CheckCircle size={14} className="text-secondary" aria-hidden="true" />
                        )}
                      </div>
                      <p className="font-hind text-text-muted text-xs">{group.location}</p>
                      <p className="font-hind text-text-muted text-xs">
                        {group.totalTours}টি ট্যুর · ★ {group.rating}
                      </p>
                    </div>
                    <button
                      className="bg-secondary/15 text-secondary font-hind font-semibold text-xs
                                 px-4 py-2 rounded-xl hover:bg-secondary hover:text-white
                                 transition-all duration-200"
                      id={`invite-joint-${group.id}`}
                    >
                      পার্টনারশিপ আমন্ত্রণ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">আয় ও পেমেন্ট</h1>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'এই মাসের মোট বিক্রয়', value: '৳ ৩,২৪,৫০০', sub: 'আগের মাস থেকে +১৮%' },
                  { label: 'প্ল্যাটফর্ম কমিশন (৮%)', value: '৳ ২৫,৯৬০', sub: 'স্বয়ংক্রিয় কাটা' },
                  { label: 'নেট আয়', value: '৳ ২,৯৮,৫৪০', sub: 'আগামীকাল ব্যাংক ট্রান্সফার' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl card-shadow p-5">
                    <p className="font-hind text-text-muted text-xs mb-2">{item.label}</p>
                    <p className="font-tiro text-primary text-2xl mb-1">{item.value}</p>
                    <p className="font-hind text-secondary text-xs">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl card-shadow p-5">
                <h2 className="font-tiro text-primary text-base mb-4">সাম্প্রতিক ট্রানজেকশন</h2>
                <div className="space-y-3">
                  {[
                    { name: 'রাহেলা বেগম', tour: 'সাজেক পূর্ণিমা ট্যুর', amount: '৳ ৯,৬০০', method: 'bKash', date: '১৮ সেপ্টেম্বর' },
                    { name: 'মোহাম্মদ কামাল', tour: 'সুন্দরবন অভিযান', amount: '৳ ৬,৫০০', method: 'SSLCommerz', date: '১৭ সেপ্টেম্বর' },
                    { name: 'ফারহানা ইসলাম', tour: 'বান্দরবান কাস্টম', amount: '৳ ৪৪,০০০', method: 'Nagad', date: '১৬ সেপ্টেম্বর' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-bg-light rounded-xl">
                      <div>
                        <p className="font-hind font-semibold text-text-dark text-sm">{tx.name}</p>
                        <p className="font-hind text-text-muted text-xs">{tx.tour} · {tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-hind font-semibold text-primary text-sm">{tx.amount}</p>
                        <span className="badge bg-green-100 text-green-700 text-[10px]">{tx.method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tours' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-tiro text-primary text-2xl">আমার ট্যুর প্যাকেজ</h1>
                <button onClick={() => setShowCreateModal(true)}
                  className="btn-accent text-sm" id="create-tour-btn-2">
                  <PlusCircle size={15} /> নতুন ট্যুর
                </button>
              </div>
              <div className="space-y-4">
                {liveTourPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-xl card-shadow p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-tiro text-primary text-lg mb-1">{pkg.title}</h3>
                        <p className="font-hind text-text-muted text-sm flex items-center gap-1">
                          <MapPin size={12} aria-hidden="true" /> {pkg.route}
                        </p>
                        <p className="font-hind text-text-muted text-sm flex items-center gap-1 mt-1">
                          <Calendar size={12} aria-hidden="true" /> {pkg.startDate} · {pkg.duration}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="font-hind text-xs border border-surface-muted px-3 py-1.5
                                           rounded-lg hover:bg-bg-section transition-colors"
                          id={`edit-tour-${pkg.id}`}>
                          সম্পাদনা
                        </button>
                        <button className="font-hind text-xs bg-primary text-white px-3 py-1.5
                                           rounded-lg hover:bg-primary-dark transition-colors"
                          id={`view-tour-${pkg.id}`}>
                          বিস্তারিত
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Tour Modal */}
      {showCreateModal && (
        <CreateTourModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CreateTourModal({ onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="নতুন ট্যুর তৈরি"
      className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="font-tiro text-primary text-xl mb-5">নতুন ট্যুর প্যাকেজ তৈরি</h3>
        <div className="space-y-4">
          {[
            { id: 'new-tour-title', label: 'ট্যুরের নাম', type: 'text', placeholder: 'যেমন: সাজেক পূর্ণিমা ট্যুর' },
            { id: 'new-tour-route', label: 'রুট', type: 'text', placeholder: 'ঢাকা → সাজেক → ঢাকা' },
            { id: 'new-tour-date', label: 'শুরুর তারিখ', type: 'date', placeholder: '' },
            { id: 'new-tour-seats', label: 'মোট সিট', type: 'number', placeholder: '৩০' },
            { id: 'new-tour-price', label: 'জনপ্রতি মূল্য (৳)', type: 'number', placeholder: '৫০০০' },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="font-hind text-text-dark text-sm font-medium mb-1.5 block">
                {field.label}
              </label>
              <input id={field.id} type={field.type} placeholder={field.placeholder}
                className="form-input" />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="new-tour-joint"
              className="w-4 h-4 accent-secondary cursor-pointer" />
            <label htmlFor="new-tour-joint" className="font-hind text-text-dark text-sm cursor-pointer">
              জয়েন্ট ট্যুর হিসেবে পোস্ট করুন (অন্য গ্রুপ সিট শেয়ার করতে পারবে)
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 border-2 border-surface-muted text-text-dark font-hind font-semibold
                         py-2.5 rounded-xl hover:bg-bg-section transition-colors"
              type="button">বাতিল</button>
            <button
              className="flex-1 btn-accent justify-center"
              id="save-new-tour-btn" type="button">ট্যুর প্রকাশ করুন</button>
          </div>
        </div>
      </div>
    </div>
  );
}
