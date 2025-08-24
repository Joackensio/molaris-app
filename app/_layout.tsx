// import 'expo-standard-web-crypto';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import AuthContext from '@/context/AuthContext';
import AppContext from '@/context/AppContext';
import { getPatients, savePatient, deletePatient as removePatient } from '@/services/patientService';
import { getAppointments, saveAppointment, deleteAppointment as removeAppointment, getAppointmentsForDate } from '@/services/appointmentService';
import { Patient } from '@/types/patient';
import { Appointment } from '@/types/appointment';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useFrameworkReady();
  const defaultAuth = false;
  const [isAuthenticated, setIsAuthenticated] = useState(defaultAuth);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const applyHidden = async () => {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
        } catch {}
      };

      applyHidden();

      const sub = NavigationBar.addVisibilityListener(({ visibility }) => {
        if (visibility !== 'hidden') {
          NavigationBar.setVisibilityAsync('hidden');
        }
      });

      return () => {
        sub.remove();
      };
    }
  }, []);

  const refreshAppointments = async () => {
    try {
      const allAppointments = await getAppointments();
      setAppointments(allAppointments);
      
      // Calculate today's appointments
      const today = new Date();
      const todayAppointmentsList = await getAppointmentsForDate(today);
      setTodayAppointments(todayAppointmentsList);
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    }
  };

  const refreshPatients = async () => {
    try {
      const allPatients = await getPatients();
      setPatients(allPatients);
    } catch (error) {
      console.error('Error refreshing patients:', error);
    }
  };

  const addPatient = async (patient: Patient) => {
    try {
      await savePatient(patient);
      await refreshPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await removePatient(id);
      await refreshPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const addAppointment = async (appointment: Appointment) => {
    try {
      await saveAppointment(appointment);
      await refreshAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const deleteAppointmentHandler = async (id: string) => {
    try {
      await removeAppointment(id);
      await refreshAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  useEffect(() => {
    const boot = async () => {
      try {
        await Promise.all([refreshPatients(), refreshAppointments()]);
      } finally {
        // Simula una transición corta como WhatsApp
        setTimeout(() => {
          SplashScreen.hideAsync().catch(() => {});
        }, 500);
      }
    };

    boot();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <AppContext.Provider value={{
        patients,
        appointments,
        todayAppointments,
        todayAppointmentsCount: todayAppointments.length,
        refreshPatients,
        refreshAppointments,
        addPatient,
        deletePatient,
        addAppointment,
        deleteAppointment: deleteAppointmentHandler
      }}>
        <>
          <Stack screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <Stack.Screen name="login" options={{ gestureEnabled: false }} />
            ) : (
              <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            )}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </>
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}
