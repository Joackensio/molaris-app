import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Stack, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock, Save, ChevronDown } from 'lucide-react-native';
import { useContext } from 'react';
import AppContext from '@/context/AppContext';
import SaveConfirmation from '@/components/SaveConfirmation';
import { Appointment } from '@/types/appointment';

export default function AddAppointmentScreen() {
  const { addAppointment } = useContext(AppContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCustomTimePicker, setShowCustomTimePicker] = useState(false);
  
  const [appointment, setAppointment] = useState<Appointment>({
    id: Date.now().toString(),
    patientName: '',
    date: new Date(),
    time: {
      hours: 9,
      minutes: 0
    },
    phone: '',
    notes: ''
  });

  const handleSave = async () => {
    if (!appointment.patientName.trim()) {
      Alert.alert('Error', 'El nombre del paciente es requerido');
      return;
    }

    try {
      await addAppointment(appointment);
      setShowConfirmation(true);
      
      setTimeout(() => {
        setShowConfirmation(false);
        router.back();
      }, 1500);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el turno');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointment(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const onTimeChange = (_event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Extraer directamente las horas y minutos sin conversiones
      const timeString = selectedTime.toTimeString();
      const [hourMinute] = timeString.split(':');
      const hours = parseInt(hourMinute.substring(0, 2), 10);
      const minutes = parseInt(hourMinute.substring(3, 5), 10);
      
      console.log('Hora seleccionada (string):', timeString);
      console.log('Horas extraídas:', hours, 'Minutos:', minutes);
      
      setAppointment(prev => ({
        ...prev,
        time: {
          hours: hours,
          minutes: minutes
        }
      }));
    }
  };

  // Función para el selector personalizado de hora
  const CustomTimePicker = () => {
    const [tempHours, setTempHours] = useState(appointment.time.hours);
    const [tempMinutes, setTempMinutes] = useState(appointment.time.minutes);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const handleConfirm = () => {
      setAppointment(prev => ({
        ...prev,
        time: {
          hours: tempHours,
          minutes: tempMinutes
        }
      }));
      setShowCustomTimePicker(false);
    };

    return (
      <Modal
        visible={showCustomTimePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerModal}>
            <Text style={styles.modalTitle}>Seleccionar Hora</Text>
            
            <View style={styles.pickersContainer}>
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <ScrollView 
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        tempHours === hour && styles.selectedPickerItem
                      ]}
                      onPress={() => setTempHours(hour)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        tempHours === hour && styles.selectedPickerItemText
                      ]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Minutos</Text>
                <ScrollView 
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {minutes.filter(m => m % 1 === 0).map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        tempMinutes === minute && styles.selectedPickerItem
                      ]}
                      onPress={() => setTempMinutes(minute)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        tempMinutes === minute && styles.selectedPickerItemText
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomTimePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const formatTime = (time: { hours: number; minutes: number }) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Agregar Turno',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#FFF',
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveHeaderButton}
            >
              <Save size={20} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INFORMACIÓN DEL TURNO</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre del Paciente *</Text>
                <TextInput
                  style={styles.input}
                  value={appointment.patientName}
                  onChangeText={(text) => setAppointment(prev => ({ ...prev, patientName: text }))}
                  placeholder="Nombre completo del paciente"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={appointment.phone}
                  onChangeText={(text) => setAppointment(prev => ({ ...prev, phone: text }))}
                  placeholder="Número de teléfono"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Fecha</Text>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Calendar size={20} color="#666" />
                    <Text style={styles.dateTimeText}>
                      {appointment.date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Hora</Text>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowCustomTimePicker(true)}
                  >
                    <Clock size={20} color="#666" />
                    <Text style={styles.dateTimeText}>
                      {formatTime(appointment.time)}
                    </Text>
                    <ChevronDown size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notas</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={appointment.notes}
                  onChangeText={(text) => setAppointment(prev => ({ ...prev, notes: text }))}
                  placeholder="Notas adicionales sobre el turno"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Guardar Turno</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={appointment.date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <CustomTimePicker />

        <SaveConfirmation
          visible={showConfirmation}
          onComplete={() => setShowConfirmation(false)}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  form: {
    gap: 24,
  },
  section: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTimeButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  saveHeaderButton: {
    marginRight: 16,
    padding: 4,
  },
  fixedButtonContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  saveButton: {
    backgroundColor: '#FF4081',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Estilos para el selector personalizado de hora
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  pickersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pickerSection: {
    alignItems: 'center',
    flex: 1,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  picker: {
    height: 200,
    width: '100%',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedPickerItem: {
    backgroundColor: '#FF4081',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#333',
  },
  selectedPickerItemText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#FF4081',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});