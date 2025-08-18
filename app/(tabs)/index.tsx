import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import { UserPlus, Search, Clock, Calendar, X } from 'lucide-react-native';
import AppContext from '@/context/AppContext';
import { formatAppointmentTime, Appointment } from '@/types/appointment';
import { getAppointmentsForDate } from '@/services/appointmentService';

export default function HomeScreen() {
  const { patients, todayAppointments, todayAppointmentsCount } = useContext(AppContext);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleAppointmentPress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity 
      style={styles.appointmentCard}
      onPress={() => handleAppointmentPress(item)}
      activeOpacity={0.7}
    >
      <Clock size={20} color="#666" style={styles.clockIcon} />
      <View style={styles.appointmentInfo}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <Text style={styles.appointmentTime}>
          {formatAppointmentTime(item.time)}
        </Text>
        {item.phone && (
          <Text style={styles.appointmentPhone}>{item.phone}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={[styles.card, styles.cardAdd]} 
          onPress={() => router.push('/(tabs)/add')}
        >
          <UserPlus size={36} color="#333" />
          <Text style={styles.cardText}>Agregar nuevo paciente</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.card, styles.cardSearch]} 
          onPress={() => router.push('/(tabs)/search')}
        >
          <Search size={36} color="#333" />
          <Text style={styles.cardText}>Buscar paciente</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.card, styles.cardAppointment]} 
          onPress={() => router.push('/appointment/add')}
        >
          <Calendar size={36} color="#333" />
          <Text style={styles.cardText}>Agregar Turno</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayAppointmentsCount}</Text>
            <Text style={styles.statLabel}>Turnos Hoy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{patients.length}</Text>
            <Text style={styles.statLabel}>Total Pacientes</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.appointmentsContainer}
        onPress={() => router.push('/appointments')}
      >
        <View style={styles.appointmentsHeader}>
          <Text style={styles.appointmentsTitle}>Turnos</Text>
          <Text style={styles.appointmentsSubtitle}>Ver todos</Text>
        </View>
        <View style={styles.appointmentsPreview}>
          {todayAppointments.length > 0 ? (
            <Text style={styles.previewText}>
              {todayAppointments.length} turno{todayAppointments.length !== 1 ? 's' : ''} para hoy
            </Text>
          ) : (
            <Text style={styles.previewText}>No hay turnos para hoy</Text>
          )}
        </View>
      </TouchableOpacity>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  cardsContainer: {
    marginTop: 20,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardAdd: {
    backgroundColor: '#F8BBD0',
  },
  cardSearch: {
    backgroundColor: '#F8BBD0',
  },
  cardAppointment: {
    backgroundColor: '#F8BBD0',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    marginTop: 30,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E0E0E0',
  },
  appointmentsContainer: {
    marginTop: 24,
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  appointmentsPreview: {
    paddingTop: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#666',
  },
  appointmentsList: {
    paddingBottom: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clockIcon: {
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  appointmentPhone: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  noAppointments: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#666',
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
