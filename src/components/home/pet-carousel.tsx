import { PetCard } from '@/components/home/pet-card';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ResponsePetMinimun } from '@/types/petTypes';
import { getApiErrorMessage } from '@/services/apiError';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetCarouselProps {
  pets: ResponsePetMinimun[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRefresh?: () => void;
}

/** Carrusel horizontal de mascotas con estados de carga, error y vacío */
export function PetCarousel({ pets, isLoading, error, onRefresh }: PetCarouselProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={[styles.stateContainer, styles.stateRow]} testID="pet-carousel-loading">
        <ActivityIndicator color={theme.primary} />
        <Text style={styles.stateText}>Cargando mascotas…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color={theme.error} />
        <Text style={styles.stateTitle}>No se pudieron cargar las mascotas</Text>
        <Text style={styles.stateText}>{getApiErrorMessage(error)}</Text>
        {onRefresh ? (
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh} accessibilityRole="button">
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <TouchableOpacity
        style={styles.emptyCard}
        onPress={() => router.push('/pets/new')}
        accessibilityRole="button"
        accessibilityLabel="Registrar primera mascota"
      >
        <View style={styles.emptyAvatar}>
          <MaterialCommunityIcons name="paw" size={32} color={theme.primary} />
        </View>
        <Text style={styles.stateTitle}>Todavía no registraste mascotas</Text>
        <Text style={styles.stateText}>Tocá aquí para dar de alta a tu primer compañero.</Text>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={pets}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/pets/[id]', params: { id: item.id } })}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalles de ${item.name}`}
        >
          <PetCard pet={item} />
        </TouchableOpacity>
      )}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={theme.primary} />
        ) : undefined
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    listContent: {
      paddingRight: 16,
    },
    stateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 16,
    },
    stateRow: {
      flexDirection: 'row',
      gap: 10,
    },
    stateTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: 10,
    },
    stateText: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
      paddingHorizontal: 20,
    },
    retryButton: {
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: theme.primaryLight,
    },
    retryText: {
      color: theme.primary,
      fontWeight: '600',
    },
    emptyCard: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 28,
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      borderStyle: 'dashed',
      marginRight: 16,
    },
    emptyAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
  });
