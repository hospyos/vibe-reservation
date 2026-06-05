import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AppointmentRecord {
  booking_number: string;
  patient_name: string;
  department: string;
  doctor: string;
  appointment_date: string;
  appointment_time: string;
  inquiry: string;
  symptoms: string[];
  urgency: string;
}

export async function saveAppointment(data: AppointmentRecord): Promise<void> {
  const { error } = await supabase.from('appointments').insert(data);
  if (error) throw new Error(error.message);
}
