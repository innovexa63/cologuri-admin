import { useState, useMemo } from 'react';
import {
  X, Lock, Unlock, Save, ShieldAlert, Sparkles,
  MapPin, Calendar, Bus, Tag, DollarSign, Info, CheckCircle
} from 'lucide-react';

export default function EditTourModal({ tour, currentUser, isOpen, onClose, onSave }) {
  if (!isOpen || !tour) return null;

  const currentGroupId = currentUser?.id || 'tg1';
  const currentGroupName = currentUser?.name || 'ঘুরি বাংলাদেশ';

  const creatorId = tour.creatorGroupId || tour.operator?.id || 'tg1';
  const creatorName = tour.creatorGroupName || tour.operator?.name || 'ঘুরি বাংলাদেশ';

  const isCreator = currentGroupId === creatorId || currentGroupName === creatorName;

  // Find partner record for the current group if any
  const myPartner = useMemo(() => {
    return (tour.partnerGroups || []).find(
      (p) => p.groupId === currentGroupId || p.groupName === currentGroupName
    );
  }, [tour, currentGroupId, currentGroupName]);

  // Form states
  // If creator: uses tour's top-level title, else partner's customTitle or tour.title
  const [title, setTitle] = useState(
    isCreator ? tour.title : (myPartner?.customTitle || tour.title || '')
  );
  const [route, setRoute] = useState(tour.route || '');
  const [destination, setDestination] = useState(tour.destination || '');
  const [destinationName, setDestinationName] = useState(tour.destinationName || '');
  const [startDate, setStartDate] = useState(tour.startDate || '');
  const [duration, setDuration] = useState(tour.duration || '');
  const [busName, setBusName] = useState(tour.busInfo?.busName || '');
  const [busType, setBusType] = useState(tour.busInfo?.busType || '');

  // Pricing
  const [price, setPrice] = useState(
    isCreator ? tour.price || tour.pricePerPerson || 4800 : (myPartner?.price || tour.price || 4800)
  );
  const [originalPrice, setOriginalPrice] = useState(
    isCreator ? (tour.originalPrice || 5500) : (myPartner?.originalPrice || 5200)
  );
  const [discount, setDiscount] = useState(
    isCreator ? (tour.discount || 700) : (myPartner?.discount || 400)
  );

  const [specialNotes, setSpecialNotes] = useState(myPartner?.specialNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let updatedTour = { ...tour };

    if (isCreator) {
      // Creator updates core info and general title/price
      updatedTour = {
        ...updatedTour,
        title: title.trim(),
        route: route.trim(),
        startDate: startDate.trim(),
        duration: duration.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice),
        discount: Number(discount),
        busInfo: {
          ...(updatedTour.busInfo || {}),
          busName: busName.trim(),
          busType: busType.trim(),
        },
        partnerGroups: (updatedTour.partnerGroups || []).map((p) => {
          if (p.groupId === currentGroupId || p.groupName === currentGroupName) {
            return {
              ...p,
              customTitle: title.trim(),
              price: Number(price),
              originalPrice: Number(originalPrice),
              discount: Number(discount),
            };
          }
          return p;
        }),
      };
    } else {
      // Partner group admin updates only their customized fields:
      // Title, Price, Discount, and Special Notes
      const updatedPartners = (updatedTour.partnerGroups || []).map((p) => {
        if (p.groupId === currentGroupId || p.groupName === currentGroupName) {
          return {
            ...p,
            customTitle: title.trim(),
            price: Number(price),
            originalPrice: Number(originalPrice),
            discount: Number(discount),
            specialNotes: specialNotes.trim(),
          };
        }
        return p;
      });

      updatedTour = {
        ...updatedTour,
        partnerGroups: updatedPartners,
      };
    }

    // Attempt to notify server
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      await fetch(`${serverUrl}/api/tours/${tour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestGroupId: currentGroupId,
          title: title.trim(),
          customTitle: title.trim(),
          price: Number(price),
          originalPrice: Number(originalPrice),
          discount: Number(discount),
          route: isCreator ? route.trim() : undefined,
          startDate: isCreator ? startDate.trim() : undefined,
          duration: isCreator ? duration.trim() : undefined,
          busInfo: isCreator ? { busName: busName.trim(), busType: busType.trim() } : undefined,
        }),
      });
    } catch (e) {
      // offline fallback
    }

    setSuccessNotice(true);
    setTimeout(() => {
      setIsSaving(false);
      onSave(updatedTour);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#03251A] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                ট্যুর প্যাকেজ সম্পাদনা
              </h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isCreator
                    ? 'bg-amber-400 text-amber-950 flex items-center gap-1'
                    : 'bg-emerald-800 text-emerald-200 border border-emerald-500/40 flex items-center gap-1'
                }`}
              >
                {isCreator ? (
                  <>
                    <Unlock size={11} />
                    <span>মূল ক্রিয়েটর মোড</span>
                  </>
                ) : (
                  <>
                    <Lock size={11} />
                    <span>পার্টনার গ্রুপ এডিট মোড</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              অপারেটর: <strong className="text-white">{currentGroupName}</strong> ({currentGroupId})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Permission Information Banner */}
        <div className="px-6 pt-5">
          {isCreator ? (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
              <Unlock size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>আপনি এই যৌথ ট্যুরের মূল ক্রিয়েটর:</strong> আপনি রুট, যাত্রার তারিখ, বাসের তথ্য,
                মূল প্যাকেজ মূল্য এবং পার্টনার কোটা বিন্যাস সহ সকল তথ্য সংশোধন করতে পারেন।
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-950">
              <ShieldAlert size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>পার্টনার গ্রুপ এডিট পলিসি:</strong> এই ট্যুরটি মূল হোস্ট (<strong>{creatorName}</strong>)
                কর্তৃক তৈরি হয়েছে। সম্মিলিত পরিবহন সুরক্ষার স্বার্থে <strong>রুট, যাত্রার তারিখ এবং বাস ও সিট সিস্টেম</strong> লক
                করা আছে। তবে আপনি আপনার গ্রুপের ভ্রমণকারীদের জন্য <strong>নিজস্ব টাইটেল, মূল্য ও ডিসকাউন্ট</strong> স্বাধীনভাবে পরিবর্তন করতে পারবেন।
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          {/* Editable: Tour Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>
                {isCreator ? 'ট্যুর প্যাকেজ শিরোনাম (Main Title)' : 'আপনার গ্রুপের জন্য কাস্টম শিরোনাম (Custom Title)'}
              </span>
              <span className="text-[11px] font-normal text-emerald-700">
                {isCreator ? 'সবার জন্য প্রযোজ্য' : 'ক্লায়েন্ট সাইটে আপনার নামে প্রদর্শিত হবে'}
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              placeholder="ট্যুর শিরোনাম লিখুন..."
            />
          </div>

          {/* Pricing & Discount Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign size={13} className="text-emerald-700" />
                <span>প্যাকেজ মূল্য (৳)</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Tag size={13} className="text-amber-700" />
                <span>ডিসকাউন্ট (৳)</span>
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span>নিয়মিত / পূর্বমূল্য (৳)</span>
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Core Locked Fields (Only editable by creator) */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                রুট ও লজিস্টিকস তথ্য
              </span>
              {!isCreator && (
                <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Lock size={11} />
                  <span>ক্রিয়েটর দ্বারা সুরক্ষিত (লকড)</span>
                </span>
              )}
            </div>

            {/* Route */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin size={13} className={isCreator ? 'text-emerald-700' : 'text-slate-400'} />
                <span>ভ্রমণ রুট</span>
                {!isCreator && <span className="text-[10px] text-slate-400">(শুধুমাত্র ক্রিয়েটর পরিবর্তন করতে পারবেন)</span>}
              </label>
              <input
                type="text"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                disabled={!isCreator}
                className={`w-full text-xs rounded-xl px-3 py-2 border transition-all ${
                  isCreator
                    ? 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-700'
                    : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed font-medium'
                }`}
              />
            </div>

            {/* Date & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar size={13} className={isCreator ? 'text-emerald-700' : 'text-slate-400'} />
                  <span>যাত্রার তারিখ</span>
                  {!isCreator && <Lock size={10} className="text-slate-400" />}
                </label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={!isCreator}
                  className={`w-full text-xs rounded-xl px-3 py-2 border transition-all ${
                    isCreator
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <span>ট্যুরের স্থায়িত্ব</span>
                  {!isCreator && <Lock size={10} className="inline ml-1 text-slate-400" />}
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={!isCreator}
                  className={`w-full text-xs rounded-xl px-3 py-2 border transition-all ${
                    isCreator
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Bus Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Bus size={13} className={isCreator ? 'text-emerald-700' : 'text-slate-400'} />
                  <span>বাসের নাম / অপারেটর</span>
                  {!isCreator && <Lock size={10} className="text-slate-400" />}
                </label>
                <input
                  type="text"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  disabled={!isCreator}
                  className={`w-full text-xs rounded-xl px-3 py-2 border transition-all ${
                    isCreator
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  <span>বাসের মডেল ও টাইপ</span>
                  {!isCreator && <Lock size={10} className="inline ml-1 text-slate-400" />}
                </label>
                <input
                  type="text"
                  value={busType}
                  onChange={(e) => setBusType(e.target.value)}
                  disabled={!isCreator}
                  className={`w-full text-xs rounded-xl px-3 py-2 border transition-all ${
                    isCreator
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Seat System Allocation Status */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>
                  <strong>সিট সিস্টেম বিন্যাস:</strong> {tour.totalSeats || 40}টি মোট সিট ({tour.partnerGroups?.length || 2}টি গ্রুপে বণ্টিত)
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                {isCreator ? 'সিট মনিটর থেকে পরিবর্তনযোগ্য' : '🔒 লকড (ক্রিয়েটর দ্বারা নির্ধারিত)'}
              </span>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#168B5E] hover:bg-[#03251A] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {successNotice ? (
                <>
                  <CheckCircle size={15} />
                  <span>সংরক্ষিত হয়েছে!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
