'use client';

import { useState, useEffect } from 'react';
import ApiKeyModal from '@/components/ApiKeyModal';
import StepIndicator from '@/components/StepIndicator';
import InquiryStep from '@/components/InquiryStep';
import AnalysisStep from '@/components/AnalysisStep';
import SlotsStep from '@/components/SlotsStep';
import ConfirmationStep from '@/components/ConfirmationStep';
import CompletedStep from '@/components/CompletedStep';
import { AppStep, AppState } from '@/lib/types';
import { analyzeInquiry, suggestSlot } from '@/lib/openrouter';
import { generateSlots } from '@/lib/schedule';

const INITIAL_STATE: AppState = {
  inquiry: '',
  patientName: '',
  analysis: null,
  slots: [],
  suggestion: null,
  selectedSlot: null,
};

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<AppStep>('inquiry');
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (envKey) {
      setApiKey(envKey);
      return;
    }
    const saved = localStorage.getItem('openrouter_api_key');
    if (!saved) {
      setShowModal(true);
    } else {
      setApiKey(saved);
    }
  }, []);

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    setShowModal(false);
  };

  const handleInquirySubmit = async (inquiry: string, patientName: string) => {
    setError('');
    setIsAnalyzing(true);
    setStep('analyzing');
    setState({ ...INITIAL_STATE, inquiry, patientName });

    try {
      const analysis = await analyzeInquiry(apiKey, inquiry);
      setState((prev) => ({ ...prev, analysis }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      setError(msg);
      setStep('inquiry');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinueToSlots = async () => {
    if (!state.analysis) return;
    const slots = generateSlots(state.analysis.department);
    setState((prev) => ({ ...prev, slots, suggestion: null }));
    setStep('slots');

    setIsSuggesting(true);
    try {
      const available = slots.filter((s) => s.available);
      const suggestion = await suggestSlot(apiKey, state.analysis, available);
      setState((prev) => ({ ...prev, suggestion }));
    } catch {
      // suggestion failed silently — user can still pick manually
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSlotSelect = (slot: AppState['selectedSlot']) => {
    setState((prev) => ({ ...prev, selectedSlot: slot }));
    setStep('confirming');
  };

  const handleConfirm = () => setStep('completed');

  const handleReset = () => {
    setState(INITIAL_STATE);
    setStep('inquiry');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30">
      {showModal && <ApiKeyModal onSave={handleApiKeySave} />}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-none">Vibe 의원</h1>
              <p className="text-xs text-gray-400">AI 진료 예약 시스템</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            설정
          </button>
        </div>
      </header>

      {/* Step indicator */}
      {step !== 'completed' && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <StepIndicator currentStep={step} />
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">오류가 발생했습니다</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {step === 'inquiry' && (
          <InquiryStep onSubmit={handleInquirySubmit} isLoading={isAnalyzing} />
        )}

        {step === 'analyzing' && (
          <AnalysisStep
            inquiry={state.inquiry}
            analysis={state.analysis}
            isLoading={isAnalyzing}
            onContinue={handleContinueToSlots}
            onBack={() => {
              setStep('inquiry');
              setState((prev) => ({ ...prev, analysis: null }));
            }}
          />
        )}

        {step === 'slots' && state.analysis && (
          <SlotsStep
            analysis={state.analysis}
            slots={state.slots}
            suggestion={state.suggestion}
            isLoadingSuggestion={isSuggesting}
            onSelect={handleSlotSelect}
            onBack={() => setStep('analyzing')}
          />
        )}

        {step === 'confirming' && state.selectedSlot && state.analysis && (
          <ConfirmationStep
            slot={state.selectedSlot}
            analysis={state.analysis}
            patientName={state.patientName}
            onConfirm={handleConfirm}
            onBack={() => setStep('slots')}
          />
        )}

        {step === 'completed' && state.selectedSlot && (
          <CompletedStep
            slot={state.selectedSlot}
            patientName={state.patientName}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-300">
        Powered by OpenRouter · Vibe 의원 AI 예약 시스템
      </footer>
    </div>
  );
}
