'use client';

import { useState } from 'react';

export default function ApiKeyModal({ onSave }: { onSave: (key: string) => void }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = key.trim();
    if (!trimmed) {
      setError('API 키를 입력해주세요.');
      return;
    }
    if (!trimmed.startsWith('sk-or-')) {
      setError('올바른 OpenRouter API 키를 입력해주세요. (sk-or-로 시작)');
      return;
    }
    localStorage.setItem('openrouter_api_key', trimmed);
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">OpenRouter API 키 설정</h2>
            <p className="text-sm text-gray-500">AI 예약 시스템 사용을 위해 필요합니다</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          API 키는 브라우저의 로컬 스토리지에만 저장되며 서버로 전송되지 않습니다.
          OpenRouter의 <code className="bg-gray-100 px-1 rounded text-xs">openrouter/auto</code> 모델을 사용합니다.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-gray-500 font-medium mb-1">💡 .env.local 파일로 설정하는 방법</p>
          <code className="text-xs text-gray-700 block">
            NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
          </code>
          <p className="text-xs text-gray-400 mt-1">설정 시 이 모달이 표시되지 않습니다.</p>
        </div>

        <input
          type="password"
          value={key}
          onChange={(e) => { setKey(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="sk-or-v1-..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 font-mono"
        />

        {error && (
          <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mt-1"
        >
          시작하기
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          API 키가 없으신가요?{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            OpenRouter에서 발급받기 →
          </a>
        </p>
      </div>
    </div>
  );
}
