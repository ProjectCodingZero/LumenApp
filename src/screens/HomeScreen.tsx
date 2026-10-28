import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Spacing, Theme, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useGetPets } from '@/hooks/use-pets';

const CURRENT_OWNER_ID = '123'; // TODO: mover a AuthContext/Store

export default function HomeScreen() {
  const { theme } = useTheme();
  const { data: pets, isLoading, error } = useGetPets();

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>No pudimos cargar tus mascotas</Text>
        <Text style={styles.errorSubtitle}>
          Revisa tu conexión e inténtalo de nuevo.
        </Text>
        {/* <Button title="Reintentar" onPress={refetch} /> */}
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* TODO: <PetList pets={pets} /> */}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: Spacing.lg,
      backgroundColor: theme.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: Typography.size.xxl,
      fontWeight: Typography.weight.bold,
      color: theme.textPrimary,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: Typography.size.base,
      color: theme.textTertiary,
    },
    errorTitle: {
      fontSize: Typography.size.lg,
      fontWeight: Typography.weight.semibold,
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    errorSubtitle: {
      fontSize: Typography.size.base,
      color: theme.textTertiary,
      textAlign: 'center',
    },
  });

