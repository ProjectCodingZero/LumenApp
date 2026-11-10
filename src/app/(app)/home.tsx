import { BottomNav } from '@/components/home/bottom-nav';
import { EmergencyBanner } from '@/components/home/emergency-banner';
import { HomeHeader } from '@/components/home/home-header';
import { PetCarousel } from '@/components/home/pet-carousel';
import { useAuth } from '@/hooks/use-auth';
import { useGetPets } from '@/hooks/use-pets';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { profile } = useAuth();
  const { data: pets, error, isLoading, refetch } = useGetPets();

  const firstName = profile?.fullName?.split(' ')[0] || 'Usuario';

  const handleUnavailableSection = (section: string) => {
    Toast.show({
      type: 'info',
      text1: `${section} próximamente`,
      text2: 'Esta sección todavía no está disponible en la app.',
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HomeHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Saludo */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText} numberOfLines={1}>
              Hola, {firstName}
            </Text>
            <View style={styles.activeTag}>
              <View style={styles.activeDot} />
              <Text style={styles.activeTagText}>Tutor Activo</Text>
            </View>
          </View>
          <Text style={styles.greetingSubtext}>
            Cuidá la salud de tus compañeros de vida con excelencia clínica.
          </Text>
        </View>

        {/* Sección: Mis mascotas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Mis Mascotas
            <Text style={styles.sectionCount}>
              {'  '}
              {pets?.length ?? 0} registrada{pets?.length === 1 ? '' : 's'}
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/pets/new')}
            accessibilityRole="button"
            accessibilityLabel="Agregar mascota"
          >
            <Ionicons name="add" size={16} color={theme.primary} />
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Carrusel con las mascotas reales del usuario */}
        <View style={styles.carouselContainer}>
          <PetCarousel
            pets={pets}
            isLoading={isLoading}
            error={error}
            onRefresh={() => refetch()}
          />
        </View>

        {/* Guardia 24/7 */}
        <EmergencyBanner />

        {/* Espacio para la navegación inferior */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón flotante para registrar mascota */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/pets/new')}
        accessibilityRole="button"
        accessibilityLabel="Registrar nueva mascota"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <BottomNav onUnavailable={handleUnavailableSection} />
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
    },
    greetingSection: {
      marginTop: 8,
      marginBottom: 16,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    greetingText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textPrimary,
      flexShrink: 1,
    },
    activeTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${theme.success}22`,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    activeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.success,
      marginRight: 6,
    },
    activeTagText: {
      fontSize: 12,
      color: theme.success,
      fontWeight: '600',
    },
    greetingSubtext: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    sectionCount: {
      fontWeight: 'normal',
      color: theme.textTertiary,
      fontSize: 13,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    addButtonText: {
      fontSize: 13,
      color: theme.primary,
      fontWeight: '600',
      marginLeft: 4,
    },
    carouselContainer: {
      marginBottom: 16,
    },
    floatingButton: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
  });
