import { InquiryAnalysis, AppointmentSlot, SlotSuggestion } from './types';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openrouter/auto';

async function callAPI(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer':
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://vibe-reservation.vercel.app',
      'X-Title': 'Vibe Medical Reservation',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `API 오류 (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function extractJSON(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('JSON을 찾을 수 없습니다');
  return JSON.parse(match[0]);
}

export async function analyzeInquiry(
  apiKey: string,
  inquiry: string,
): Promise<InquiryAnalysis> {
  const systemPrompt = `당신은 병원 예약 접수 AI 어시스턴트입니다. 환자의 문의를 분석하여 반드시 아래 JSON 형식으로만 응답하세요.

{
  "department": "진료과 (내과/외과/피부과/정형외과/이비인후과/안과/산부인과/소아과/신경과/정신건강의학과 중 하나)",
  "urgency": "low 또는 medium 또는 high",
  "symptoms": ["증상1", "증상2"],
  "preferredTime": "morning 또는 afternoon 또는 any",
  "summary": "환자 상태 및 추천 진료 안내 (2-3문장, 친절한 한국어)"
}

긴급도 기준: high=즉각 진료 필요, medium=수일 내 진료 필요, low=일반/정기 진료`;

  const content = await callAPI(
    apiKey,
    [{ role: 'user', content: `환자 문의:\n${inquiry}` }],
    systemPrompt,
  );

  try {
    const r = extractJSON(content) as Partial<InquiryAnalysis>;
    return {
      department: r.department ?? '내과',
      urgency: r.urgency ?? 'medium',
      symptoms: r.symptoms ?? [],
      preferredTime: r.preferredTime ?? 'any',
      summary: r.summary ?? inquiry,
    };
  } catch {
    return {
      department: '내과',
      urgency: 'medium',
      symptoms: [inquiry.slice(0, 50)],
      preferredTime: 'any',
      summary: inquiry,
    };
  }
}

export async function suggestSlot(
  apiKey: string,
  analysis: InquiryAnalysis,
  availableSlots: AppointmentSlot[],
): Promise<SlotSuggestion> {
  const systemPrompt = `당신은 병원 예약 AI 어시스턴트입니다. 환자 분석 결과와 가용 슬롯을 보고 최적의 예약을 추천하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "recommendedSlotId": "슬롯 ID (정확히 일치해야 함)",
  "reasoning": "추천 이유 (1-2문장, 한국어)",
  "message": "환자에게 전달할 안내 메시지 (2-3문장, 친근하고 전문적인 한국어)"
}`;

  const topSlots = availableSlots.slice(0, 12);

  const content = await callAPI(
    apiKey,
    [
      {
        role: 'user',
        content: `환자 분석:
- 진료과: ${analysis.department}
- 긴급도: ${analysis.urgency}
- 증상: ${analysis.symptoms.join(', ')}
- 선호 시간대: ${analysis.preferredTime}
- 요약: ${analysis.summary}

가용 예약 슬롯:
${JSON.stringify(topSlots, null, 2)}

위 슬롯 중 가장 적합한 하나를 추천해주세요.`,
      },
    ],
    systemPrompt,
  );

  const fallbackSlot = topSlots[0];

  try {
    const r = extractJSON(content) as Partial<SlotSuggestion>;
    return {
      recommendedSlotId: r.recommendedSlotId ?? fallbackSlot?.id ?? '',
      reasoning: r.reasoning ?? '가장 빠른 가용 시간을 추천드립니다.',
      message: r.message ?? '아래 시간에 내원해 주시면 진료를 도와드리겠습니다.',
    };
  } catch {
    return {
      recommendedSlotId: fallbackSlot?.id ?? '',
      reasoning: '가장 빠른 가용 시간을 추천드립니다.',
      message: '아래 시간에 내원해 주시면 진료를 도와드리겠습니다.',
    };
  }
}
