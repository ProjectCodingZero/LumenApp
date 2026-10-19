import { getPetsByOwner, Pet } from '@/services/petService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      // Supongamos que el ID del tutor actual (Cooper) es '123'
      const data = await getPetsByOwner('123');
      setPets(data);
    } catch (error) {
      // Manejar error de conexión (mostrar alerta, estado vacío, etc.)
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0E6251" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Mascotas desde el Servidor</Text>
      {/* Renderizar tu lista de mascotas aquí */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1A2E3B' },
});