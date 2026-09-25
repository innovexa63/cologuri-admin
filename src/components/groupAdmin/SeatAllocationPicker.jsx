import { useState } from 'react';
import { Check, RefreshCw, Sparkles, UserCheck } from 'lucide-react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default function SeatAllocationPicker({
  partnerGroups,
  allocatedMap, // { [seatNo]: groupId }
  onAllocationChange, // (newMap) => void
  totalSeats = 40,
}) {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const activeGroup = partnerGroups[activeGroupIndex] || partnerGroups[0];

  const handleSeatClick = (seatNo) => {
    if (!activeGroup) return;
    const currentOwner = allocatedMap[seatNo];
    const newMap = { ...allocatedMap };

    if (currentOwner === activeGroup.id) {
      // Toggle off
      delete newMap[seatNo];
    } else {
      newMap[seatNo] = activeGroup.id;
    }
    onAllocationChange(newMap);
  };

  // Quick preset: Split evenly
  const handleEqualSplit = () => {
    if (!partnerGroups || partnerGroups.length === 0) return;
    const newMap = {};
    const seatsPerGroup = Math.floor(totalSeats / partnerGroups.length);

    let allSeats = [];
    ROWS.forEach((r) => {
      [1, 2, 3, 4].forEach((n) => allSeats.push(`${r}${n}`));
    });

    partnerGroups.forEach((group, idx) => {
      const start = idx * seatsPerGroup;
      const end = idx === partnerGroups.length - 1 ? allSeats.length : start + seatsPerGroup;
      for (let i = start; i < end; i++) {
        if (allSeats[i]) {
          newMap[allSeats[i]] = group.id;
        }
      }
    });

    onAllocationChange(newMap);
  };

  // Quick preset: Rows A-E to Group 1, Rows F-J to Group 2
  const handleHalfSplit = () => {
    if (!partnerGroups || partnerGroups.length < 2) return;
    const newMap = {};
    ROWS.forEach((r, idx) => {
      const targetGroup = idx < 5 ? partnerGroups[0] : partnerGroups[1];
      [1, 2, 3, 4].forEach((n) => {
        newMap[`${r}${n}`] = targetGroup.id;
      });
    });
    onAllocationChange(newMap);
  };

  const handleClearAll = () => {
    onAllocationChange({});
  };

  // Count allocation per group
  const counts = partnerGroups.reduce((acc, g) => {
    acc[g.id] = Object.values(allocatedMap).filter((id) => id === g.id).length;
    return acc;
  }, {});

  const totalAllocated = Object.keys(allocatedMap).length;
  const unallocated = totalSeats - totalAllocated;

  return (
    <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header and Quick presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5" style={{ fontFamily: '"Tiro Bangla", serif' }}>
            <Sparkles size={16} className="text-amber-500" />
            <span>বাসের সিট বণ্টন (Interactive Seat Allocation)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            নিচে যেকোনো গ্রুপ সিলেক্ট করে বাসের সিটে ক্লিক করুন অথবা প্রিসেট ব্যবহার করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {partnerGroups.length === 2 && (
            <button
              type="button"
              onClick={handleHalfSplit}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              ৫০% - ৫০% ভাগ (সারি A-E / F-J)
            </button>
          )}
          <button
            type="button"
            onClick={handleEqualSplit}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            সমান বণ্টন ({partnerGroups.length} গ্রুপে)
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] font-bold px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
            title="সব সিট ক্লিয়ার করুন"
          >
            <RefreshCw size={12} className="inline mr-1" />
            রিসেট
          </button>
        </div>
      </div>

      {/* Partner Group Selector Palette */}
      <div>
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
          সিট বণ্টনকারী সক্রিয় গ্রুপ নির্বাচন করুন (Palette):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {partnerGroups.map((group, idx) => {
            const isSelected = activeGroupIndex === idx;
            const count = counts[group.id] || 0;
            const pct = Math.round((count / totalSeats) * 100);

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroupIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'ring-2 shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-200'
                }`}
                style={{
                  borderColor: isSelected ? group.color : '#E2E8F0',
                  backgroundColor: isSelected ? `${group.color}15` : '#FFFFFF',
                  outlineColor: isSelected ? group.color : 'transparent',
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: group.color }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{group.name}</p>
                    <p className="text-[10px] text-slate-500">{count}টি সিট বরাদ্দ ({pct}%)</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Allocation Status Indicator Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>বরাদ্দ স্থিতি: {totalAllocated}/{totalSeats} সিট</span>
          {unallocated > 0 ? (
            <span className="text-amber-700 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              ⚠️ {unallocated}টি সিট এখনও অবণ্টিত
            </span>
          ) : (
            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ✓ ১০০% সিট সফলভাবে বণ্টিত
            </span>
          )}
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {partnerGroups.map((g) => {
            const count = counts[g.id] || 0;
            const pct = (count / totalSeats) * 100;
            return (
              <div
                key={g.id}
                title={`${g.name}: ${count}টি সিট`}
                style={{ width: `${pct}%`, backgroundColor: g.color }}
                className="h-full transition-all duration-300"
              />
            );
          })}
        </div>
      </div>

      {/* Bus Seat Layout Matrix (10 rows x 4 seats) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 max-w-[420px] mx-auto shadow-2xs">
        {/* Bus Front: Door (Left) & Driver with Steering Wheel (Right) */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-dashed border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {/* Door on Left */}
          <div className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md text-[10px] border border-amber-200 flex items-center gap-1">
            <span>🚪 দরজা</span>
          </div>

          <span>সামনের দিক (Front)</span>

          {/* Driver on Right with Steering Wheel Symbol */}
          <div className="flex items-center gap-1.5 text-slate-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md text-[10px]" title="ড্রাইভার সিট (ডান পাশ)">
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

        {/* Rows */}
        <div className="space-y-2">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center justify-between gap-1 sm:gap-2">
              {/* Left 2 seats */}
              <div className="flex items-center gap-1.5">
                {[1, 2].map((num) => {
                  const seatNo = `${row}${num}`;
                  const ownerId = allocatedMap[seatNo];
                  const ownerGroup = partnerGroups.find((g) => g.id === ownerId);

                  return (
                    <button
                      key={seatNo}
                      type="button"
                      onClick={() => handleSeatClick(seatNo)}
                      title={ownerGroup ? `${seatNo}: ${ownerGroup.name} এর জন্য বরাদ্দ` : `${seatNo}: এখনও কাউকে বরাদ্দ করা হয়নি`}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer shadow-2xs ${
                        ownerGroup
                          ? 'text-white scale-100 font-extrabold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                      }`}
                      style={{
                        backgroundColor: ownerGroup ? ownerGroup.color : undefined,
                        borderColor: ownerGroup ? ownerGroup.color : undefined,
                      }}
                    >
                      <span className="leading-none text-[11px]">{seatNo}</span>
                      {ownerGroup && (
                        <span className="text-[7px] opacity-90 leading-none mt-0.5 truncate max-w-[28px]">
                          {ownerGroup.name.slice(0, 3)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Aisle (Clean spacing, text removed) */}
              <div className="w-5 sm:w-6 shrink-0" aria-hidden="true" />

              {/* Right 2 seats */}
              <div className="flex items-center gap-1.5">
                {[3, 4].map((num) => {
                  const seatNo = `${row}${num}`;
                  const ownerId = allocatedMap[seatNo];
                  const ownerGroup = partnerGroups.find((g) => g.id === ownerId);

                  return (
                    <button
                      key={seatNo}
                      type="button"
                      onClick={() => handleSeatClick(seatNo)}
                      title={ownerGroup ? `${seatNo}: ${ownerGroup.name} এর জন্য বরাদ্দ` : `${seatNo}: এখনও কাউকে বরাদ্দ করা হয়নি`}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer shadow-2xs ${
                        ownerGroup
                          ? 'text-white scale-100 font-extrabold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                      }`}
                      style={{
                        backgroundColor: ownerGroup ? ownerGroup.color : undefined,
                        borderColor: ownerGroup ? ownerGroup.color : undefined,
                      }}
                    >
                      <span className="leading-none text-[11px]">{seatNo}</span>
                      {ownerGroup && (
                        <span className="text-[7px] opacity-90 leading-none mt-0.5 truncate max-w-[28px]">
                          {ownerGroup.name.slice(0, 3)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bus Rear */}
        <div className="mt-3 pt-2 text-center border-t-2 border-dashed border-slate-200 text-[10px] text-slate-400 uppercase font-semibold">
          পেছনের দিক (Rear)
        </div>
      </div>
    </div>
  );
}
