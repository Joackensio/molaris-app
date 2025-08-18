import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { CreditCard as Edit2, Phone, Calendar, Clock, Trash2 } from 'lucide-react-native';
import AppContext from '@/context/AppContext';
import SaveConfirmation from '@/components/SaveConfirmation';
import { formatTime } from '@/types/time';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const { patients, deletePatient } = useContext(AppContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text>Paciente no encontrado</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Paciente',
      `¿Estás seguro de que deseas eliminar a ${patient.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePatient(patient.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el paciente');
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: patient.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push(`/patient/edit/${id}`)}
                style={styles.headerButton}
              >
                <Edit2 size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Trash2 size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#FFF',
        }}
      />

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.patientHeader}>
            <Text style={styles.name}>{patient.name}</Text>
            <Text style={styles.age}>{patient.age} años - {patient.sex}</Text>
          </View>
          
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Información de Contacto</Text>
            {patient.mobilePhone && (
              <View style={styles.infoRow}>
                <Phone size={16} color="#666" />
                <Text style={styles.infoText}>Móvil: {patient.mobilePhone}</Text>
              </View>
            )}
            {patient.landlinePhone && (
              <View style={styles.infoRow}>
                <Phone size={16} color="#666" />
                <Text style={styles.infoText}>Fijo: {patient.landlinePhone}</Text>
              </View>
            )}
            {patient.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Email: {patient.email}</Text>
              </View>
            )}
          </View>

          <View style={styles.personalSection}>
            <Text style={styles.sectionTitle}>Datos Personales</Text>
            <Text style={styles.infoText}>Documento: {patient.documentType} {patient.documentNumber}</Text>
            <Text style={styles.infoText}>Estado Civil: {patient.civilStatus}</Text>
            <Text style={styles.infoText}>Profesión: {patient.profession}</Text>
            <Text style={styles.infoText}>Domicilio: {patient.currentAddress}</Text>
          </View>

          <View style={styles.appointmentSection}>
            <Text style={styles.sectionTitle}>Información de Cita</Text>
            <View style={styles.infoRow}>
              <Calendar size={16} color="#666" />
              <Text style={styles.infoText}>
                Fecha: {new Date(patient.date).toLocaleDateString()}
              </Text>
            </View>
            {patient.time && (
              <View style={styles.infoRow}>
                <Clock size={16} color="#666" />
                <Text style={styles.infoText}>Hora: {formatTime(patient.time)}</Text>
              </View>
            )}
          </View>

          {patient.consultReason && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Motivo de Consulta</Text>
              <Text style={styles.sectionText}>{patient.consultReason}</Text>
            </View>
          )}

          {patient.familyHistory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Antecedentes Heredo-Familiares</Text>
              <Text style={styles.sectionText}>{patient.familyHistory}</Text>
            </View>
          )}

          {patient.personalHistory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Antecedentes Personales</Text>
              <Text style={styles.sectionText}>{patient.personalHistory}</Text>
            </View>
          )}

          {patient.currentIllnessHistory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Antecedentes de la Enfermedad Actual</Text>
              <Text style={styles.sectionText}>{patient.currentIllnessHistory}</Text>
            </View>
          )}

          {patient.currentCondition && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estado Actual</Text>
              <Text style={styles.sectionText}>{patient.currentCondition}</Text>
            </View>
          )}

          {patient.diagnosis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diagnóstico</Text>
              <Text style={styles.sectionText}>{patient.diagnosis}</Text>
            </View>
          )}

          {patient.treatmentPlan && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Plan de Tratamiento</Text>
              <Text style={styles.sectionText}>{patient.treatmentPlan}</Text>
            </View>
          )}

          {patient.photos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Odontograma</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photoScroll}
              >
                {patient.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.photo}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <SaveConfirmation
        visible={showConfirmation}
        onComplete={() => setShowConfirmation(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    color: '#666',
  },
  contactSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  personalSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  appointmentSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  photoScroll: {
    marginTop: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
});