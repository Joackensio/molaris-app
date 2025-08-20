import React, { useState, useEffect, useContext } from 'react';
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
  Image
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera, X, Image as ImageIcon } from 'lucide-react-native';
import AppContext from '@/context/AppContext';

export default function AddPatientScreen() {
  const { addPatient } = useContext(AppContext);
  const [patient, setPatient] = useState({
    id: Date.now().toString(),
    name: '',
    age: '',
    sex: '',
    documentType: 'DNI',
    documentNumber: '',
    civilStatus: '',
    currentAddress: '',
    previousAddress: '',
    profession: '',
    mobilePhone: '',
    landlinePhone: '',
    email: '',
    date: new Date(),
    consultReason: '',
    familyHistory: '',
    personalHistory: '',
    currentIllnessHistory: '',
    currentCondition: '',
    diagnosis: '',
    treatmentPlan: '',
    photos: [] as string[]
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!cameraPermission.granted || !mediaPermission.granted) {
        Alert.alert(
          'Permisos insuficientes',
          'Necesitamos permisos de cámara y galería para gestionar las fotos.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    })();
  }, []);
  
  useEffect(() => {
    const { name, documentNumber } = patient;
    setIsFormValid(
      name.trim().length > 0 &&
      documentNumber.trim().length > 0
    );
  }, [patient]);

  const handleChange = (name: string, value: string) => {
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPatient(prev => ({
          ...prev,
          photos: [...prev.photos, uri]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la cámara.');
    }
  };
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });
      
      if (!result.canceled && result.assets) {
        const uris = result.assets.map(asset => asset.uri);
        setPatient(prev => ({
          ...prev,
          photos: [...prev.photos, ...uris]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería.');
    }
  };
  
  const removePhoto = (index: number) => {
    setPatient(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  const handleSave = async () => {
    try {
      await addPatient(patient);
      // Reset form
      setPatient({
        id: Date.now().toString(),
        name: '',
        age: '',
        sex: '',
        documentType: 'DNI',
        documentNumber: '',
        civilStatus: '',
        currentAddress: '',
        previousAddress: '',
        profession: '',
        mobilePhone: '',
        landlinePhone: '',
        email: '',
        date: new Date(),
        consultReason: '',
        familyHistory: '',
        personalHistory: '',
        currentIllnessHistory: '',
        currentCondition: '',
        diagnosis: '',
        treatmentPlan: '',
        photos: []
      });
      
      // Navigate to patient details
      router.push(`/patient/${patient.id}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el paciente');
    }
  };

  const renderSection = (title: string, fieldName: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={patient[fieldName]}
        onChangeText={(text) => handleChange(fieldName, text)}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          {/* Datos de Filiación */}
          <View style={styles.affiliationSection}>
            <Text style={styles.mainSectionTitle}>DATOS DE FILIACIÓN</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellidos y Nombres</Text>
              <TextInput
                style={styles.input}
                value={patient.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Nombre completo"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Sexo</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[styles.radioButton, patient.sex === 'M' && styles.radioSelected]}
                    onPress={() => handleChange('sex', 'M')}
                  >
                    <Text>M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioButton, patient.sex === 'F' && styles.radioSelected]}
                    onPress={() => handleChange('sex', 'F')}
                  >
                    <Text>F</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Edad</Text>
                <TextInput
                  style={styles.input}
                  value={patient.age}
                  onChangeText={(text) => handleChange('age', text)}
                  keyboardType="numeric"
                  placeholder="Edad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Documento</Text>
              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={patient.documentType}
                  onChangeText={(text) => handleChange('documentType', text)}
                  placeholder="Tipo"
                />
                <TextInput
                  style={[styles.input, { flex: 2, marginLeft: 8 }]}
                  value={patient.documentNumber}
                  onChangeText={(text) => handleChange('documentNumber', text)}
                  placeholder="Número"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado Civil</Text>
              <View style={styles.civilStatusGroup}>
                {['Soltero', 'Casado', 'Divorciado', 'Viudo'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.civilStatusButton,
                      patient.civilStatus === status && styles.civilStatusSelected
                    ]}
                    onPress={() => handleChange('civilStatus', status)}
                  >
                    <Text style={[
                      styles.civilStatusText,
                      patient.civilStatus === status && styles.civilStatusTextSelected
                    ]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Domicilio actual</Text>
              <TextInput
                style={styles.input}
                value={patient.currentAddress}
                onChangeText={(text) => handleChange('currentAddress', text)}
                placeholder="Dirección actual"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Domicilio anterior</Text>
              <TextInput
                style={styles.input}
                value={patient.previousAddress}
                onChangeText={(text) => handleChange('previousAddress', text)}
                placeholder="Dirección anterior"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profesión</Text>
              <TextInput
                style={styles.input}
                value={patient.profession}
                onChangeText={(text) => handleChange('profession', text)}
                placeholder="Profesión u ocupación"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Teléfono móvil</Text>
                <TextInput
                  style={styles.input}
                  value={patient.mobilePhone}
                  onChangeText={(text) => handleChange('mobilePhone', text)}
                  placeholder="Celular"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Teléfono fijo</Text>
                <TextInput
                  style={styles.input}
                  value={patient.landlinePhone}
                  onChangeText={(text) => handleChange('landlinePhone', text)}
                  placeholder="Teléfono fijo"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={patient.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Medical History Sections */}
          {renderSection('MOTIVO DE CONSULTA', 'consultReason')}
          {renderSection('ANTECEDENTES HEREDO-FAMILIARES', 'familyHistory')}
          {renderSection('ANTECEDENTES PERSONALES', 'personalHistory')}
          {renderSection('ANTECEDENTES DE LA ENFERMEDAD ACTUAL', 'currentIllnessHistory')}
          {renderSection('ESTADO ACTUAL', 'currentCondition')}
          {renderSection('DIAGNÓSTICO', 'diagnosis')}
          {renderSection('PLAN DE TRATAMIENTO', 'treatmentPlan')}

          {/* Odontograma Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ODONTOGRAMA</Text>
            <View style={styles.photoSection}>
              <View style={styles.photoButtons}>
                <TouchableOpacity 
                  style={styles.photoButton} 
                  onPress={takePicture}
                >
                  <Camera size={20} color="#FFF" />
                  <Text style={styles.photoButtonText}>Tomar foto</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.photoButton} 
                  onPress={pickImage}
                >
                  <ImageIcon size={20} color="#FFF" />
                  <Text style={styles.photoButtonText}>Galería</Text>
                </TouchableOpacity>
              </View>
              
              {patient.photos.length > 0 && (
                <View style={styles.photoGrid}>
                  {patient.photos.map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image source={{ uri: photo }} style={styles.photo} />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => removePhoto(index)}
                      >
                        <X size={16} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            !isFormValid && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  form: {
    gap: 24,
  },
  affiliationSection: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  mainSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioButton: {
    width: 60,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  radioSelected: {
    backgroundColor: '#80CBC4',
    borderColor: '#80CBC4',
  },
  civilStatusGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  civilStatusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  civilStatusSelected: {
    backgroundColor: '#80CBC4',
    borderColor: '#80CBC4',
  },
  civilStatusText: {
    color: '#666',
  },
  civilStatusTextSelected: {
    color: '#FFF',
  },
  photoSection: {
    marginTop: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    backgroundColor: '#80CBC4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#FF4081',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});