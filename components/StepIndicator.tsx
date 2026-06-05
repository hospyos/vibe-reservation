import { AppStep } from '@/lib/types';

const STEPS = [
  { label: '문의 접수', icon: '💬' },
  { label: '일정 확인', icon: '📅' },
  { label: '예약 완료', icon: '✅' },
];

function getStepIndex(step: AppStep): number {
  if (step === 'inquiry' || step === 'analyzing') return 0;
  if (step === 'slots' || step === 'confirming') return 1;
  return 2;
}

export default function StepIndicator({ currentStep }: { currentStep: AppStep }) {
  const current = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-center gap-1">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                done
                  ? 'bg-blue-600 text-white'
                  : active
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-500'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span>{done ? '✓' : step.icon}</span>
              <span>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-0.5 ${i < current ? 'bg-blue-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
