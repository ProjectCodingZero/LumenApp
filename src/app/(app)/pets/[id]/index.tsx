import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MedicalRecordList } from '@/components/pets/medical-record-list';
import LoadingView from '@/components/loading-view';
import { useTheme } from '@/hooks/use-theme';
import { useDeletePet, useMedicalRecords, usePetsId } from '@/hooks/use-pets';
import { getApiErrorMessage } from '@/services/apiError';
import { formatAge, formatBirthDate, getGenderLabel, getSpecieIconName, getStatusDisplay } from '@/utils/pet-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetDetailScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = typeof id === 'string' ? id : '';

  const { data: pet, isLoading, error, refetch } = usePetsId(petId);
  const { data: medicalRecords, isLoading: isLoadingRecords } = useMedicalRecords(petId);
  const deletePet = useDeletePet();

  if (!petId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No se proporcionó un ID de mascota válido.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return <LoadingView message="Cargando la ficha de tu mascota…" />;
  }

  if (error || !pet) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <MaterialCommunityIcons name="alert-circle-outline" size={44} color={theme.error} />
          <Text style={styles.errorTitle}>No se pudo cargar la mascota</Text>
          <Text style={styles.errorText}>{getApiErrorMessage(error)}</Text>
          <View style={styles.errorActions}>
            <PrimaryButton label="Reintentar" variant="outline" onPress={() => { void refetch(); }} />
            <PrimaryButton label="Volver" variant="secondary" onPress={() => router.back()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const status = getStatusDisplay(pet.status);
  const specieIcon = getSpecieIconName(pet.specie);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar mascota',
      `¿Seguro que querés eliminar a ${pet.name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deletePet.mutate(petId, {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: 'Mascota eliminada',
                  text2: `${pet.name} fue eliminada de tu cuenta.`,
                });
                router.back();
              },
              onError: (deleteError) => {
                Toast.show({
                  type: 'error',
                  text1: 'No se pudo eliminar',
                  text2: getApiErrorMessage(deleteError),
                });
              },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Volver" accessibilityRole="button">
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha de mascota</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Encabezado de la mascota */}
        <Card style={styles.heroCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name={specieIcon} size={40} color={theme.primary} />
          </View>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>
            {pet.specie} • {pet.race}
          </Text>
          <Badge label={status.label} tone={status.tone} style={styles.statusBadge} />
        </Card>

        {/* Datos principales */}
        <View style={styles.infoGrid}>
          <InfoTile label="Edad" value={formatAge(pet.years, pet.months)} icon="calendar-heart" />
          <InfoTile label="Género" value={getGenderLabel(pet.gender)} icon="gender-male-female" />
          <InfoTile label="Nacimiento" value={formatBirthDate(pet.birthDate)} icon="cake-variant-outline" />
          <InfoTile label="Estado" value={status.label} icon="stethoscope" />
        </View>

        {/* Historia clínica */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Historia clínica</Text>
        </View>
        {isLoadingRecords ? (
          <Text style={styles.loadingText}>Cargando historia clínica…</Text>
        ) : (
          <MedicalRecordList records={medicalRecords ?? []} />
        )}

        {/* Acciones */}
        <PrimaryButton
          label="Eliminar mascota"
          variant="danger"
          icon="delete-outline"
          onPress={handleDelete}
          loading={deletePet.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: string; icon: 'calendar-heart' | 'gender-male-female' | 'cake-variant-outline' | 'stethoscope' }) {
  const { theme } = useTheme();
  const styles = createTileStyles(theme);
  return (
    <Card style={styles.tile}>
      <MaterialCommunityIcons name={icon} size={18} color={theme.primary} />
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue} numberOfLines={1}>
        {value}
      </Text>
    </Card>
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
    heroCard: {
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
    petName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    petBreed: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
    statusBadge: {
      marginTop: 10,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 8,
      marginTop: 14,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    loadingText: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      paddingVertical: 16,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    errorTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginTop: 12,
    },
    errorText: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 6,
    },
    errorActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
  });

const createTileStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    tile: {
      width: '48.5%',
      marginBottom: 10,
    },
    tileLabel: {
      fontSize: 11,
      color: theme.textTertiary,
      marginTop: 6,
    },
    tileValue: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: 1,
    },
  });
