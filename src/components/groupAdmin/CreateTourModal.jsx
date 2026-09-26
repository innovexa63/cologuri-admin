import { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, ShieldCheck, Bus, Users, Sparkles, Building2 } from 'lucide-react';
import { tourGroups } from '../../data/mockData';
import SeatAllocationPicker from './SeatAllocationPicker';

const DEFAULT_PARTNER_COLORS = ['#166B47', '#C9622B', '#0284C7', '#8E24AA', '#D97706'];

export default function CreateTourModal({ onClose, onTourCreated, currentUser }) {
  // Tour Type: 'own' (একক ট্যুর) | 'combine' (যৌথ ট্যুর)
  const [tourType, setTourType] = useState('combine');

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('sajek');
  const [destinationName, setDestinationName] = useState('সাজেক ভ্যালি');
  const [route, setRoute] = useState('ঢাকা → খাগড়াছড়ি → সাজেক → কংলাক');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [duration, setDuration] = useState('৩ রাত ২ দিন');
  const [totalSeats, setTotalSeats] = useState(40);
  const [price, setPrice] = useState(5200);
  const [busName, setBusName] = useState('শ্যামলী এন.আর ট্রাভেলস / শান্তি পরিবহন');
  const [busType, setBusType] = useState('হিনো ১জে এসি লাক্সারি চেয়ার কোচ (২ x ২)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine Tour: Partner Groups Setup
  const currentGroupName = currentUser?.name || 'ঘুরি বাংলাদেশ';
  const currentGroupId = currentUser?.id || 'tg1';

  const [partnerGroups, setPartnerGroups] = useState([
    {
      id: currentGroupId,
      name: currentGroupName,
      slug: 'ghuri-bd',
      color: DEFAULT_PARTNER_COLORS[0],
      isMain: true,
    },
    {
      id: 'tg2',
      name: 'সবুজ পথিক',
      slug: 'sobuj-pathik',
      color: DEFAULT_PARTNER_COLORS[1],
      isMain: false,
    },
  ]);

  // Initial seat allocation: Rows A-E to Group 1 (20 seats), Rows F-J to Group 2 (20 seats)
  const initialMap = {};
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows.forEach((r, idx) => {
    const owner = idx < 5 ? currentGroupId : 'tg2';
    [1, 2, 3, 4].forEach((n) => {
      initialMap[`${r}${n}`] = owner;
    });
  });

  const [allocatedMap, setAllocatedMap] = useState(initialMap);

  // Add another partner group
  const handleAddPartner = (groupId) => {
    const found = tourGroups.find((g) => g.id === groupId);
    if (!found || partnerGroups.some((p) => p.id === groupId)) return;

    const newColor = DEFAULT_PARTNER_COLORS[partnerGroups.length % DEFAULT_PARTNER_COLORS.length];
    setPartnerGroups([
      ...partnerGroups,
      {
        id: found.id,
        name: found.name,
        slug: found.slug,
        color: newColor,
        isMain: false,
      },
    ]);
  };

  const handleRemovePartner = (groupId) => {
    if (partnerGroups.length <= 2) {
      alert('যৌথ (Combine) ট্যুরের জন্য অন্তত ২টি পার্টনার গ্রুপ থাকা আবশ্যক।');
      return;
    }
    const remaining = partnerGroups.filter((p) => p.id !== groupId);
    setPartnerGroups(remaining);

    // Reassign orphan seats to main group
    const newMap = { ...allocatedMap };
    Object.keys(newMap).forEach((seat) => {
      if (newMap[seat] === groupId) {
        newMap[seat] = remaining[0].id;
      }
    });
    setAllocatedMap(newMap);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('অনুগ্রহ করে ট্যুরের শিরোনাম প্রদান করুন।');
      return;
    }

    if (tourType === 'combine') {
      const allocatedSeatsCount = Object.keys(allocatedMap).length;
      if (allocatedSeatsCount < totalSeats) {
        const confirmUnallocated = window.confirm(
          `মোট ${totalSeats}টি সিটের মধ্যে ${allocatedSeatsCount}টি সিট বরাদ্দ করা হয়েছে। বাকি ${totalSeats - allocatedSeatsCount}টি সিট অবণ্টিত থাকবে। আপনি কি প্রকাশ করতে চান?`
        );
        if (!confirmUnallocated) return;
      }
    }

    setIsSubmitting(true);

    // Build structured partnerGroups with allocatedSeats
    const structuredPartners = partnerGroups.map((p) => {
      const seats = Object.keys(allocatedMap).filter((seatNo) => allocatedMap[seatNo] === p.id);
      return {
        groupId: p.id,
        groupName: p.name,
        groupSlug: p.slug,
        color: p.color,
        allocatedSeats: seats,
        bookedSeats: [],
      };
    });

    const newTour = {
      id: 'tour-' + Date.now(),
      slug: (title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(100 + Math.random() * 900))
        .replace(/^-+|-+$/g, '') || ('tour-' + Date.now()),
      title: title.trim(),
      destination,
      destinationName,
      category: 'পাহাড় ও মেঘ',
      route,
      startDate,
      duration,
      price: Number(price),
      seatsTotal: Number(totalSeats),
      totalSeats: Number(totalSeats),
      seatsBooked: 0,
      bookedSeats: 0,
      tourType, // 'own' | 'combine'
      isJointTour: tourType === 'combine',
      partnerGroups: tourType === 'combine' ? structuredPartners : [],
      seatTransfers: [],
      coOrganizers: tourType === 'combine' ? partnerGroups.slice(1) : [],
      operator: {
        id: currentGroupId,
        name: currentGroupName,
        rating: 4.9,
        trips: 184,
      },
      tag: tourType === 'combine' ? '🤝 মাল্টি-গ্রুপ জয়েন্ট ট্যুর' : 'একক ট্যুর',
      tagColor: tourType === 'combine' ? '#C9622B' : '#166B47',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
      busInfo: {
        busName,
        busType,
        departureTime: 'রাত ১০:৩০ মিনিট',
        departurePlace: 'আরামবাগ বাস টার্মিনাল, ঢাকা',
        dropOffPlace: 'খাগড়াছড়ি বাস টার্মিনাল',
        totalSeats: Number(totalSeats),
        bookedSeats: [],
        femaleSeats: ['C3', 'C4'],
      },
    };

    // Try posting to backend server
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    try {
      await fetch(`${serverUrl}/api/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTour.title,
          destination: newTour.destination,
          destinationName: newTour.destinationName,
          route: newTour.route,
          startDate: newTour.startDate,
          duration: newTour.duration,
          price: newTour.price,
          seatsTotal: newTour.totalSeats,
          tourType: newTour.tourType,
          partnerGroups: newTour.partnerGroups,
          busInfo: newTour.busInfo,
        }),
      });
    } catch (e) {
      // Backend offline fallback handled gracefully
    }

    if (onTourCreated) {
      onTourCreated(newTour);
    }

    setIsSubmitting(false);
    alert(`ট্যুর "${newTour.title}" (${tourType === 'combine' ? 'যৌথ / Combine' : 'একক / Own'}) সফলভাবে তৈরি ও প্রকাশিত হয়েছে!`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-5 sm:p-7 border border-slate-200 max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
              নতুন ট্যুর প্যাকেজ তৈরি করুন
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              একক ট্যুর অথবা একাধিক গ্রুপ মিলে মাল্টি-গ্রুপ জয়েন্ট ট্যুর সেটআপ করুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 pr-1 space-y-5">
          {/* TOUR TYPE TOGGLE: OWN TOUR vs COMBINE TOUR */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              ট্যুরের ধরন নির্বাচন করুন (Tour Mode) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Own Tour */}
              <button
                type="button"
                onClick={() => setTourType('own')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                  tourType === 'own'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tourType === 'own' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900">Own Tour (একক ট্যুর)</p>
                    {tourType === 'own' && <CheckCircle2 size={16} className="text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    শুধুমাত্র আপনার নিজস্ব ট্যুর গ্রুপের ব্যানারে পরিচালিত একক ট্যুর। বাসের ১০০% সিট আপনার নিয়ন্ত্রণে।
                  </p>
                </div>
              </button>

              {/* Option 2: Combine Tour */}
              <button
                type="button"
                onClick={() => setTourType('combine')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                  tourType === 'combine'
                    ? 'border-[#C9622B] bg-orange-50/60 shadow-xs ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tourType === 'combine' ? 'bg-[#C9622B] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Users size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900">Combine Tour (যৌথ ট্যুর)</p>
                    {tourType === 'combine' && <CheckCircle2 size={16} className="text-[#C9622B]" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    দুই বা ততোধিক গ্রুপ মিলে এক বাসে যৌথ অভিযান। বাসের সিট ভাগ করে দেওয়া এবং লাইভ ট্রান্সফার সুবিধা।
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* COMBINE TOUR SPECIFIC: PARTNER GROUPS SETUP & SEAT ALLOCATION */}
          {tourType === 'combine' && (
            <div className="space-y-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    <span>পার্টনার ট্যুর গ্রুপ নির্বাচন</span>
                    <span className="text-[11px] font-semibold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                      {partnerGroups.length}টি গ্রুপ যুক্ত
                    </span>
                  </h4>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    যৌথ ট্যুরে কোন কোন গ্রুপ অংশ নেবে তা নির্বাচন করুন
                  </p>
                </div>

                {/* Add Partner Dropdown */}
                {partnerGroups.length < 4 && (
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddPartner(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="text-xs font-semibold bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-slate-700 cursor-pointer shadow-2xs"
                    >
                      <option value="">+ পার্টনার গ্রুপ যোগ করুন</option>
                      {tourGroups
                        .filter((tg) => !partnerGroups.some((p) => p.id === tg.id))
                        .map((tg) => (
                          <option key={tg.id} value={tg.id}>
                            {tg.name} ({tg.location})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Connected Partner Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {partnerGroups.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold text-slate-800"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span>{p.name}</span>
                    {p.isMain ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                        মূল হোস্ট
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemovePartner(p.id)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                        title="গ্রুপটি বাদ দিন"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* SEAT ALLOCATION PICKER */}
              <SeatAllocationPicker
                partnerGroups={partnerGroups}
                allocatedMap={allocatedMap}
                onAllocationChange={setAllocatedMap}
                totalSeats={Number(totalSeats)}
              />
            </div>
          )}

          {/* BASIC TOUR DETAILS */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              সাধারণ বিবরণ (Tour Information)
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ট্যুরের শিরোনাম *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মেঘ ছোঁয়ার সাজেক ভ্যালি ৩ রাত ২ দিন"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  গন্তব্যস্থল
                </label>
                <select
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    const opt = e.target.options[e.target.selectedIndex];
                    setDestinationName(opt.text);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white cursor-pointer"
                >
                  <option value="sajek">সাজেক ভ্যালি</option>
                  <option value="coxsbazar">কক্সবাজার</option>
                  <option value="sundarban">সুন্দরবন</option>
                  <option value="bandarban">বান্দরবান</option>
                  <option value="sreemangal">শ্রীমঙ্গল</option>
                  <option value="tanguar">টাঙ্গুয়ার হাওর</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ভ্রমণ রুট *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ঢাকা → খাগড়াছড়ি → সাজেক"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  যাত্রার তারিখ
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ট্যুরের সময়কাল
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="৩ রাত ২ দিন"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জনপ্রতি মূল্য (৳)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Bus Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাসের নাম ও কোম্পানি
                </label>
                <input
                  type="text"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  placeholder="শ্যামলী এন.আর / শান্তি পরিবহন"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাসের ধরন
                </label>
                <input
                  type="text"
                  value={busType}
                  onChange={(e) => setBusType(e.target.value)}
                  placeholder="হিনো ১জে এসি লাক্সারি চেয়ার কোচ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tourType === 'combine'
                  ? 'bg-[#C9622B] hover:bg-[#b05221]'
                  : 'bg-[#168B5E] hover:bg-[#03251A]'
              }`}
            >
              {isSubmitting ? (
                <span>প্রকাশ করা হচ্ছে...</span>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>
                    {tourType === 'combine' ? 'যৌথ (Combine) ট্যুর প্রকাশ করুন' : 'একক ট্যুর প্রকাশ করুন'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
