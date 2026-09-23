import { useState } from 'react';
import {
  LayoutDashboard, Shield, MapPin, Users, BarChart2,
  CheckCircle, XCircle, AlertTriangle, TrendingUp, ChevronRight
} from 'lucide-react';
import { tourGroups, liveTourPackages } from '../../data/mockData';

const pendingAgencies = [
  { id: 'pa1', name: 'সিলেট অ্যাডভেঞ্চার ক্লাব', owner: 'মোহাম্মদ সাইফুল', location: 'সিলেট', applied: '১৫ সেপ্টেম্বর ২০২৬', tours: 0, tradeLicense: true, nid: true, safetyScore: 82 },
  { id: 'pa2', name: 'সুন্দরবন ক্রুজ লাইন', owner: 'নাসরিন আক্তার', location: 'খুলনা', applied: '১৪ সেপ্টেম্বর ২০২৬', tours: 0, tradeLicense: true, nid: false, safetyScore: 74 },
  { id: 'pa3', name: 'হাওর ট্রেকার্স', owner: 'রফিকুল ইসলাম', location: 'সুনামগঞ্জ', applied: '১২ সেপ্টেম্বর ২০২৬', tours: 0, tradeLicense: false, nid: true, safetyScore: 68 },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [agencyStatus, setAgencyStatus] = useState(
    Object.fromEntries(pendingAgencies.map((a) => [a.id, 'pending']))
  );

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: 'প্ল্যাটফর্ম ওভারভিউ' },
    { id: 'kyc', icon: Shield, label: 'এজেন্সি ভেরিফিকেশন' },
    { id: 'destinations', icon: MapPin, label: 'দর্শনীয় স্থান' },
    { id: 'disputes', icon: AlertTriangle, label: 'ডিসপিউট ও অডিট' },
    { id: 'analytics', icon: BarChart2, label: 'বিশ্লেষণ' },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      {/* Super Admin Header */}
      <header className="bg-bg-dark py-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="font-tiro text-white text-base">ঘ</span>
          </div>
          <div>
            <p className="font-tiro text-white text-sm">ঘুরবেসবাই</p>
            <p className="font-hind text-accent text-xs">সুপার অ্যাডমিন পোর্টাল</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge bg-accent text-white">সুপার অ্যাডমিন</span>
          <p className="font-hind text-white text-sm hidden sm:block">admin@ghurbesobai.com</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-60 bg-white border-r border-surface-muted flex-shrink-0 p-4"
             aria-label="সুপার অ্যাডমিন নেভিগেশন">
          <ul role="list" className="space-y-1">
            {tabs.map(({ id, icon: Icon, label }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                              font-hind text-sm transition-all duration-150
                              focus-visible:ring-2 focus-visible:ring-accent
                              ${activeTab === id
                                ? 'bg-bg-dark text-white font-semibold'
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
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {activeTab === 'overview' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">প্ল্যাটফর্ম ওভারভিউ</h1>

              {/* Platform KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'মোট GMV (এই মাস)', value: '৳ ৪২.৭ লাখ', icon: TrendingUp, sub: '+২৩% মাস-মাস', color: 'text-accent bg-accent/10' },
                  { label: 'ভেরিফায়েড এজেন্সি', value: '২৮৪', icon: Shield, sub: '৩টি পেন্ডিং', color: 'text-primary bg-primary/10' },
                  { label: 'লাইভ সিট বুকিং', value: '৭৫', icon: Users, sub: 'গত ২৪ ঘন্টা', color: 'text-secondary bg-secondary/10' },
                  { label: 'প্ল্যাটফর্ম রেভিনিউ', value: '৳ ৩.৪ লাখ', icon: BarChart2, sub: '৮% কমিশন', color: 'text-yellow-600 bg-yellow-50' },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className="bg-white rounded-xl p-4 card-shadow">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${kpi.color}`}>
                        <Icon size={17} aria-hidden="true" />
                      </div>
                      <p className="font-tiro text-primary text-xl font-bold">{kpi.value}</p>
                      <p className="font-hind text-text-muted text-xs mb-0.5">{kpi.label}</p>
                      <p className="font-hind text-secondary text-xs">{kpi.sub}</p>
                    </div>
                  );
                })}
              </div>

              {/* Active Tour Groups */}
              <div className="bg-white rounded-xl card-shadow p-5">
                <h2 className="font-tiro text-primary text-base mb-4">সক্রিয় ট্যুর গ্রুপ</h2>
                <div className="space-y-2">
                  {tourGroups.map((group) => (
                    <div key={group.id}
                      className="flex items-center justify-between p-3 bg-bg-light rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-secondary/15 rounded-xl flex items-center justify-center">
                          <span className="font-tiro text-secondary text-sm">
                            {group.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-hind font-semibold text-text-dark text-sm">{group.name}</p>
                            {group.verified && (
                              <CheckCircle size={13} className="text-secondary" aria-label="ভেরিফায়েড" />
                            )}
                          </div>
                          <p className="font-hind text-text-muted text-xs">{group.location} · {group.totalTours}টি ট্যুর</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-hind text-text-muted text-xs">★ {group.rating}</span>
                        <button className="text-text-muted hover:text-primary" aria-label="বিস্তারিত">
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">এজেন্সি KYC ভেরিফিকেশন</h1>

              <div className="flex gap-4 mb-5">
                {[
                  { label: 'পেন্ডিং', count: pendingAgencies.filter((a) => agencyStatus[a.id] === 'pending').length, color: 'bg-amber-100 text-amber-700' },
                  { label: 'অনুমোদিত', count: pendingAgencies.filter((a) => agencyStatus[a.id] === 'approved').length, color: 'bg-green-100 text-green-700' },
                  { label: 'প্রত্যাখ্যাত', count: pendingAgencies.filter((a) => agencyStatus[a.id] === 'rejected').length, color: 'bg-red-100 text-red-700' },
                ].map((stat) => (
                  <div key={stat.label} className={`px-4 py-2 rounded-xl font-hind font-semibold text-sm ${stat.color}`}>
                    {stat.label}: {stat.count}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {pendingAgencies.map((agency) => {
                  const status = agencyStatus[agency.id];
                  return (
                    <div key={agency.id} className="bg-white rounded-xl card-shadow p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-tiro text-primary text-lg">{agency.name}</h3>
                          <p className="font-hind text-text-muted text-sm">
                            মালিক: {agency.owner} · {agency.location}
                          </p>
                          <p className="font-hind text-text-muted text-xs mt-0.5">
                            আবেদন: {agency.applied}
                          </p>
                        </div>
                        {status !== 'pending' && (
                          <span className={`badge ${
                            status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {status === 'approved' ? '✓ অনুমোদিত' : '✗ প্রত্যাখ্যাত'}
                          </span>
                        )}
                      </div>

                      {/* Checklist */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className={`flex items-center gap-1.5 text-xs font-hind rounded-lg p-2
                                         ${agency.tradeLicense ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {agency.tradeLicense
                            ? <CheckCircle size={13} aria-hidden="true" />
                            : <XCircle size={13} aria-hidden="true" />}
                          ট্রেড লাইসেন্স
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-hind rounded-lg p-2
                                         ${agency.nid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {agency.nid
                            ? <CheckCircle size={13} aria-hidden="true" />
                            : <XCircle size={13} aria-hidden="true" />}
                          NID যাচাই
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-hind rounded-lg p-2
                                         ${agency.safetyScore >= 75 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          <Shield size={13} aria-hidden="true" />
                          নিরাপত্তা স্কোর: {agency.safetyScore}
                        </div>
                      </div>

                      {status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setAgencyStatus((s) => ({ ...s, [agency.id]: 'approved' }))}
                            className="flex-1 bg-secondary text-white font-hind font-semibold text-sm
                                       py-2.5 rounded-xl hover:bg-secondary-dark transition-colors
                                       flex items-center justify-center gap-2"
                            id={`approve-${agency.id}`}
                          >
                            <CheckCircle size={15} aria-hidden="true" /> অনুমোদন দিন
                          </button>
                          <button
                            onClick={() => setAgencyStatus((s) => ({ ...s, [agency.id]: 'rejected' }))}
                            className="flex-1 bg-red-50 text-red-600 font-hind font-semibold text-sm
                                       py-2.5 rounded-xl hover:bg-red-100 transition-colors
                                       flex items-center justify-center gap-2"
                            id={`reject-${agency.id}`}
                          >
                            <XCircle size={15} aria-hidden="true" /> প্রত্যাখ্যান
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">ডিসপিউট ও সিট লক অডিট</h1>
              <div className="space-y-4">
                {liveTourPackages.map((pkg, i) => (
                  <div key={pkg.id} className="bg-white rounded-xl card-shadow p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-hind font-semibold text-text-dark">{pkg.title}</h3>
                      <span className={`badge ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {i === 0 ? 'রিভিউ পেন্ডিং' : 'সমাধান হয়েছে'}
                      </span>
                    </div>
                    <div className="bg-bg-section rounded-lg p-3 font-hind text-sm text-text-muted">
                      <p className="mb-1">
                        <strong className="text-text-dark">সমস্যা:</strong>{' '}
                        {i === 0
                          ? '২টি পৃথক ব্যবহারকারী একই সময়ে সিট ৩১ লক করার চেষ্টা করেছে।'
                          : 'জয়েন্ট ট্যুরে সিট বণ্টন নিয়ে দুটি গ্রুপের মধ্যে বিতর্ক।'}
                      </p>
                      <p>
                        <strong className="text-text-dark">রেজোলিউশন:</strong>{' '}
                        {i === 0
                          ? 'Redis Distributed Lock প্রথম রিকোয়েস্টকে প্রাধান্য দিয়েছে। দ্বিতীয় ব্যবহারকারীকে রিফান্ড ইনিশিয়েট করা হয়েছে।'
                          : 'সমানুপাতিক বণ্টন নীতি প্রয়োগ করা হয়েছে।'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">প্ল্যাটফর্ম বিশ্লেষণ</h1>

              {/* Popular destinations */}
              <div className="bg-white rounded-xl card-shadow p-5 mb-4">
                <h2 className="font-tiro text-primary text-base mb-4">সবচেয়ে জনপ্রিয় গন্তব্য</h2>
                <div className="space-y-3">
                  {[
                    { name: 'সাজেক ভ্যালি', bookings: 1243, pct: 92 },
                    { name: 'কক্সবাজার', bookings: 986, pct: 73 },
                    { name: 'বান্দরবান', bookings: 754, pct: 56 },
                    { name: 'সুন্দরবন', bookings: 621, pct: 46 },
                    { name: 'শ্রীমঙ্গল', bookings: 412, pct: 30 },
                  ].map((dest) => (
                    <div key={dest.name}>
                      <div className="flex justify-between font-hind text-sm text-text-dark mb-1">
                        <span>{dest.name}</span>
                        <span className="text-text-muted">{dest.bookings} বুকিং</span>
                      </div>
                      <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full transition-all duration-700"
                          style={{ width: `${dest.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div>
              <h1 className="font-tiro text-primary text-2xl mb-6">দর্শনীয় স্থান ব্যবস্থাপনা</h1>
              <p className="font-hind text-text-muted">
                নতুন দর্শনীয় স্থান যোগ, বিভাগ ও জেলা ম্যানেজমেন্ট এখানে থাকবে।
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
