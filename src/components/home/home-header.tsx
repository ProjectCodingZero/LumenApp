import { Theme } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { getInitials } from '@/utils/pet-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/** Encabezado del home: marca, notificaciones y avatar del usuario */
export function HomeHeader() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <MaterialCommunityIcons name="paw" size={22} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.title}>Lumen</Text>
          <Text style={styles.subtitle}>Atención Veterinaria</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.notificationBtn}
        accessibilityLabel="Notificaciones"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="bell-outline" size={20} color={theme.textPrimary} />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.avatar}
        onPress={() => router.push('/profile')}
        accessibilityLabel="Mi perfil"
        accessibilityRole="button"
      >
        <Text style={styles.avatarText}>{getInitials(profile?.fullName)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    subtitle: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    notificationBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    notificationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.error,
      position: 'absolute',
      top: 8,
      right: 9,
    },
    avatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    avatarText: {
      color: theme.primary,
      fontWeight: 'bold',
      fontSize: 13,
    },
  });
