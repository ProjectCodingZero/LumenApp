import { Badge } from '@/components/ui/badge';
import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ResponsePetMinimun } from '@/types/petTypes';
import { formatAge, getSpecieIconName, getStatusDisplay } from '@/utils/pet-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PetCardProps {
  pet: ResponsePetMinimun;
  width?: number;
}

/** Tarjeta resumida de una mascota (usada en el carrusel del home) */
export function PetCard({ pet, width = 150 }: PetCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const status = getStatusDisplay(pet.status);
  const specieIcon = getSpecieIconName(pet.specie);

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name={specieIcon} size={28} color={theme.primary} />
        </View>
        <Badge label={status.label} tone={status.tone} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {pet.name}
      </Text>
      <Text style={styles.breed} numberOfLines={1}>
        {pet.specie} • {pet.race}
      </Text>
      <Text style={styles.age}>{formatAge(pet.years, pet.months)}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      marginRight: 12,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    breed: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    age: {
      fontSize: 11,
      color: theme.textTertiary,
      marginTop: 4,
    },
  });
