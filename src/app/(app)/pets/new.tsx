import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useTheme } from '@/hooks/use-theme';
import { useRacesBySpecie, useSpecies } from '@/hooks/use-species';
import { useCreatePet } from '@/hooks/use-pets';
import { getApiErrorMessage } from '@/services/apiError';
import { GenderType, PetStatus } from '@/types/petTypes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const GENDERS: { value: GenderType; label: string; icon: 'gender-male' | 'gender-female' | 'gender-male-female' }[] = [
  { value: 'Male', label: 'Macho', icon: 'gender-male' },
  { value: 'Female', label: 'Hembra', icon: 'gender-female' },
  { value: 'Other', label: 'Otro', icon: 'gender-male-female' },
];

function buildBirthDate(day: string, month: string, year: string): string | null {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!d || !m || !y) return null;
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d ||
    y < 1900 ||
    date.getTime() > Date.now()
  ) {
    return null;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}`;
}

export default function NewPetScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  const { data: species, isLoading: isLoadingSpecies } = useSpecies();
  const [specieId, setSpecieId] = useState('');
  const { data: specieRaces, isLoading: isLoadingRaces } = useRacesBySpecie(specieId);

  const [name, setName] = useState('');
  const [raceId, setRaceId] = useState('');
  const [gender, setGender] = useState<GenderType | null>(null);
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string; race?: string; gender?: string }>({});

  const createPet = useCreatePet();

  const races = useMemo(() => specieRaces?.races ?? [], [specieRaces]);

  const selectSpecie = (id: string) => {
    setSpecieId(id);
    setRaceId('');
    setErrors((prev) => ({ ...prev, race: undefined }));
  };

  const handleSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Ingresá el nombre de tu mascota.';
    if (!specieId) nextErrors.race = 'Elegí una especie y una raza.';
    else if (!raceId) nextErrors.race = 'Elegí la raza de tu mascota.';
    if (!gender) nextErrors.gender = 'Elegí el género de tu mascota.';
    const birthDate = buildBirthDate(birthDay, birthMonth, birthYear);
    if (!birthDate) nextErrors.birthDate = 'Ingresá una fecha de nacimiento válida.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      Toast.show({ type: 'info', text1: 'Revisá el formulario', text2: 'Hay campos incompletos o con errores.' });
      return;
    }

    // A partir de aquí los valores validados no son nulos (narrowing para TypeScript).
    if (!birthDate || !gender || !raceId) return;

    createPet.mutate(
      {
        name: name.trim(),
        birthDate,
        status: 'Alive' as PetStatus,
        raceId,
        gender,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: '¡Mascota registrada!',
            text2: `${name.trim()} ya forma parte de tu familia en Lumen.`,
          });
          router.back();
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: 'No se pudo registrar la mascota',
            text2: getApiErrorMessage(error),
          });
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Volver" accessibilityRole="button">
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar mascota</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <FormInput
          label="Nombre"
          icon="paw"
          placeholder="¿Cómo se llama?"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
        />

        {/* Especie */}
        <Text style={styles.label}>Especie</Text>
        {isLoadingSpecies ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={theme.primary} />
            <Text style={styles.loadingText}>Cargando especies…</Text>
          </View>
        ) : (
          <View style={styles.chipWrap}>
            {(species ?? []).map((specie) => (
              <TouchableOpacity
                key={specie.id}
                style={[styles.chip, specieId === specie.id && styles.chipActive]}
                onPress={() => selectSpecie(specie.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: specieId === specie.id }}
              >
                <MaterialCommunityIcons
                  name={specieId === specie.id ? 'check-circle' : 'circle-outline'}
                  size={16}
                  color={specieId === specie.id ? theme.primary : theme.textTertiary}
                />
                <Text style={[styles.chipText, specieId === specie.id && styles.chipTextActive]}>
                  {specie.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Raza */}
        <Text style={styles.label}>Raza</Text>
        {specieId ? (
          isLoadingRaces ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={theme.primary} />
              <Text style={styles.loadingText}>Cargando razas…</Text>
            </View>
          ) : (
            <View style={styles.chipWrap}>
              {races.map((race) => (
                <TouchableOpacity
                  key={race.id}
                  style={[styles.chip, raceId === race.id && styles.chipActive]}
                  onPress={() => {
                    setRaceId(race.id);
                    setErrors((prev) => ({ ...prev, race: undefined }));
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: raceId === race.id }}
                >
                  <MaterialCommunityIcons
                    name={raceId === race.id ? 'check-circle' : 'circle-outline'}
                    size={16}
                    color={raceId === race.id ? theme.primary : theme.textTertiary}
                  />
                  <Text style={[styles.chipText, raceId === race.id && styles.chipTextActive]}>
                    {race.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )
        ) : (
          <Text style={styles.hintText}>Primero elegí una especie para ver sus razas.</Text>
        )}
        {errors.race ? <Text style={styles.errorText}>{errors.race}</Text> : null}

        {/* Fecha de nacimiento */}
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <View style={styles.dateRow}>
          <FormInput
            placeholder="Día"
            value={birthDay}
            onChangeText={(value) => {
              setBirthDay(value.replace(/\D/g, '').slice(0, 2));
              setErrors((prev) => ({ ...prev, birthDate: undefined }));
            }}
            keyboardType="number-pad"
            maxLength={2}
            style={styles.dayInput}
            wrapperStyle={styles.dateInput}
            error={null}
          />
          <FormInput
            placeholder="Mes"
            value={birthMonth}
            onChangeText={(value) => {
              setBirthMonth(value.replace(/\D/g, '').slice(0, 2));
              setErrors((prev) => ({ ...prev, birthDate: undefined }));
            }}
            keyboardType="number-pad"
            maxLength={2}
            style={styles.dayInput}
            wrapperStyle={styles.dateInput}
            error={null}
          />
          <FormInput
            placeholder="Año"
            value={birthYear}
            onChangeText={(value) => {
              setBirthYear(value.replace(/\D/g, '').slice(0, 4));
              setErrors((prev) => ({ ...prev, birthDate: undefined }));
            }}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.yearInput}
            wrapperStyle={styles.dateInput}
            error={null}
          />
        </View>
        {errors.birthDate ? <Text style={styles.errorText}>{errors.birthDate}</Text> : null}

        {/* Género */}
        <Text style={styles.label}>Género</Text>
        <View style={styles.chipWrap}>
          {GENDERS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, gender === option.value && styles.chipActive]}
              onPress={() => {
                setGender(option.value);
                setErrors((prev) => ({ ...prev, gender: undefined }));
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: gender === option.value }}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={16}
                color={gender === option.value ? theme.primary : theme.textTertiary}
              />
              <Text style={[styles.chipText, gender === option.value && styles.chipTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

        <PrimaryButton
          label="Registrar Mascota"
          icon="check"
          onPress={handleSubmit}
          loading={createPet.isPending}
          disabled={createPet.isPending}
        />
      </ScrollView>
    </SafeAreaView>
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
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8,
      marginTop: 4,
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingVertical: 9,
      paddingHorizontal: 12,
      backgroundColor: theme.surface,
    },
    chipActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryLight,
    },
    chipText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    chipTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    dateRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    dateInput: {
      marginBottom: 0,
    },
    dayInput: {
      textAlign: 'center',
    },
    yearInput: {
      textAlign: 'center',
    },
    hintText: {
      fontSize: 13,
      color: theme.textTertiary,
      marginBottom: 16,
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      marginTop: -10,
      marginBottom: 12,
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
    },
    loadingText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
  });
