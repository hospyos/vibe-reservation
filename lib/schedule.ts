import { AppointmentSlot } from './types';

const DOCTORS: Record<string, string[]> = {
  '내과': ['김민준 전문의', '이서연 전문의'],
  '외과': ['최수아 전문의', '정현우 전문의'],
  '피부과': ['강예진 전문의', '윤도현 전문의'],
  '정형외과': ['임지수 전문의', '한상호 전문의'],
  '이비인후과': ['오미래 전문의', '서준혁 전문의'],
  '안과': ['홍채원 전문의', '남기태 전문의'],
  '산부인과': ['백지은 전문의', '전소희 전문의'],
  '소아과': ['류건우 전문의', '신하린 전문의'],
  '신경과': ['구자현 전문의', '허은서 전문의'],
  '정신건강의학과': ['방태준 전문의', '석유진 전문의'],
};

export const DEPARTMENTS = Object.keys(DOCTORS);

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function createRNG(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}

export function generateSlots(department: string): AppointmentSlot[] {
  const slots: AppointmentSlot[] = [];
  const deptDoctors = DOCTORS[department] ?? DOCTORS['내과'];
  const today = new Date();
  const seed = hashSeed(department + today.toISOString().split('T')[0]);
  const random = createRNG(seed);

  for (let d = 1; d <= 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    if (date.getDay() === 0) continue;

    const isSaturday = date.getDay() === 6;
    const times = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      ...(isSaturday ? [] : ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30']),
    ];

    const dateStr = date.toISOString().split('T')[0];

    for (const time of times) {
      for (const doctor of deptDoctors) {
        const available = random() > 0.4;
        slots.push({
          id: `${dateStr}-${time.replace(':', '')}-${doctor.slice(0, 3)}`,
          date: dateStr,
          time,
          doctor,
          department,
          available,
        });
      }
    }
  }

  return slots;
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${m}월 ${d}일 (${days[date.getDay()]})`;
}

export function formatTime(timeStr: string): string {
  const [h, min] = timeStr.split(':').map(Number);
  const period = h < 12 ? '오전' : '오후';
  const displayH = h > 12 ? h - 12 : h;
  return `${period} ${displayH}:${min.toString().padStart(2, '0')}`;
}
