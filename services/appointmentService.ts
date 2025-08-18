import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '@/types/appointment';

const APPOINTMENTS_STORAGE_KEY = 'dental_appointments';

/**
 * Save an appointment to storage
 */
export const saveAppointment = async (appointment: Appointment): Promise<void> => {
  try {
    const existingAppointmentsJSON = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const existingAppointments: Appointment[] = existingAppointmentsJSON 
      ? JSON.parse(existingAppointmentsJSON) 
      : [];
    
    const appointmentIndex = existingAppointments.findIndex(a => a.id === appointment.id);
    
    if (appointmentIndex >= 0) {
      existingAppointments[appointmentIndex] = appointment;
    } else {
      existingAppointments.push(appointment);
    }
    
    await AsyncStorage.setItem(
      APPOINTMENTS_STORAGE_KEY, 
      JSON.stringify(existingAppointments)
    );
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw new Error('Failed to save appointment');
  }
};

/**
 * Get all appointments from storage
 */
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const appointmentsJSON = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!appointmentsJSON) return [];
    
    const appointments = JSON.parse(appointmentsJSON);
    return appointments.map((appointment: any) => ({
      ...appointment,
      date: appointment.date ? new Date(appointment.date) : new Date()
    }));
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw new Error('Failed to get appointments');
  }
};

/**
 * Delete an appointment by ID
 */
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const appointments = await getAppointments();
    const filteredAppointments = appointments.filter(appointment => appointment.id !== id);
    await AsyncStorage.setItem(
      APPOINTMENTS_STORAGE_KEY,
      JSON.stringify(filteredAppointments)
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw new Error('Failed to delete appointment');
  }
};

/**
 * Get appointments for a specific date
 */
export const getAppointmentsForDate = async (date: Date): Promise<Appointment[]> => {
  try {
    const appointments = await getAppointments();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      // Comparar la fecha ignorando la hora para evitar problemas de zona horaria
      return appointmentDate.toDateString() === date.toDateString();
    }).sort((a, b) => {
      return (a.time.hours * 60 + a.time.minutes) - (b.time.hours * 60 + b.time.minutes);
    });
  } catch (error) {
    console.error('Error getting appointments for date:', error);
    throw new Error('Failed to get appointments for date');
  }
};
