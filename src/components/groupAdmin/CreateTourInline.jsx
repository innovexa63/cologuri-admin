import { useState } from 'react';
import {
  Building2, Users, CheckCircle2, ArrowRight, Sparkles,
  Bus, Calendar, MapPin, DollarSign, Clock, ShieldCheck, Check
} from 'lucide-react';
import { tourGroups } from '../../data/mockData';
import SeatAllocationPicker from './SeatAllocationPicker';

const DEFAULT_PARTNER_COLORS = ['#166B47', '#C9622B', '#0284C7', '#8E24AA', '#D97706'];

export default function CreateTourInline({ onTourCreated, onCancel, currentUser }) {
  // Tour Type: 'own' (একক ট্যুর) | 'combine' (যৌথ ট্যুর)
  const [tourType, setTourType] = useState('combine');

  // Form Fields
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
  const [createdSuccess, setCreatedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('যৌথ (Combine) ট্যুরের জন্য অন্তত ২টি পার্টনার গ্রুপ থাকা আবশ্যক।');
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
    setErrorMessage('');
    if (!title.trim()) {
      setErrorMessage('অনুগ্রহ করে ট্যুরের পুরো শিরোনাম প্রদান করুন।');
      return;
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
      tourType,
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

    // Post to server if available
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
    } catch (e) {}

    if (onTourCreated) {
      onTourCreated(newTour);
    }

    setIsSubmitting(false);
    setCreatedSuccess(true);
  };

  if (createdSuccess) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
          ট্যুর প্যাকেজ সফলভাবে প্রকাশিত হয়েছে!
        </h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          আপনার {tourType === 'combine' ? 'মাল্টি-গ্রুপ জয়েন্ট' : 'একক'} ট্যুর প্যাকেজটি এখন লাইভ আছে। ড্যাশবোর্ড ও সেন্ট্রাল সিট মনিটরিংয়ে এটি সরাসরি দেখতে পাবেন।
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl bg-[#03251A] hover:bg-[#166B47] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            ড্যাশবোর্ডে ফিরুন
          </button>
          <button
            type="button"
            onClick={() => {
              setCreatedSuccess(false);
              setTitle('');
            }}
            className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            আরেকটি ট্যুর তৈরি করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
            নতুন ট্যুর প্যাকেজ স্টুডিও
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            সহজ ধাপে নিজস্ব একক ট্যুর অথবা অন্যান্য গ্রুপের সাথে মাল্টি-গ্রুপ কম্বাইন ট্যুর তৈরি করুন
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer"
        >
          ✕ বাতিল করে ফিরুন
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs flex items-center justify-between shadow-2xs">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-red-400 hover:text-red-700 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: SELECT TOUR MODE (OWN TOUR vs COMBINE TOUR) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
          <div className="mb-4">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ধাপ ১ • ট্যুরের ধরন
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2" style={{ fontFamily: '"Tiro Bangla", serif' }}>
              ট্যুরের কার্যপদ্ধতি নির্বাচন করুন
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Own Tour */}
            <div
              onClick={() => setTourType('own')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                tourType === 'own'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    tourType === 'own' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Building2 size={22} />
                  </div>
                  {tourType === 'own' && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                      <Check size={12} /> নির্বাচিত
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 font-serif">Own Tour (একক ট্যুর)</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  শুধুমাত্র আপনার নিজস্ব ট্যুর গ্রুপের ব্যানারে পরিচালিত সাধারণ ট্যুর। বাসের ১০০% আসন আপনার সরাসরি নিয়ন্ত্রণে থাকবে।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>একক হোস্ট ব্র্যান্ডিং</span>
                <span className="mx-1 text-slate-300">•</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>স্বতন্ত্র আসন বরাদ্দ</span>
              </div>
            </div>

            {/* Combine Tour */}
            <div
              onClick={() => setTourType('combine')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                tourType === 'combine'
                  ? 'border-[#C9622B] bg-orange-50/50 shadow-sm ring-2 ring-orange-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    tourType === 'combine' ? 'bg-[#C9622B] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Users size={22} />
                  </div>
                  {tourType === 'combine' && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C9622B] text-white flex items-center gap-1">
                      <Check size={12} /> নির্বাচিত
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 font-serif">Combine Tour (যৌথ / মাল্টি-গ্রুপ ট্যুর)</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  দুই বা ততোধিক ট্যুর গ্রুপ মিলে একই বাসে যৌথভাবে ট্যুর পরিচালনা। সিট বণ্টন, সেন্ট্রাল মনিটরিং ও লাইভ সিট শেয়ারিং সুবিধা।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9622B]" />
                <span>পার্টনার সিট বণ্টন</span>
                <span className="mx-1 text-slate-300">•</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9622B]" />
                <span>লাইভ সিট ট্রান্সফার</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: BASIC TOUR INFORMATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              ধাপ ২ • ট্যুর প্যাকেজ তথ্য
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2" style={{ fontFamily: '"Tiro Bangla", serif' }}>
              ভ্রমণ রুট, সময়সূচি ও মূল্য
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ট্যুরের পুরো শিরোনাম *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: মেঘ ছোঁয়ার সাজেক ভ্যালি ও কংলাক পাহাড়ি অভিযান ৩ রাত ২ দিন"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                প্রধান গন্তব্য
              </label>
              <select
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setDestinationName(e.target.options[e.target.selectedIndex].text);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white cursor-pointer"
              >
                <option value="sajek">সাজেক ভ্যালি</option>
                <option value="coxsbazar">কক্সবাজার সমুদ্র সৈকত</option>
                <option value="sundarban">সুন্দরবন ম্যানগ্রোভ</option>
                <option value="bandarban">বান্দরবান পাহাড়ি অঞ্চল</option>
                <option value="sreemangal">শ্রীমঙ্গল চা বাগান</option>
                <option value="tanguar">টাঙ্গুয়ার হাওর</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ভ্রমণ রুট বিবরণ *
              </label>
              <input
                type="text"
                required
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="ঢাকা → খাগড়াছড়ি → সাজেক → কংলাক"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                যাত্রার তারিখ
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ট্যুরের সময়কাল
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="৩ রাত ২ দিন"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                জনপ্রতি প্যাকেজ মূল্য (৳) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                বাসের বিবরণ ও কোম্পানি
              </label>
              <input
                type="text"
                value={busName}
                onChange={(e) => setBusName(e.target.value)}
                placeholder="শ্যামলী এন.আর / শান্তি পরিবহন"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>
          </div>
        </div>

        {/* STEP 3 (ONLY FOR COMBINE TOUR): PARTNER GROUPS & SEAT ALLOCATION */}
        {tourType === 'combine' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  ধাপ ৩ • বাসের সিট বণ্টন (Seat Allocation)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                  পার্টনার গ্রুপ ও বাসের সিট কোটা নির্ধারণ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  কোন গ্রুপ বাসের কোন কোন সিট পাবে তা এখান থেকে ভাগ করে দিন
                </p>
              </div>

              {/* Add Partner Group Dropdown */}
              {partnerGroups.length < 4 && (
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddPartner(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 cursor-pointer shadow-2xs"
                  >
                    <option value="">+ পার্টনার গ্রুপ যুক্ত করুন</option>
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

            {/* Partner Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {partnerGroups.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                  {p.isMain ? (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-semibold">
                      হোস্ট
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(p.id)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer ml-1"
                      title="গ্রুপটি বাদ দিন"
                    >
                      ✕
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

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 ${
              tourType === 'combine'
                ? 'bg-[#C9622B] hover:bg-[#b05221]'
                : 'bg-[#168B5E] hover:bg-[#03251A]'
            }`}
          >
            {isSubmitting ? (
              <span>প্রকাশিত হচ্ছে...</span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>
                  {tourType === 'combine' ? 'যৌথ (Combine) ট্যুর প্রকাশ করুন' : 'একক ট্যুর প্রকাশ করুন'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
