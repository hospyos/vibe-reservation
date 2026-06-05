'use client';

import { useState } from 'react';
import { AppointmentSlot, InquiryAnalysis, SlotSuggestion } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/schedule';

interface Props {
  analysis: InquiryAnalysis;
  slots: AppointmentSlot[];
  suggestion: SlotSuggestion | null;
  isLoadingSuggestion: boolean;
  onSelect: (slot: AppointmentSlot) => void;
  onBack: () => void;
}

export default function SlotsStep({ analysis, slots, suggestion, isLoadingSuggestion, onSelect, onBack }: Props) {
  const [filterDate, setFilterDate] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');

  const dates = Array.from(new Set(slots.map((s) => s.date))).sort();
  const doctors = Array.from(new Set(slots.map((s) => s.doctor)));

  const filtered = slots.filter(
    (s) =>
      (filterDate === 'all' || s.date === filterDate) &&
      (filterDoctor === 'all' || s.doctor === filterDoctor),
  );

  const byDate = dates
    .filter((d) => filterDate === 'all' || d === filterDate)
    .reduce<Record<string, AppointmentSlot[]>>((acc, date) => {
      acc[date] = filtered.filter((s) => s.date === date);
      return acc;
    }, {});

  const recommendedSlot =
    suggestion && slots.find((s) => s.id === suggestion.recommendedSlotId && s.available);

  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-blue-700 font-bold">{analysis.department[0]}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{analysis.department}</p>
            <p className="text-xs text-gray-400">가용 슬롯 {availableCount}개</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 다시 분석
        </button>
      </div>

      {/* AI Suggestion */}
      {isLoadingSuggestion && (
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl border border-blue-100 p-4 flex items-center gap-3">
          <svg className="animate-spin w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-blue-700 font-medium">AI가 최적의 예약 시간을 찾고 있습니다...</p>
        </div>
      )}

      {recommendedSlot && !isLoadingSuggestion && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
              🤖
            </div>
            <div>
              <p className="font-bold mb-1">AI 추천 예약</p>
              <p className="text-blue-100 text-sm leading-relaxed">{suggestion!.message}</p>
            </div>
          </div>
          <div className="bg-white/15 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg">
                {formatDate(recommendedSlot.date)} {formatTime(recommendedSlot.time)}
              </p>
              <p className="text-blue-200 text-sm mt-0.5">{recommendedSlot.doctor}</p>
              <p className="text-blue-300 text-xs mt-1">{suggestion!.reasoning}</p>
            </div>
            <button
              onClick={() => onSelect(recommendedSlot)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl transition-colors flex-shrink-0 text-sm"
            >
              이 시간으로 예약
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[130px]">
            <label className="text-xs text-gray-400 block mb-1 font-medium">날짜 선택</label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">전체 날짜</option>
              {dates.map((d) => (
                <option key={d} value={d}>{formatDate(d)}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[130px]">
            <label className="text-xs text-gray-400 block mb-1 font-medium">의사 선택</label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">전체 의사</option>
              {doctors.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Slots by date */}
      <div className="space-y-3">
        {Object.entries(byDate).map(([date, dateSlots]) => {
          const doctorGroups = doctors
            .filter((doc) => filterDoctor === 'all' || doc === filterDoctor)
            .map((doc) => ({ doc, slots: dateSlots.filter((s) => s.doctor === doc) }))
            .filter((g) => g.slots.length > 0);

          if (doctorGroups.length === 0) return null;

          return (
            <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <p className="font-semibold text-gray-700 text-sm">{formatDate(date)}</p>
              </div>
              <div className="p-4 space-y-4">
                {doctorGroups.map(({ doc, slots: docSlots }) => (
                  <div key={doc}>
                    <p className="text-xs text-gray-400 font-medium mb-2">{doc}</p>
                    <div className="flex flex-wrap gap-2">
                      {docSlots.map((slot) => {
                        const isRec = slot.id === suggestion?.recommendedSlotId;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && onSelect(slot)}
                            disabled={!slot.available}
                            title={!slot.available ? '예약 불가' : isRec ? 'AI 추천' : ''}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                              !slot.available
                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                : isRec
                                ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 ring-offset-1 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                            }`}
                          >
                            {formatTime(slot.time)}
                            {isRec && slot.available && <span className="ml-1">⭐</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-gray-200 bg-white" />
          예약 가능
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-600" />
          AI 추천
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100" />
          예약 불가
        </div>
      </div>
    </div>
  );
}
