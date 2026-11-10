import { AuthHeader } from '@/components/auth/auth-header';
import { AuthTabContainerView } from '@/components/auth/auth-tab-container-view';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAuth } from '@/hooks/use-auth';
import { getApiErrorMessage } from '@/services/apiError';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Campos incompletos',
        text2: 'Completá tu correo y contraseña para continuar.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({ email: email.trim(), password });
      Toast.show({
        type: 'success',
        text1: '¡Bienvenido de nuevo!',
        text2: 'Sesión iniciada correctamente.',
      });
      router.replace('/home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'No se pudo iniciar sesión',
        text2: getApiErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AuthHeader />

        <View style={styles.mainCard}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoPaw}>🐾</Text>
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Bienvenido de nuevo</Text>
          <Text style={styles.welcomeSubtitle}>
            Gestioná la salud y el bienestar de tus compañeros de vida
          </Text>

          <AuthTabContainerView />

          <FormInput
            label="Correo electrónico"
            icon="email-outline"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!isSubmitting}
          />

          <FormInput
            label="Contraseña"
            icon="lock-outline"
            placeholder="Ingresá tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() =>
              Toast.show({
                type: 'info',
                text1: 'Recuperación de contraseña',
                text2: 'Estará disponible próximamente.',
              })
            }
            accessibilityRole="button"
          >
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <PrimaryButton
            label="Iniciar Sesión"
            icon="arrow-right"
            onPress={handleLogin}
            loading={isSubmitting}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Al iniciar sesión aceptás los términos y condiciones del servicio.
          </Text>
        </View>
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
    container: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    mainCard: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.border,
      marginTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    logoBadge: {
      width: 64,
      height: 64,
      backgroundColor: theme.primaryLight,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoPaw: {
      fontSize: 30,
    },
    welcomeTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 6,
    },
    welcomeSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 10,
      marginBottom: 24,
      lineHeight: 18,
    },
    forgotRow: {
      alignSelf: 'flex-end',
      marginBottom: 20,
      paddingVertical: 4,
    },
    forgotText: {
      fontSize: 13,
      color: theme.primary,
      fontWeight: '600',
    },
    footer: {
      marginTop: 20,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 11,
      color: theme.textTertiary,
      textAlign: 'center',
    },
  });
