import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatAge, formatDate, getAgeFromBirthDate } from '@/utils/pet-display';
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
  /** Fecha mínima seleccionable */
  minimumDate?: Date;
  /** Fecha máxima seleccionable (p. ej. hoy para fechas de nacimiento) */
  maximumDate?: Date;
}

/**
 * Campo de fecha con selector nativo (Material 3 en Android, SwiftUI en iOS).
 * Muestra en vivo la fecha elegida y la edad aproximada, para confirmar que es correcta.
 * En web no hay picker nativo: cae a tres campos numéricos con la misma validación.
 */
export function DateField({
  label,
  value,
  onChange,
  error,
  placeholder = 'Elegí una fecha',
  disabled = false,
  minimumDate,
  maximumDate,
}: DateFieldProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [showPicker, setShowPicker] = useState(false);
  const isWeb = Platform.OS === 'web';
  const hasError = Boolean(error);

  const age = value ? getAgeFromBirthDate(value) : null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {isWeb ? (
        <WebDateInputs
          value={value}
          onChange={onChange}
          disabled={disabled}
          hasError={hasError}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : (
        <TouchableOpacity
          style={[
            styles.field,
            hasError && styles.fieldError,
            showPicker && styles.fieldActive,
            disabled && styles.fieldDisabled,
          ]}
          onPress={() => setShowPicker((prev) => !prev)}
          disabled={disabled}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`${label}${value ? `: ${formatDate(value)}` : ', sin elegir'}`}
          accessibilityState={{ disabled }}
        >
          <MaterialCommunityIcons name="calendar-month" size={20} color={theme.textTertiary} />
          <Text style={value ? styles.valueText : styles.placeholderText} numberOfLines={1}>
            {value ? formatDate(value) : placeholder}
          </Text>
          {value && !disabled ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onChange(null)}
              accessibilityLabel="Borrar fecha"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.inactive} />
            </TouchableOpacity>
          ) : (
            <MaterialCommunityIcons name="chevron-down" size={20} color={theme.inactive} />
          )}
        </TouchableOpacity>
      )}

      {/* Feedback en vivo: confirma que la fecha elegida es la correcta */}
      {hasError && error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : value ? (
        <View style={styles.feedbackRow}>
          <MaterialCommunityIcons name="check-circle" size={14} color={theme.success} />
          <Text style={styles.feedbackText}>
            Edad aproximada: {formatAge(age?.years ?? 0, age?.months ?? 0)}
          </Text>
        </View>
      ) : null}

      {/* Android: diálogo nativo al montarse; iOS: picker embebido */}
      {showPicker && !isWeb && !disabled ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          presentation="dialog"
          accentColor={theme.primary}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={(_event, selected) => {
            onChange(selected);
            if (Platform.OS === 'android') {
              setShowPicker(false);
            }
          }}
          onDismiss={() => setShowPicker(false)}
        />
      ) : null}
    </View>
  );
}

/** Fallback web: tres campos numéricos con validación en vivo */
function WebDateInputs({
  value,
  onChange,
  disabled,
  hasError,
  minimumDate,
  maximumDate,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled: boolean;
  hasError: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const digits = (raw: string, max: number) => raw.replace(/\D/g, '').slice(0, max);

  const update = (nextDay: string, nextMonth: string, nextYear: string) => {
    const parsed = parseBirthDate(nextDay, nextMonth, nextYear, minimumDate, maximumDate);
    onChange(parsed);
  };

  const inputStyle = [styles.webInput, hasError && styles.fieldError, disabled && styles.fieldDisabled];

  return (
    <View style={styles.webRow}>
      <TextInput
        style={[inputStyle, styles.webInputDay]}
        placeholder="Día"
        placeholderTextColor={theme.inactive}
        value={day}
        onChangeText={(raw) => {
          const next = digits(raw, 2);
          setDay(next);
          update(next, month, year);
        }}
        keyboardType="number-pad"
        maxLength={2}
        editable={!disabled}
        accessibilityLabel="Día de nacimiento"
      />
      <TextInput
        style={inputStyle}
        placeholder="Mes"
        placeholderTextColor={theme.inactive}
        value={month}
        onChangeText={(raw) => {
          const next = digits(raw, 2);
          setMonth(next);
          update(day, next, year);
        }}
        keyboardType="number-pad"
        maxLength={2}
        editable={!disabled}
        accessibilityLabel="Mes de nacimiento"
      />
      <TextInput
        style={inputStyle}
        placeholder="Año"
        placeholderTextColor={theme.inactive}
        value={year}
        onChangeText={(raw) => {
          const next = digits(raw, 4);
          setYear(next);
          update(day, month, next);
        }}
        keyboardType="number-pad"
        maxLength={4}
        editable={!disabled}
        accessibilityLabel="Año de nacimiento"
      />
    </View>
  );
}

/** Valida y arma un Date local; null mientras esté incompleta o fuera de rango */
function parseBirthDate(
  day: string,
  month: string,
  year: string,
  minimumDate?: Date,
  maximumDate?: Date
): Date | null {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!d || !m || !y || year.length < 4) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  if (minimumDate && date < minimumDate) return null;
  if (maximumDate && date > maximumDate) return null;
  return date;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: 16,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 6,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundElevated,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 50,
      gap: 10,
    },
    fieldError: {
      borderColor: theme.error,
    },
    fieldActive: {
      borderColor: theme.primary,
    },
    fieldDisabled: {
      opacity: 0.6,
    },
    valueText: {
      flex: 1,
      fontSize: 15,
      color: theme.textPrimary,
    },
    placeholderText: {
      flex: 1,
      fontSize: 15,
      color: theme.inactive,
    },
    clearButton: {
      padding: 2,
    },
    feedbackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
    },
    feedbackText: {
      fontSize: 12,
      color: theme.success,
      fontWeight: '600',
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
    webRow: {
      flexDirection: 'row',
      gap: 10,
    },
    webInput: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      backgroundColor: theme.backgroundElevated,
      textAlign: 'center',
      fontSize: 15,
      color: theme.textPrimary,
      paddingHorizontal: 8,
    },
    webInputDay: {
      flex: 0.8,
    },
  });
