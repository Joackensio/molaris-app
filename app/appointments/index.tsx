import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Plus, Clock, Phone, CreditCard as Edit, Trash2, X } from 'lucide-react-native';
import AppContext from '@/context/AppContext';
import { Appointment, formatAppointmentTime } from '@/types/appointment';
import { getAppointmentsForDate } from '@/services/appointmentService';

export default function AppointmentsScreen() {
  const { appointments, deleteAppointment } = useContext(AppContext);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAppointmentPress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setModalVisible(false);
    router.push(`/appointment/edit/${appointment.id}`);
  };

  const handleDelete = (appointment: Appointment) => {
    Alert.alert(
      'Eliminar Turno',
      `¿Estás seguro de que deseas eliminar el turno de ${appointment.patientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAppointment(appointment.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el turno');
            }
          }
        }
      ]
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const appointmentDate = new Date(item.date);
    const isToday = appointmentDate.toDateString() === new Date().toDateString();
    
    return (
      <TouchableOpacity 
        style={[styles.appointmentCard, isToday && styles.todayAppointment]}
        onPress={() => handleAppointmentPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.appointmentMain}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <View style={styles.appointmentDetails}>
              <Clock size={16} color="#666" />
              <Text style={styles.appointmentTime}>
                {appointmentDate.toLocaleDateString()} - {formatAppointmentTime(item.time)}
              </Text>
            </View>
            {item.phone && (
              <View style={styles.appointmentDetails}>
                <Phone size={16} color="#666" />
                <Text style={styles.appointmentPhone}>{item.phone}</Text>
              </View>
            )}
            {isToday && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>HOY</Text>
              </View>
            )}
          </View>
          
          <View style={styles.appointmentActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(item)}
            >
              <Edit size={20} color="#4DB6AC" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(item)}
            >
              <Trash2 size={20} color="#FF5252" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Todos los Turnos',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#FFF',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/appointment/add')}
              style={styles.addButton}
            >
              <Plus size={24} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.container}>
        {appointments.length > 0 ? (
          <FlatList
            data={appointments}
            renderItem={renderAppointment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.appointmentsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Clock size={60} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No hay turnos para hoy</Text>
            <Text style={styles.emptyStateSubtitle}>
              Agrega un nuevo turno para verlo aquí.
            </Text>
            <TouchableOpacity
              style={styles.addAppointmentButton}
              onPress={() => router.push('/appointment/add')}
            >
              <Plus size={20} color="#FFF" />
              <Text style={styles.addAppointmentButtonText}>Agregar Turno</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Appointment Details Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalles del Turno</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {selectedAppointment && (
                <View style={styles.modalBody}>
                  <View style={styles.appointmentDetail}>
                    <Text style={styles.detailLabel}>Paciente:</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.patientName}</Text>
                  </View>
                  
                  <View style={styles.appointmentDetail}>
                    <Text style={styles.detailLabel}>Fecha:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedAppointment.date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.appointmentDetail}>
                    <Text style={styles.detailLabel}>Hora:</Text>
                    <Text style={styles.detailValue}>
                      {formatAppointmentTime(selectedAppointment.time)}
                    </Text>
                  </View>
                  
                  {selectedAppointment.phone && (
                    <View style={styles.appointmentDetail}>
                      <Text style={styles.detailLabel}>Teléfono:</Text>
                      <Text style={styles.detailValue}>{selectedAppointment.phone}</Text>
                    </View>
                  )}
                  
                  <View style={styles.appointmentDetail}>
                    <Text style={styles.detailLabel}>Notas:</Text>
                    <Text style={styles.detailValue}>
                      {selectedAppointment.notes || 'Sin notas adicionales'}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    marginRight: 16,
    padding: 4,
  },
  appointmentsList: {
    padding: 16,
    paddingBottom: 32,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayAppointment: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4081',
  },
  appointmentMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appointmentInfo: {
    flex: 1,
    marginRight: 16,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  appointmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  appointmentPhone: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  todayBadge: {
    backgroundColor: '#FF4081',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  todayBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addAppointmentButton: {
    backgroundColor: '#FF4081',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addAppointmentButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    gap: 16,
  },
  appointmentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
});
