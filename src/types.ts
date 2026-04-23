
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  isAdmin?: boolean;
  authProvider?: 'local' | 'google';
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  address?: string;
  phone: string;
  fee: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'visit' | 'consultation';
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface MedicineAnalysis {
  name: string;
  purpose: string;
  dosage: string;
  safetyNotes: string;
  warning?: string;
}

export interface InteractionResult {
  isSafe: boolean;
  severity: 'none' | 'low' | 'moderate' | 'high';
  interactionDescription: string;
  suggestedTiming: string;
}
