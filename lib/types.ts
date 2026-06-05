export type AppStep = 'inquiry' | 'analyzing' | 'slots' | 'confirming' | 'completed';

export interface InquiryAnalysis {
  department: string;
  urgency: 'low' | 'medium' | 'high';
  symptoms: string[];
  preferredTime: 'morning' | 'afternoon' | 'any';
  summary: string;
}

export interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  available: boolean;
}

export interface SlotSuggestion {
  recommendedSlotId: string;
  reasoning: string;
  message: string;
}

export interface AppState {
  inquiry: string;
  patientName: string;
  analysis: InquiryAnalysis | null;
  slots: AppointmentSlot[];
  suggestion: SlotSuggestion | null;
  selectedSlot: AppointmentSlot | null;
}
