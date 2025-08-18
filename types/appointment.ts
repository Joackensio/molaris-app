export interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  time: {
    hours: number;
    minutes: number;
  };
  phone?: string;
  notes?: string;
}

export function formatAppointmentTime(time: { hours: number; minutes: number }): string {
  return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
}