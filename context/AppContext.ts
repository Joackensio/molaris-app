import { createContext } from 'react';
import { Patient } from '@/types/patient';
import { Appointment } from '@/types/appointment';

interface AppContextType {
  patients: Patient[];
  todayAppointments: Appointment[];
  todayAppointmentsCount: number;
  appointments: Appointment[];
  refreshPatients: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  addPatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  patients: [],
  todayAppointments: [],
  todayAppointmentsCount: 0,
  appointments: [],
  refreshPatients: async () => {},
  refreshAppointments: async () => {},
  addPatient: async () => {},
  deletePatient: async () => {},
  addAppointment: async () => {},
  deleteAppointment: async () => {},
});

export default AppContext;
