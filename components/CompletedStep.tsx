'use client';

import { AppointmentSlot } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/schedule';

interface Props {
  slot: AppointmentSlot;
  patientName: string;
  bookingNumber?: string;
  onReset: () => void;
}

export default function CompletedStep({ slot, patientName, bookingNumber, onReset }: Props) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800">예약이 완료되었습니다!</h2>
        <p className="text-gray-500 mt-2">
          {patientName}님의 진료 예약이 성공적으로 접수되었습니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white">
          <p className="text-emerald-100 text-xs mb-0.5">예약 번호</p>
          <p className="text-2xl font-mono font-bold">#{bookingNumber ?? '------'}</p>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: '진료과', value: slot.department },
            { label: '담당의', value: slot.doctor },
            { label: '예약 날짜', value: formatDate(slot.date) },
            { label: '예약 시간', value: formatTime(slot.time) },
            { label: '환자명', value: patientName },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{label}</span>
              <span className="font-semibold text-gray-800 text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-left">
        <p className="font-semibold text-blue-800 mb-2">📱 내원 안내</p>
        <ul className="space-y-1 text-blue-700 text-sm">
          <li>• 예약 시간 10분 전 내원해 주세요</li>
          <li>• 초진의 경우 신분증을 지참해 주세요</li>
          <li>• 예약 변경·취소는 전화로 문의해 주세요</li>
        </ul>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
      >
        새 예약 만들기
      </button>
    </div>
  );
}
