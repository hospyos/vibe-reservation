'use client';

import { useState } from 'react';

const SAMPLES = [
  '3일 전부터 두통이 심하고 어지러움증이 있어요',
  '오른쪽 무릎이 계단 오르내릴 때 통증이 있어요',
  '피부에 붉은 발진이 생기고 너무 가려워요',
  '소화가 안 되고 복부 팽만감이 계속됩니다',
  '눈이 충혈되고 눈물이 많이 나요',
];

interface Props {
  onSubmit: (inquiry: string, patientName: string) => void;
  isLoading: boolean;
}

export default function InquiryStep({ onSubmit, isLoading }: Props) {
  const [inquiry, setInquiry] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 mb-5 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">AI 진료 예약 어시스턴트</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              증상을 알려주시면 AI가 적합한 진료과를 찾고 최적의 예약 시간을 제안해드립니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">성함 (선택)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            증상 및 문의 사항 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
            placeholder="증상을 자세히 설명해주세요.&#10;예) 언제부터, 어떤 증상, 어느 부위인지 등"
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium">자주 묻는 증상 예시</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                onClick={() => setInquiry(s)}
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full transition-colors"
              >
                {s.length > 22 ? s.slice(0, 22) + '...' : s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => inquiry.trim() && onSubmit(inquiry.trim(), name.trim() || '환자')}
          disabled={!inquiry.trim() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              분석 중...
            </>
          ) : (
            <>
              AI 분석 시작
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
