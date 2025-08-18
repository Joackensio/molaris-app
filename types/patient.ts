import { Time } from '@/types/time';

export interface Patient {
  id: string;
  name: string;
  age: string;
  sex: string;
  documentType: string;
  documentNumber: string;
  civilStatus: string;
  currentAddress: string;
  previousAddress: string;
  profession: string;
  mobilePhone: string;
  landlinePhone: string;
  email: string;
  date: Date;
  time?: Time;
  consultReason: string;
  familyHistory: string;
  personalHistory: string;
  currentIllnessHistory: string;
  currentCondition: string;
  diagnosis: string;
  treatmentPlan: string;
  photos: string[];
}

export interface PatientDetails extends Patient {
  isEditing?: boolean;
}