import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAuth } from '@/hooks/use-auth';
import { useGetPets } from '@/hooks/use-pets';
import { useTheme } from '@/hooks/use-theme';
import { getInitials } from '@/utils/pet-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function ProfileScreen() {
  const { theme, scheme, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { profile, jwtPayload, signOut } = useAuth();
  const { data: pets } = useGetPets();

  const email = jwtPayload?.unique_name ?? 'Sin correo asociado';
  const petCount = pets?.length ?? 0;

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que querés cerrar la sesión actual?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const handleUnavailable = (feature: string) => {
    Alert.alert('Proximamente', `La sección "${feature}" todavía no está disponible en la app.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Volver"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Datos del tutor */}
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profile?.fullName)}</Text>
          </View>
          <Text style={styles.profileName}>{profile?.fullName ?? 'Tutor de Lumen'}</Text>
          <View style={styles.emailRow}>
            <MaterialCommunityIcons name="email-outline" size={14} color={theme.textTertiary} />
            <Text style={styles.emailText}>{email}</Text>
          </View>
        </Card>

        {/* Resumen */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="paw" size={20} color={theme.primary} />
            <Text style={styles.statValue}>{petCount}</Text>
            <Text style={styles.statLabel}>
              {petCount === 1 ? 'mascota registrada' : 'mascotas registradas'}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color={theme.success} />
            <Text style={styles.statValue}>Tutor</Text>
            <Text style={styles.statLabel}>rol de la cuenta</Text>
          </Card>
        </View>

        {/* Ajustes de apariencia */}
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconBox}>
              <MaterialCommunityIcons
                name={scheme === 'dark' ? 'weather-night' : 'weather-sunny'}
                size={20}
                color={theme.primary}
              />
            </View>
            <View style={styles.settingTexts}>
              <Text style={styles.settingTitle}>Modo oscuro</Text>
              <Text style={styles.settingSubtitle}>
                Cambia la apariencia de toda la aplicación.
              </Text>
            </View>
            <Switch
              value={scheme === 'dark'}
              onValueChange={() => {
                void toggleTheme();
              }}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={theme.border}
              accessibilityLabel="Activar modo oscuro"
              accessibilityRole="switch"
            />
          </View>
        </Card>

        {/* Acciones de cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <Card style={styles.settingCard}>
          <SettingRow
            icon="information-outline"
            title="Acerca de Lumen"
            subtitle={`Versión ${APP_VERSION}`}
            onPress={() => handleUnavailable('Acerca de Lumen')}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="file-document-outline"
            title="Términos y condiciones"
            subtitle="Políticas del servicio"
            onPress={() => handleUnavailable('Términos y condiciones')}
          />
        </Card>

        <PrimaryButton
          label="Cerrar Sesión"
          variant="danger"
          icon="logout"
          onPress={handleSignOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: 'information-outline' | 'file-document-outline';
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = createRowStyles(theme);
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} accessibilityRole="button">
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={theme.inactive} />
    </TouchableOpacity>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    headerSpacer: {
      width: 36,
    },
    backButton: {
      padding: 6,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    profileCard: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    avatar: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.primary,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    emailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    emailText: {
      fontSize: 13,
      color: theme.textSecondary,
      marginLeft: 6,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
      marginBottom: 8,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 14,
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginTop: 6,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginTop: 22,
      marginBottom: 10,
    },
    settingCard: {
      padding: 0,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
    },
    settingIconBox: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingTexts: {
      flex: 1,
      marginRight: 10,
    },
    settingTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    settingSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    rowDivider: {
      height: 1,
      backgroundColor: theme.border,
    },
  });

const createRowStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
    },
    iconBox: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    texts: {
      flex: 1,
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    subtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
  });
