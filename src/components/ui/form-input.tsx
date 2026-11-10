import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { IconName } from './icon-name';

interface FormInputProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  error?: string | null;
  hint?: string | null;
  optional?: boolean;
  /** Estilo extra para el contenedor (p. ej. margen en filas de fecha) */
  wrapperStyle?: StyleProp<ViewStyle>;
}

/** Campo de formulario con etiqueta, ícono y manejo de errores, consistente en toda la app */
export function FormInput({
  label,
  icon,
  error,
  hint,
  optional,
  wrapperStyle,
  style,
  secureTextEntry,
  editable = true,
  ...rest
}: FormInputProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isSecureVisible, setIsSecureVisible] = useState(false);
  const isSecure = Boolean(secureTextEntry);
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {optional ? <Text style={styles.optional}> (opcional)</Text> : null}
        </Text>
      ) : null}
      <View style={[styles.inputWrapper, hasError && styles.inputWrapperError, !editable && styles.inputWrapperDisabled]}>
        {icon ? (
          <MaterialCommunityIcons name={icon} size={20} color={theme.textTertiary} style={styles.icon} />
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.inactive}
          secureTextEntry={isSecure && !isSecureVisible}
          editable={editable}
          {...rest}
        />
        {isSecure ? (
          <TouchableOpacity
            onPress={() => setIsSecureVisible((prev) => !prev)}
            accessibilityLabel={isSecureVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name={isSecureVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {hasError && error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!hasError && hint ? <Text style={styles.hintText}>{hint}</Text> : null}
    </View>
  );
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
    optional: {
      fontWeight: '400',
      color: theme.textTertiary,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundElevated,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 50,
    },
    inputWrapperError: {
      borderColor: theme.error,
    },
    inputWrapperDisabled: {
      opacity: 0.6,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: theme.textPrimary,
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
    hintText: {
      fontSize: 12,
      color: theme.textTertiary,
      marginTop: 4,
    },
  });
