import { usePetsId } from '@/hooks/use-pets'; // Ajusta la ruta de tu hook para obtener 1 mascota
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string, abc: string }>();
  if (!id) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se proporcionó un ID de mascota.</Text>
      </View>
    );
  }
  // Consumir el hook correspondiente
  const { data: pet, isLoading, error } = usePetsId({petId: id || ''}); // Asegúrate de pasar el ID correcto al hook

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error || !pet) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar la información de la mascota.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado Principal */}
      <View style={styles.headerCard}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.badge}>{pet.specie}</Text>
        <Text style={styles.subTitle}>
          {pet.race} • {pet.gender}
        </Text>
      </View>

      {/* Detalles resumidos basados en ResponsePet */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Edad</Text>
          <Text style={styles.infoValue}>
            {pet.years} a. {pet.months} meses
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Estado</Text>
          <Text style={styles.infoValue}>{pet.status}</Text>
        </View>
      </View>

      {/* Información de Nacimiento */}
      <View style={styles.detailCard}>
        <Text style={styles.infoLabel}>Fecha de Nacimiento</Text>
        <Text style={styles.infoValue}>
          {new Date(pet.birthDate).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  petName: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  badge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginTop: 6,
    color: '#333',
  },
  subTitle: { fontSize: 14, color: '#666', marginTop: 8 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '600', color: '#222' },
});