import { useState, useMemo } from 'react';
import {
  Users, ArrowRightLeft, ShieldCheck, Bus, RefreshCw, CheckCircle,
  AlertCircle, History, Sparkles, Filter, ChevronDown, Check, Send, X
} from 'lucide-react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default function CentralSeatMonitor({
  tours = [],
  currentGroup,
  onSeatTransferred,
}) {
  // Find all combine/joint tours
  const combineTours = useMemo(() => {
    return tours.filter((t) => t.isJointTour || t.tourType === 'combine');
  }, [tours]);

  const [selectedTourId, setSelectedTourId] = useState(combineTours[0]?.id || 'tp1');
  const activeTour = combineTours.find((t) => t.id === selectedTourId) || combineTours[0];

  // Filters for the matrix
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'myGroup' | 'unsold' | 'transferred'

  // Inline Seat Transfer State
  const [selectedSeatsToTransfer, setSelectedSeatsToTransfer] = useState([]);
  const [targetPartnerId, setTargetPartnerId] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null); // { type: 'success'|'error', text: '' }

  // Fallback partner groups if tour doesn't have it explicitly
  const partnerGroups = activeTour?.partnerGroups || [
    {
      groupId: 'tg1',
      groupName: 'ঘুরি বাংলাদেশ',
      color: '#166B47',
      allocatedSeats: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2', 'E3'],
    },
    {
      groupId: 'tg2',
      groupName: 'সবুজ পথিক',
      color: '#C9622B',
      allocatedSeats: ['E4', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', 'G4', 'H1', 'H2', 'H3', 'H4', 'I1', 'I2', 'I3', 'I4', 'J1', 'J2', 'J3', 'J4'],
    },
  ];

  // Booked seats
  const bookedSeats = (activeTour?.busInfo?.bookedSeats) || [
    'A1', 'A2', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2',
    'F1', 'F2', 'F3', 'G1', 'G2', 'H1', 'H2', 'H3', 'H4', 'I1', 'I2', 'I3', 'I4', 'J1', 'J2', 'J3', 'J4',
  ];

  const seatTransfers = activeTour?.seatTransfers || [
    {
      seatNo: 'E4',
      fromGroupName: 'ঘুরি বাংলাদেশ',
      toGroupName: 'সবুজ পথিক',
      transferredAt: '২০২৬-১০-২০ দুপুর ০২:৩০',
      note: 'সবুজ পথিকের অতিরিক্ত চাহিদার কারণে ১টি সিট রেফার করা হয়েছে।',
    },
  ];

  // Determine current group ID (default to tg1 if unknown)
  const currentGroupId = currentGroup?.id || 'tg1';
  const currentGroupName = currentGroup?.name || 'ঘুরি বাংলাদেশ';

  const myGroupPartner = partnerGroups.find(
    (p) => p.groupId === currentGroupId || p.groupName === currentGroupName
  ) || partnerGroups[0];

  // My unsold seats that can be transferred
  const myAllocatedSeats = myGroupPartner?.allocatedSeats || [];
  const myUnsoldSeats = myAllocatedSeats.filter((seat) => !bookedSeats.includes(seat));

  // Toggle seat for transfer
  const toggleSeatForTransfer = (seatNo) => {
    // Only allow selecting unsold seats belonging to current group
    if (!myUnsoldSeats.includes(seatNo)) return;

    if (selectedSeatsToTransfer.includes(seatNo)) {
      setSelectedSeatsToTransfer(selectedSeatsToTransfer.filter((s) => s !== seatNo));
    } else {
      setSelectedSeatsToTransfer([...selectedSeatsToTransfer, seatNo]);
    }
  };

  // Execute Transfer Inline (No popup modal!)
  const handleExecuteTransfer = async (e) => {
    e.preventDefault();
    if (selectedSeatsToTransfer.length === 0) {
      setFeedbackMsg({ type: 'error', text: 'অনুগ্রহ করে অন্তত একটি অবিক্রিত সিট নির্বাচন করুন।' });
      return;
    }
    if (!targetPartnerId) {
      setFeedbackMsg({ type: 'error', text: 'অনুগ্রহ করে প্রাপক পার্টনার গ্রুপ নির্বাচন করুন।' });
      return;
    }

    const targetGroup = partnerGroups.find((p) => p.groupId === targetPartnerId);
    if (!targetGroup) return;

    setIsTransferring(true);
    setFeedbackMsg(null);

    const newTransferRecord = {
      seatNumbers: selectedSeatsToTransfer,
      fromGroupId: myGroupPartner.groupId,
      fromGroupName: myGroupPartner.groupName,
      toGroupId: targetGroup.groupId,
      toGroupName: targetGroup.groupName,
      note: transferNote.trim() || 'অবিক্রিত সিট রেফারাল ট্রান্সফার',
      transferredAt: new Date().toLocaleString('bn-BD'),
    };

    // Call server API if possible
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    try {
      await fetch(`${serverUrl}/api/tours/${activeTour.id}/transfer-seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatNumbers: selectedSeatsToTransfer,
          fromGroupId: myGroupPartner.groupId,
          fromGroupName: myGroupPartner.groupName,
          toGroupId: targetGroup.groupId,
          toGroupName: targetGroup.groupName,
          note: transferNote,
        }),
      });
    } catch (e) {
      // offline fallback
    }

    // Call callback to parent dashboard
    if (onSeatTransferred) {
      onSeatTransferred({
        tourId: activeTour.id,
        seats: selectedSeatsToTransfer,
        fromGroupId: myGroupPartner.groupId,
        toGroupId: targetGroup.groupId,
        record: newTransferRecord,
      });
    }

    setIsTransferring(false);
    const transferredSeatsList = [...selectedSeatsToTransfer];
    setSelectedSeatsToTransfer([]);
    setTransferNote('');
    setFeedbackMsg({
      type: 'success',
      text: `✓ সিট (${transferredSeatsList.join(', ')}) সফলভাবে "${targetGroup.groupName}"-এর কাছে হস্তান্তর করা হয়েছে!`,
    });
  };

  // Group Breakdown stats
  const groupStats = partnerGroups.map((group) => {
    const allocated = group.allocatedSeats || [];
    const sold = allocated.filter((s) => bookedSeats.includes(s)).length;
    const unsold = allocated.length - sold;
    const pct = allocated.length > 0 ? Math.round((sold / allocated.length) * 100) : 0;
    return {
      ...group,
      totalAllocated: allocated.length,
      sold,
      unsold,
      occupancy: pct,
    };
  });

  const totalSeats = activeTour?.totalSeats || 40;
  const totalSold = bookedSeats.length;
  const totalUnsold = totalSeats - totalSold;
  const overallOccupancy = Math.round((totalSold / totalSeats) * 100);

  if (!activeTour) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <Users size={40} className="mx-auto text-slate-400 mb-3" />
        <h3 className="text-lg font-bold text-slate-800">কোনো যৌথ (Combine) ট্যুর নেই</h3>
        <p className="text-xs text-slate-500 mt-1">
          বামের "নতুন ট্যুর তৈরি" মেনু থেকে "Combine Tour" অপশনটি বেছে নিয়ে প্রথম যৌথ ট্যুর শুরু করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Tour Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              🤝 সেন্ট্রাল ভিজিবিলিটি
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {activeTour.route}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
            যৌথ মনিটরিং ও লাইভ সিট ভিজিবিলিটি
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            সব পার্টনার গ্রুপ রিয়েল-টাইমে একসাথে দেখতে পাচ্ছে সামগ্রিক বাসের সিট স্ট্যাটাস ও বিক্রির হিসেব
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-slate-500 hidden sm:inline">ট্যুর নির্বাচন:</label>
          <select
            value={selectedTourId}
            onChange={(e) => {
              setSelectedTourId(e.target.value);
              setSelectedSeatsToTransfer([]);
              setFeedbackMsg(null);
            }}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 cursor-pointer shadow-2xs pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            {combineTours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.startDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards: Central Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500 mb-1">মোট বাসের সিট</p>
          <p className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
            {totalSeats}টি
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{partnerGroups.length}টি পার্টনার গ্রুপে বণ্টিত</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500 mb-1">সামগ্রিক বুকড / বিক্রি</p>
          <p className="text-2xl font-extrabold text-emerald-700" style={{ fontFamily: '"Tiro Bangla", serif' }}>
            {totalSold}টি ({overallOccupancy}%)
          </p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${overallOccupancy}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500 mb-1">অবিক্রিত / খালি সিট</p>
          <p className="text-2xl font-extrabold text-amber-700" style={{ fontFamily: '"Tiro Bangla", serif' }}>
            {totalUnsold}টি
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">সব গ্রুপ মিলিয়ে অবশিষ্ট</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500 mb-1">সিট ট্রান্সফার রেকর্ড</p>
          <p className="text-2xl font-extrabold text-blue-700" style={{ fontFamily: '"Tiro Bangla", serif' }}>
            {seatTransfers.length}টি
          </p>
          <p className="text-[11px] text-blue-600 mt-0.5">গ্রুপগুলোর মাঝে সফল হ্যান্ডওভার</p>
        </div>
      </div>

      {/* Partner Groups Quota Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupStats.map((group) => {
          const isMyGroup = group.groupId === currentGroupId || group.groupName === currentGroupName;

          return (
            <div
              key={group.groupId}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                isMyGroup ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full shadow-2xs shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{group.groupName}</h4>
                      {isMyGroup && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          আপনার গ্রুপ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      কোটা বরাদ্দ: {group.totalAllocated}টি সিট ({Math.round((group.totalAllocated / totalSeats) * 100)}%)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                    {group.sold}/{group.totalAllocated}
                  </span>
                  <p className="text-[10px] font-bold text-emerald-700">{group.occupancy}% বিক্রি</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${group.occupancy}%`, backgroundColor: group.color }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span>বিক্রিত: <strong className="text-slate-900">{group.sold}</strong></span>
                <span>অবিক্রিত (খালি): <strong className="text-amber-700">{group.unsold}টি</strong></span>
                {isMyGroup && group.unsold > 0 && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    নিচের প্যানেল থেকে ট্রান্সফারযোগ্য
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: BUS MATRIX (LEFT) + INLINE SEAT TRANSFER PANEL (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Central Interactive Bus Layout Matrix */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                <Bus size={18} className="text-emerald-700" />
                <span>সেন্ট্রাল বাস সিট ম্যাট্রিক্স</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                আপনার অবিক্রিত সিটে ক্লিক করে সরাসরি ট্রান্সফারের জন্য নির্বাচন করতে পারেন
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `সব (${totalSeats})` },
                { id: 'myGroup', label: `আমার (${myAllocatedSeats.length})` },
                { id: 'unsold', label: `খালি (${totalUnsold})` },
                { id: 'transferred', label: `ট্রান্সফার্ড (${seatTransfers.length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterMode(f.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    filterMode === f.id
                      ? 'bg-[#03251A] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700">
            {partnerGroups.map((g) => (
              <div key={g.groupId} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md" style={{ backgroundColor: g.color }} />
                <span className="font-semibold">{g.groupName}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300">
              <span className="w-3 h-3 rounded-md bg-slate-800 text-white text-[8px] flex items-center justify-center font-bold">✓</span>
              <span>বিক্রি</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-white border border-slate-300 flex items-center justify-center text-[8px] text-slate-400">○</span>
              <span>খালি</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-100 text-amber-800 text-[9px] flex items-center justify-center font-bold">🔄</span>
              <span>রেফার্ড</span>
            </div>
          </div>

          {/* Bus Seat Grid */}
          <div className="max-w-[390px] mx-auto bg-[#FAFCFA] rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-xs">
            {/* Front Header: Door (Left) & Driver with Steering Wheel (Right) */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-dashed border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {/* Door on Left */}
              <div className="flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[10px]">
                <span>🚪 দরজা</span>
              </div>

              <span>সামনের দিক (Front)</span>

              {/* Driver on Right with Steering Wheel Symbol */}
              <div className="flex items-center gap-1.5 text-slate-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-md text-[10px]" title="ড্রাইভার সিট (ডান পাশ)">
                <span className="font-bold text-emerald-950">ড্রাইভার</span>
                <svg className="w-4 h-4 text-emerald-800 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Steering wheel">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="2.5" />
                  <line x1="12" y1="2" x2="12" y2="9.5" />
                  <line x1="2.5" y1="14" x2="9.8" y2="13" />
                  <line x1="21.5" y1="14" x2="14.2" y2="13" />
                </svg>
              </div>
            </div>

            {/* Seat Rows A to J */}
            <div className="space-y-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center justify-between gap-1 sm:gap-1.5">
                  {/* Left 2 seats */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2].map((num) => {
                      const seatNo = `${row}${num}`;
                      const isSold = bookedSeats.includes(seatNo);
                      const ownerGroup = partnerGroups.find((g) => (g.allocatedSeats || []).includes(seatNo));
                      const isMySeat = ownerGroup?.groupId === myGroupPartner.groupId;
                      const transferRecord = seatTransfers.find((t) => t.seatNo === seatNo || (Array.isArray(t.seatNumbers) && t.seatNumbers.includes(seatNo)));
                      const isTransferred = Boolean(transferRecord);
                      const isSelectedForTransfer = selectedSeatsToTransfer.includes(seatNo);

                      // Filter logic
                      if (filterMode === 'myGroup' && !isMySeat) {
                        return <div key={seatNo} className="w-8 h-8 sm:w-9 sm:h-9 opacity-15 bg-slate-100 rounded-lg" />;
                      }
                      if (filterMode === 'unsold' && isSold) {
                        return <div key={seatNo} className="w-8 h-8 sm:w-9 sm:h-9 opacity-15 bg-slate-100 rounded-lg" />;
                      }
                      if (filterMode === 'transferred' && !isTransferred) {
                        return <div key={seatNo} className="w-8 h-8 sm:w-9 sm:h-9 opacity-15 bg-slate-100 rounded-lg" />;
                      }

                      const canTransferThis = isMySeat && !isSold;

                      return (
                        <div
                          key={seatNo}
                          onClick={() => canTransferThis && toggleSeatForTransfer(seatNo)}
                          title={`সিট ${seatNo} | ${ownerGroup?.groupName || 'অনির্ধারিত'} | ${isSold ? 'বিক্রি হয়েছে' : 'খালি আছে'}${canTransferThis ? ' (ক্লিক করে ট্রান্সফার নির্বাচন করুন)' : ''}`}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all relative select-none ${
                            canTransferThis ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                          } ${
                            isSelectedForTransfer
                              ? 'ring-2 ring-orange-500 bg-orange-500 text-white shadow-xs'
                              : isSold
                              ? 'text-white shadow-2xs'
                              : 'bg-white border-2 text-slate-800'
                          }`}
                          style={{
                            backgroundColor: isSelectedForTransfer
                              ? '#C9622B'
                              : isSold
                              ? ownerGroup?.color || '#03251A'
                              : '#FFFFFF',
                            borderColor: isSelectedForTransfer
                              ? '#C9622B'
                              : ownerGroup?.color || '#CBD5E1',
                          }}
                        >
                          <span className="leading-none text-[10px]">{seatNo}</span>
                          {isSelectedForTransfer ? (
                            <span className="text-[7px] leading-none mt-0.5 font-bold">সিলেক্টেড</span>
                          ) : isSold ? (
                            <span className="text-[7px] leading-none mt-0.5 opacity-90">✓</span>
                          ) : (
                            <span className="text-[7px] leading-none mt-0.5 font-bold" style={{ color: ownerGroup?.color }}>
                              খালি
                            </span>
                          )}
                          {isTransferred && !isSelectedForTransfer && (
                            <span
                              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 text-slate-900 rounded-full text-[7px] flex items-center justify-center font-extrabold shadow-2xs"
                              title={`রেফার্ড সিট`}
                            >
                              🔄
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Aisle (Clean spacing, text removed) */}
                  <div className="w-5 sm:w-6 shrink-0" aria-hidden="true" />

                  {/* Right 2 seats */}
                  <div className="flex items-center gap-1.5">
                    {[3, 4].map((num) => {
                      const seatNo = `${row}${num}`;
                      const isSold = bookedSeats.includes(seatNo);
                      const ownerGroup = partnerGroups.find((g) => (g.allocatedSeats || []).includes(seatNo));
                      const isMySeat = ownerGroup?.groupId === myGroupPartner.groupId;
                      const transferRecord = seatTransfers.find((t) => t.seatNo === seatNo || (Array.isArray(t.seatNumbers) && t.seatNumbers.includes(seatNo)));
                      const isTransferred = Boolean(transferRecord);
                      const isSelectedForTransfer = selectedSeatsToTransfer.includes(seatNo);

                      // Filter logic
                      if (filterMode === 'myGroup' && !isMySeat) {
                        return <div key={seatNo} className="w-8 h-8 sm:w-9 sm:h-9 opacity-15 bg-slate-100 rounded-lg" />;
                      }
                      if (filterMode === 'unsold' && isSold) {
                        return <div key={seatNo} className="w-8 h-8 sm:w-9 sm:h-9 opacity-15 bg-slate-100 rounded-lg" />;
                      }
                      if (filterMode === 'transferred' && !isTransferred) {
                        return <div key={seatNo} className="w-8 h-8 sm:w-9 sm:h-9 opacity-15 bg-slate-100 rounded-lg" />;
                      }

                      const canTransferThis = isMySeat && !isSold;

                      return (
                        <div
                          key={seatNo}
                          onClick={() => canTransferThis && toggleSeatForTransfer(seatNo)}
                          title={`সিট ${seatNo} | ${ownerGroup?.groupName || 'অনির্ধারিত'} | ${isSold ? 'বিক্রি হয়েছে' : 'খালি আছে'}${canTransferThis ? ' (ক্লিক করে ট্রান্সফার নির্বাচন করুন)' : ''}`}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all relative select-none ${
                            canTransferThis ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                          } ${
                            isSelectedForTransfer
                              ? 'ring-2 ring-orange-500 bg-orange-500 text-white shadow-xs'
                              : isSold
                              ? 'text-white shadow-2xs'
                              : 'bg-white border-2 text-slate-800'
                          }`}
                          style={{
                            backgroundColor: isSelectedForTransfer
                              ? '#C9622B'
                              : isSold
                              ? ownerGroup?.color || '#03251A'
                              : '#FFFFFF',
                            borderColor: isSelectedForTransfer
                              ? '#C9622B'
                              : ownerGroup?.color || '#CBD5E1',
                          }}
                        >
                          <span className="leading-none text-[10px]">{seatNo}</span>
                          {isSelectedForTransfer ? (
                            <span className="text-[7px] leading-none mt-0.5 font-bold">সিলেক্টেড</span>
                          ) : isSold ? (
                            <span className="text-[7px] leading-none mt-0.5 opacity-90">✓</span>
                          ) : (
                            <span className="text-[7px] leading-none mt-0.5 font-bold" style={{ color: ownerGroup?.color }}>
                              খালি
                            </span>
                          )}
                          {isTransferred && !isSelectedForTransfer && (
                            <span
                              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 text-slate-900 rounded-full text-[7px] flex items-center justify-center font-extrabold shadow-2xs"
                              title={`রেফার্ড সিট`}
                            >
                              🔄
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rear Footer */}
            <div className="mt-3 pt-2 text-center border-t-2 border-dashed border-slate-200 text-[9px] text-slate-400 uppercase font-semibold">
              পেছনের দিক (Rear)
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INLINE LIVE SEAT SHARING & REFERRAL PANEL (NO POPUP!) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-orange-200/90 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#C9622B] flex items-center justify-center shrink-0">
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: '"Tiro Bangla", serif' }}>
                লাইভ সিট ট্রান্সফার ও শেয়ারিং
              </h3>
              <p className="text-[11px] text-slate-500">
                আপনার অবিক্রিত সিট পার্টনার গ্রুপের কাছে স্থানান্তর করুন
              </p>
            </div>
          </div>

          {/* Feedback notification banner */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              <span>{feedbackMsg.text}</span>
              <button
                type="button"
                onClick={() => setFeedbackMsg(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleExecuteTransfer} className="space-y-4">
            {/* Step 1: Select Unsold Seats */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ১. আপনার অবিক্রিত সিট নির্বাচন করুন:
                </label>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {myUnsoldSeats.length}টি সিট খালি আছে
                </span>
              </div>

              {myUnsoldSeats.length === 0 ? (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-center">
                  আপনার কোটার সকল সিট বিক্রি হয়ে গেছে। হস্তান্তরের জন্য কোনো অবিক্রিত সিট নেই।
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                    {myUnsoldSeats.map((seatNo) => {
                      const isSelected = selectedSeatsToTransfer.includes(seatNo);
                      return (
                        <button
                          key={seatNo}
                          type="button"
                          onClick={() => toggleSeatForTransfer(seatNo)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#C9622B] text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <span>{seatNo}</span>
                          {isSelected && <Check size={12} />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    নির্বাচিত সিট: <strong className="text-slate-800">{selectedSeatsToTransfer.length}টি</strong>{' '}
                    {selectedSeatsToTransfer.length > 0 && `(${selectedSeatsToTransfer.join(', ')})`}
                  </p>
                </>
              )}
            </div>

            {/* Step 2: Target Partner */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ২. প্রাপক পার্টনার গ্রুপ বেছে নিন *
              </label>
              <select
                required
                value={targetPartnerId}
                onChange={(e) => setTargetPartnerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white cursor-pointer"
              >
                <option value="">-- পার্টনার গ্রুপ নির্বাচন করুন --</option>
                {partnerGroups
                  .filter((p) => p.groupId !== myGroupPartner.groupId)
                  .map((p) => (
                    <option key={p.groupId} value={p.groupId}>
                      {p.groupName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Step 3: Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ৩. রেফারাল নোট বা বার্তা (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: আমাদের কোটা থেকে ২ সিট আপনাদের অতিরিক্ত চাহিদার জন্য হস্তান্তর করা হলো"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isTransferring || selectedSeatsToTransfer.length === 0 || !targetPartnerId}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#C9622B] hover:bg-[#b05221] disabled:opacity-40 text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isTransferring ? (
                <span>হস্তান্তর সম্পন্ন হচ্ছে...</span>
              ) : (
                <>
                  <Send size={13} />
                  <span>সিট হস্তান্তর নিশ্চিত করুন</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Transfer History Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3 pb-2 border-b border-slate-100" style={{ fontFamily: '"Tiro Bangla", serif' }}>
          <History size={17} className="text-slate-500" />
          <span>সিট শেয়ারিং ও রেফারাল অডিট হিস্ট্রি (Live Transfer Audit Log)</span>
        </h3>

        {seatTransfers.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">এখনও কোনো সিট ট্রান্সফার করা হয়নি।</p>
        ) : (
          <div className="space-y-2.5">
            {seatTransfers.map((tx, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    🔄
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">
                      সিট {Array.isArray(tx.seatNumbers) ? tx.seatNumbers.join(', ') : tx.seatNo}:{' '}
                      <span className="text-emerald-800 font-semibold">{tx.fromGroupName}</span>
                      <span className="text-slate-400 mx-1.5">➔</span>
                      <span className="text-orange-800 font-semibold">{tx.toGroupName}</span>
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{tx.note}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-semibold">{tx.transferredAt}</span>
                  <span className="block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-0.5 border border-emerald-200">
                    সফলভাবে হস্তান্তরিত
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
