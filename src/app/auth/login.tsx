import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({ email, password });
      // Al autenticarse con éxito, el layout raíz redirigirá a la app principal
    } catch (error) {
      Alert.alert('Error de acceso', 'Credenciales inválidas o error en el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Superior con Icono de Ayuda */}
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
            <Text style={styles.brandTitle}>Lumen</Text>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="help-circle-outline" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          {/* Tarjeta Principal de Autenticación */}
          <View style={styles.mainCard}>
            
            {/* Logo Huella */}
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="paw" size={36} color={Colors.dark.primary} />
              <View style={styles.plusBadge}>
                <MaterialCommunityIcons name="plus" size={12} color="#FFF" />
              </View>
            </View>

            <Text style={styles.welcomeTitle}>Bienvenido de nuevo</Text>
            <Text style={styles.welcomeSubtitle}>
              Gestiona la salud y bienestar de tus compañeros de vida
            </Text>

            {/* Pestañas Iniciar Sesión / Registrarse */}
            <View style={styles.tabContainer}>
              <View style={[styles.tab, styles.activeTab]}>
                <Text style={styles.activeTabText}>Iniciar Sesión</Text>
              </View>
              <TouchableOpacity style={styles.tab} onPress={() => router.push('/auth/register')}>
                <Text style={styles.inactiveTabText}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              
              {/* Campo Correo */}
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="email-outline" size={20} color={Colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#A0AEC0"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isSubmitting}
                />
              </View>

              {/* Campo Contraseña */}
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={20} color={Colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#A0AEC0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isSubmitting}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors.dark.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Opciones: Recordar sesión y Olvidé contraseña */}
              <View style={styles.rowBetween}>
                <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <MaterialCommunityIcons name="check" size={12} color="#FFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Recordar mi sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              </View>

              {/* Botón Iniciar Sesión + Biometría */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                      <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </TouchableOpacity>

                {/* Botón Biométrico (Huella/FaceID) */}
                <TouchableOpacity style={styles.biometricButton}>
                  <MaterialCommunityIcons name="fingerprint" size={26} color={Colors.dark.primary} />
                </TouchableOpacity>
              </View>

              {/* Divisor "o continúa con" */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continúa con</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botones Sociales (Google / Apple) */}
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                  <MaterialCommunityIcons name="google" size={20} color="#EA4335" style={{ marginRight: 8 }} />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

          {/* Footer inferior */}
          <View style={styles.footer}>
            <View style={styles.footerRegisterRow}>
              <Text style={styles.footerText}>¿No tienes cuenta aún? </Text>
              <TouchableOpacity onPress={() => router.push('/register' as any)}>
                <Text style={styles.footerLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
                  
            <View style={styles.secureRow}>
              <MaterialCommunityIcons name="shield-check-outline" size={16} color={Colors.dark.primary} style={{ marginRight: 4 }} />
              <Text style={styles.secureText}>ACCESO CLÍNICO SEGURO ENCRIPTADO SSL</Text>
            </View>

            <Text style={styles.copyrightText}>
              © 2026 Lumen Veterinary Care. Todos los derechos reservados.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconButton: {
    padding: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    letterSpacing: 0.5,
  },
  mainCard: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 10,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.dark.primaryLight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  plusBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.dark.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 24,
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.inputBg,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.dark.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: Colors.dark.text,
    fontSize: 14,
  },
  inactiveTabText: {
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark.text,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Colors.dark.inputBg,
  },
  checkboxChecked: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  loginButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  biometricButton: {
    width: 52,
    height: 52,
    backgroundColor: Colors.dark.primaryLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1E7DD',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  dividerText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    paddingHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    backgroundColor: Colors.dark.cardBackground,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerRegisterRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  footerText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    color: Colors.dark.primary,
    fontWeight: 'bold',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  secureText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    letterSpacing: 0.5,
  },
  copyrightText: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});