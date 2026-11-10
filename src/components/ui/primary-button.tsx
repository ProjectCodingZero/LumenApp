import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type TextStyle, type ViewStyle } from 'react-native';

import { IconName } from './icon-name';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
}

interface VariantStyle {
  container: ViewStyle;
  label: TextStyle;
}

/** Botón principal de acción, consistente en toda la app */
export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
}: PrimaryButtonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const variants = createVariantStyles(theme);
  const variantStyle = variants[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, variantStyle.container, isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.label.color} />
      ) : (
        <>
          <Text style={[styles.text, variantStyle.label]}>{label}</Text>
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={variantStyle.label.color}
              style={styles.icon}
            />
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 52,
      borderRadius: 14,
      paddingHorizontal: 20,
    },
    text: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    icon: {
      marginLeft: 8,
    },
    disabled: {
      opacity: 0.55,
    },
  });

/** Colores por variante. Objeto tipado aparte: StyleSheet.create no admite objetos anidados. */
const createVariantStyles = (theme: Theme): Record<ButtonVariant, VariantStyle> => ({
  primary: {
    container: { backgroundColor: theme.primary },
    label: { color: '#FFFFFF' },
  },
  secondary: {
    container: { backgroundColor: theme.backgroundSecondary },
    label: { color: theme.textPrimary },
  },
  danger: {
    container: { backgroundColor: theme.error },
    label: { color: '#FFFFFF' },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border },
    label: { color: theme.textPrimary },
  },
});
