import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/** Encabezado de las pantallas de autenticación: volver + marca Lumen */
export function AuthHeader() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.iconButton}
        accessibilityLabel="Volver"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textPrimary} />
      </TouchableOpacity>
      <View style={styles.brand}>
        <MaterialCommunityIcons name="paw" size={22} color={theme.primary} />
        <Text style={styles.brandText}>Lumen</Text>
      </View>
      <TouchableOpacity style={styles.iconButton} accessibilityLabel="Ayuda" accessibilityRole="button">
        <MaterialCommunityIcons name="help-circle-outline" size={24} color={theme.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      marginBottom: 10,
    },
    iconButton: {
      padding: 6,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    brandText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
      letterSpacing: 0.5,
      marginLeft: 6,
    },
  });
