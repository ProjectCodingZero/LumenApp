import { AuthHeader } from '@/components/auth/auth-header';
import { AuthTabContainerView } from '@/components/auth/auth-tab-container-view';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { authService } from '@/services/authService';
import { getApiErrorMessage } from '@/services/apiError';
import { SignUpRequest } from '@/types/authTypes';
import { getPasswordStrength, isNumeric, isValidEmail } from '@/utils/validation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormState {
  name: string;
  surname: string;
  document: string;
  email: string;
  numberPhone: string;
  postalCode: string;
  address: string;
  password: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  surname: '',
  document: '',
  email: '',
  numberPhone: '',
  postalCode: '',
  address: '',
  password: '',
};

const STRENGTH_TONE = ['#DC2626', '#F59E0B', '#F59E0B', '#22C55E', '#22C55E'];

export default function RegisterScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { signIn } = useAuth();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const setField = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Ingresá tu nombre.';
    if (!form.surname.trim()) nextErrors.surname = 'Ingresá tu apellido.';
    if (!form.document.trim()) nextErrors.document = 'Ingresá tu documento.';
    else if (!isNumeric(form.document)) nextErrors.document = 'El documento debe contener solo números.';
    if (!form.email.trim()) nextErrors.email = 'Ingresá tu correo.';
    else if (!isValidEmail(form.email)) nextErrors.email = 'El correo no tiene un formato válido.';
    if (!form.numberPhone.trim()) nextErrors.numberPhone = 'Ingresá tu teléfono.';
    else if (!isNumeric(form.numberPhone)) nextErrors.numberPhone = 'El teléfono debe contener solo números.';
    if (!form.postalCode.trim()) nextErrors.postalCode = 'Ingresá tu código postal.';
    if (form.password.length < 8) nextErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      Toast.show({ type: 'info', text1: 'Revisá el formulario', text2: 'Hay campos con errores.' });
      return;
    }
    if (!acceptedTerms) {
      Toast.show({
        type: 'info',
        text1: 'Términos y condiciones',
        text2: 'Necesitamos que aceptes los términos para continuar.',
      });
      return;
    }

    const request: SignUpRequest = {
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      surname: form.surname.trim(),
      document: form.document.trim(),
      address: form.address.trim() || null,
      postalCode: form.postalCode.trim(),
      numberPhone: form.numberPhone.trim(),
    };

    try {
      setIsSubmitting(true);
      // 1. Crear la cuenta en el backend
      await authService.signUp(request);
      try {
        // 2. Iniciar sesión automáticamente con los mismos datos
        await signIn({ email: request.email, password: request.password });
        Toast.show({
          type: 'success',
          text1: '¡Cuenta creada!',
          text2: 'Bienvenido a Lumen. Sesión iniciada correctamente.',
        });
        router.replace('/home');
      } catch {
        // El registro funcionó pero el login automático no: mandar al login manual.
        Toast.show({
          type: 'info',
          text1: 'Cuenta creada',
          text2: 'Iniciá sesión con tu correo y contraseña.',
        });
        router.replace('/auth/login');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'No se pudo registrar la cuenta',
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

        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>PORTAL DE TUTORES</Text>
        </View>

        <Text style={styles.mainTitle}>Creá tu cuenta de tutor</Text>
        <Text style={styles.subtitle}>
          Comenzá a cuidar la salud de tus mascotas con atención de primer nivel y seguimiento continuo.
        </Text>

        <AuthTabContainerView />

        <FormInput
          label="Nombre"
          icon="account-outline"
          placeholder="Tu nombre"
          value={form.name}
          onChangeText={setField('name')}
          error={errors.name}
          editable={!isSubmitting}
          autoComplete="given-name"
        />
        <FormInput
          label="Apellido"
          icon="account-outline"
          placeholder="Tu apellido"
          value={form.surname}
          onChangeText={setField('surname')}
          error={errors.surname}
          editable={!isSubmitting}
          autoComplete="family-name"
        />
        <FormInput
          label="Documento"
          icon="card-account-details-outline"
          placeholder="Solo números, sin puntos"
          value={form.document}
          onChangeText={setField('document')}
          error={errors.document}
          keyboardType="number-pad"
          editable={!isSubmitting}
        />
        <FormInput
          label="Correo electrónico"
          icon="email-outline"
          placeholder="tutor@ejemplo.com"
          value={form.email}
          onChangeText={setField('email')}
          error={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!isSubmitting}
        />
        <FormInput
          label="Teléfono celular"
          icon="phone-outline"
          placeholder="Solo números, con característica"
          value={form.numberPhone}
          onChangeText={setField('numberPhone')}
          error={errors.numberPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          editable={!isSubmitting}
        />
        <FormInput
          label="Código postal"
          icon="map-marker-outline"
          placeholder="p. ej. 4000"
          value={form.postalCode}
          onChangeText={setField('postalCode')}
          error={errors.postalCode}
          keyboardType="number-pad"
          editable={!isSubmitting}
        />
        <FormInput
          label="Dirección"
          icon="home-map-marker"
          placeholder="Calle y número"
          value={form.address}
          onChangeText={setField('address')}
          optional
          editable={!isSubmitting}
          autoComplete="street-address"
        />
        <FormInput
          label="Contraseña"
          icon="lock-outline"
          placeholder="Mínimo 8 caracteres"
          value={form.password}
          onChangeText={setField('password')}
          error={errors.password}
          secureTextEntry
          autoComplete="new-password"
          editable={!isSubmitting}
        />

        {form.password.length > 0 ? (
          <View style={styles.strengthRow}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.strengthBar,
                  {
                    backgroundColor:
                      strength.score > index ? STRENGTH_TONE[strength.score] : theme.border,
                  },
                ]}
              />
            ))}
            <Text style={styles.strengthText}>{strength.label}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAcceptedTerms((prev) => !prev)}
          activeOpacity={0.8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms }}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
          </View>
          <Text style={styles.termsText}>
            Acepto los{' '}
            <Text style={styles.termsLink}>Términos del Servicio</Text> y la{' '}
            <Text style={styles.termsLink}>Política de Privacidad</Text> de Lumen.
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Crear Cuenta"
          icon="arrow-right"
          onPress={handleRegister}
          loading={isSubmitting}
          disabled={isSubmitting}
        />

        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color={theme.primary} />
            <Text style={styles.infoCardTitle}>Historial clínico digital integrado</Text>
          </View>
          <Text style={styles.infoCardDesc}>
            Tus datos veterinarios y cartillas de vacunación están resguardados de forma segura.
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
      paddingBottom: 40,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primaryLight,
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      marginBottom: 10,
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.primary,
      marginRight: 6,
    },
    badgeText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    mainTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 20,
    },
    strengthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: -6,
      marginBottom: 16,
      gap: 6,
    },
    strengthBar: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },
    strengthText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.textSecondary,
      marginLeft: 4,
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: 16,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1.5,
      borderColor: theme.primary,
      borderRadius: 6,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
    },
    termsText: {
      flex: 1,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    termsLink: {
      color: theme.primary,
      fontWeight: '600',
    },
    infoCard: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 14,
      padding: 16,
      marginTop: 20,
    },
    infoCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    infoCardTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginLeft: 8,
    },
    infoCardDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
    },
  });
