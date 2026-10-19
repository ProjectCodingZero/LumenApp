// src/components/ui/LoadingScreen.tsx
import { Colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingView({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="paw" size={32} color={Colors.dark.primary} />
          <View style={styles.plusBadge}>
            <MaterialCommunityIcons name="plus" size={10} color="#FFF" />
          </View>
        </View>

        <ActivityIndicator size="large" color={Colors.dark.primary} style={styles.spinner} />
        
        <Text style={styles.brand}>Lumen Vet</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: Colors.dark.primaryLight,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  plusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.dark.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginVertical: 12,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 8,
  },
  message: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});