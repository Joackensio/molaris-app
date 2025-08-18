import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Search, User, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import AppContext from '@/context/AppContext';
import { Patient } from '@/types/patient';

export default function SearchScreen() {
  const { patients, refreshPatients } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [patients]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredPatients(patients);
      return;
    }
    
    const filtered = patients.filter(patient => {
      const searchLower = text.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchLower) ||
        (patient.mobilePhone && patient.mobilePhone.includes(text)) ||
        (patient.landlinePhone && patient.landlinePhone.includes(text))
      );
    });
    
    setFilteredPatients(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPatients();
    setRefreshing(false);
  };

  const navigateToPatientDetail = (patientId: string) => {
    router.push(`/patient/${patientId}`);
  };

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigateToPatientDetail(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientPhone}>{item.mobilePhone || item.landlinePhone}</Text>
        <Text style={styles.patientDate}>
          Registrado: {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <ChevronRight size={20} color="#666" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <User size={60} color="#CCC" />
      <Text style={styles.emptyStateTitle}>No hay pacientes</Text>
      <Text style={styles.emptyStateSubtitle}>
        Agrega pacientes para verlos aquí
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o teléfono"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {patients.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Resultados' : 'Todos los pacientes'}
          </Text>
          <FlatList
            data={filteredPatients}
            keyExtractor={(item) => item.id}
            renderItem={renderPatientItem}
            contentContainerStyle={styles.patientList}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>
                No se encontraron resultados
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FF4081']}
                tintColor="#FF4081"
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchContainer: {
    backgroundColor: '#FF4081',
    padding: 16,
    paddingBottom: 24,
  },
  searchInputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  patientList: {
    paddingBottom: 16,
  },
  patientCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  patientPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  patientDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
});