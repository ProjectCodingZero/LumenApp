import { EMERGENCY_PHONE } from '@/constants/config';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/** Banner de guardia 24/7. Llama al número configurado si existe */
export function EmergencyBanner() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCall = () => {
    if (EMERGENCY_PHONE) {
      Linking.openURL(`tel:${EMERGENCY_PHONE}`).catch(() => {});
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name="phone-in-talk" size={22} color={theme.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>¿Urgencias 24/7?</Text>
        <Text style={styles.subtitle}>Comunicate de inmediato con la guardia de Lumen.</Text>
      </View>
      {EMERGENCY_PHONE ? (
        <TouchableOpacity style={styles.callButton} onPress={handleCall} accessibilityRole="button">
          <Text style={styles.callText}>Llamar</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.soonText}>Guardia disponible en sede</Text>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      marginLeft: 12,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    subtitle: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 1,
    },
    callButton: {
      backgroundColor: `${theme.error}22`,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },
    callText: {
      fontSize: 12,
      color: theme.error,
      fontWeight: 'bold',
    },
    soonText: {
      fontSize: 11,
      color: theme.textTertiary,
      textAlign: 'right',
      maxWidth: 90,
    },
  });
