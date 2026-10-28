import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingView({ message = 'Cargando...' }: LoadingScreenProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="paw" size={32} color={theme.primary} />
          <View style={styles.plusBadge}>
            <MaterialCommunityIcons name="plus" size={10} color="#FFF" />
          </View>
        </View>

        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={styles.spinner}
        />

        <Text style={styles.brand}>Lumen Vet</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 32,
      alignItems: 'center',
      width: '100%',
      maxWidth: 320,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
    logoContainer: {
      width: 60,
      height: 60,
      backgroundColor: theme.primaryLight,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    plusBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: theme.primary,
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
      color: theme.textPrimary,
      marginTop: 8,
    },
    message: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
  });
