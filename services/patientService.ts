import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient } from '@/types/patient';

const PATIENTS_STORAGE_KEY = 'dental_patients';

/**
 * Save a patient to storage
 */
export const savePatient = async (patient: Patient): Promise<void> => {
  try {
    // Get existing patients
    const existingPatientsJSON = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    const existingPatients: Patient[] = existingPatientsJSON 
      ? JSON.parse(existingPatientsJSON) 
      : [];
    
    // Check if patient already exists
    const patientIndex = existingPatients.findIndex(p => p.id === patient.id);
    
    if (patientIndex >= 0) {
      // Update existing patient
      existingPatients[patientIndex] = patient;
    } else {
      // Add new patient
      existingPatients.push(patient);
    }
    
    // Save back to storage
    await AsyncStorage.setItem(
      PATIENTS_STORAGE_KEY, 
      JSON.stringify(existingPatients)
    );
  } catch (error) {
    console.error('Error saving patient:', error);
    throw new Error('Failed to save patient');
  }
};

/**
 * Get all patients from storage
 */
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const patientsJSON = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
    return patientsJSON ? JSON.parse(patientsJSON) : [];
  } catch (error) {
    console.error('Error getting patients:', error);
    throw new Error('Failed to get patients');
  }
};

/**
 * Get a patient by ID
 */
export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const patients = await getPatients();
    return patients.find(patient => patient.id === id) || null;
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    throw new Error('Failed to get patient by ID');
  }
};

/**
 * Delete a patient by ID
 */
export const deletePatient = async (id: string): Promise<void> => {
  try {
    const patients = await getPatients();
    const filteredPatients = patients.filter(patient => patient.id !== id);
    await AsyncStorage.setItem(
      PATIENTS_STORAGE_KEY,
      JSON.stringify(filteredPatients)
    );
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw new Error('Failed to delete patient');
  }
};

/**
 * Search patients by name or phone
 */
export const searchPatients = async (query: string): Promise<Patient[]> => {
  try {
    const patients = await getPatients();
    if (!query.trim()) return patients;
    
    const searchLower = query.toLowerCase();
    return patients.filter(
      patient => 
        patient.name.toLowerCase().includes(searchLower) ||
        (patient.mobilePhone && patient.mobilePhone.includes(query)) ||
        (patient.landlinePhone && patient.landlinePhone.includes(query))
    );
  } catch (error) {
    console.error('Error searching patients:', error);
    throw new Error('Failed to search patients');
  }
};