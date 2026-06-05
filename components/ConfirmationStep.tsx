'use client';

import { AppointmentSlot, InquiryAnalysis } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/schedule';

interface Props {
  slot: AppointmentSlot;
  analysis: InquiryAnalysis;
  patientName: string;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ConfirmationStep({ slot, analysis, patientName, onConfirm, onBack }: Props) {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 text-white">
          <p className="text-blue-100 text-sm mb-1">예약 내용 확인</p>
          <h3 className="text-2xl font-bold">{slot.department}</h3>
          <p className="text-blue-200 text-sm mt-1">{slot.doctor}</p>
        </div>

        <div className="divide-y divide-gray-50">
          {[
            { icon: '📅', label: '예약 날짜', value: formatDate(slot.date) },
            { icon: '⏰', label: '예약 시간', value: formatTime(slot.time) },
            { icon: '👤', label: '환자명', value: patientName },
            {
              icon: '🩺',
              label: '주요 증상',
              value: analysis.symptoms.slice(0, 2).join(', ') || '기재 없음',
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                {icon}
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 leading-relaxed">
          📌 예약 시간 10분 전 접수처에 방문해 주세요. 처음 방문이시라면 신분증을 지참해 주세요.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
        >
          ← 다른 시간
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          예약 확정
        </button>
      </div>
    </div>
  );
}
