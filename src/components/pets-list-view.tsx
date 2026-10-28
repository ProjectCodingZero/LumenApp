import { Theme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
interface PetsListViewProps {
  theme: Theme;
  pets: any;
  isLoading: boolean;
  error: any;
}
export default function PetsListView({ theme, pets, isLoading, error }: PetsListViewProps) {
  const styles = getStyles(theme);
  // 1. Manejo de carga
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 2. Manejo de error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Hubo un error al cargar los datos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Mascotas</Text>

      {/* 3. Validación: Si el array está vacío o no existe */}
      {(!pets || pets.length === 0) ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="paw-off" size={48} color="#A0AEC0" />
          <Text style={styles.emptyTitle}>No hay elementos</Text>
          <Text style={styles.emptySubtitle}>Aún no has registrado ningún compañero.</Text>
        </View>
      ) : (
        /* 4. Si hay elementos, muestra el bucle con FlatList */
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petBreed}>{item.race}</Text>
              <Text style={styles.petBreed}>Estado: {item.status}</Text>
              <Text style={styles.petBreed}>Género: {item.genderType}</Text>
              <Text style={styles.petBreed}>Edad: Años:{item.years} Meses:{item.months}</Text>
              <Text style={styles.petBreed}>Edad: Años:{item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const getStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  
  // Estilos para cuando está vacío
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Estilos de las tarjetas
  card: { padding: 16, backgroundColor: '#FFF', borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  petName: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  petBreed: { fontSize: 13, color: '#718096' },
  errorText: { color: '#E53E3E', fontSize: 14 },
});