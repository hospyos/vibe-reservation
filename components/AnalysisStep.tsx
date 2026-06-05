'use client';

import { InquiryAnalysis } from '@/lib/types';

const URGENCY = {
  high: { label: '긴급', bg: 'bg-red-50 border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  medium: { label: '보통', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  low: { label: '경미', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

interface Props {
  inquiry: string;
  analysis: InquiryAnalysis | null;
  isLoading: boolean;
  onContinue: () => void;
  onBack: () => void;
}

export default function AnalysisStep({ inquiry, analysis, isLoading, onContinue, onBack }: Props) {
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI가 문의를 분석하고 있습니다</h3>
          <p className="text-gray-400 text-sm">증상 파악 및 적합한 진료과를 찾는 중...</p>

          <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left">
            <p className="text-xs text-gray-400 mb-1">접수된 문의</p>
            <p className="text-sm text-gray-700 leading-relaxed">{inquiry}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const u = URGENCY[analysis.urgency];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-semibold text-gray-800">AI 분석 완료</span>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-800 leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">추천 진료과</p>
            <p className="text-xl font-bold text-gray-800">{analysis.department}</p>
          </div>
          <div className={`rounded-xl p-4 border ${u.bg}`}>
            <p className={`text-xs mb-1 ${u.text} opacity-70`}>긴급도</p>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${u.dot}`} />
              <span className={`text-lg font-bold ${u.text}`}>{u.label}</span>
            </div>
          </div>
        </div>

        {analysis.symptoms.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2">파악된 증상</p>
            <div className="flex flex-wrap gap-2">
              {analysis.symptoms.map((s, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
        >
          ← 다시 입력
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          예약 가능 시간 확인
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
