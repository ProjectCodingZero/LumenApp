import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function RegisterScreen() {
  const [selectedTab, setSelectedTab] = useState<'login' | 'register'>('register');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [mascotas, setMascotas] = useState<number | null>(2);
  const [terminos, setTerminos] = useState(false);

  return (
    <>
      {/* Ocultamos el header nativo de Expo Router para usar el diseño personalizado */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Superior (Flecha, Logo y Ayuda) */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#003b36" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="paw" size={22} color="#00796b" />
            <Text style={styles.logoText}>Lumen</Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Badge de Portal de Tutores */}
        <View style={styles.badgeContainer}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>PORTAL DE TUTORES</Text>
        </View>

        {/* Títulos */}
        <Text style={styles.mainTitle}>Crea tu cuenta de tutor</Text>
        <Text style={styles.subtitle}>
          Comienza a cuidar la salud de tus mascotas con atención de primer nivel y seguimiento continuo.
        </Text>

        {/* Pestañas Iniciar Sesión / Registrarse */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'login' && styles.activeTab]}
            onPress={() => setSelectedTab('login')}
          >
            <Text style={[styles.tabText, selectedTab === 'login' && styles.activeTabText]}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'register' && styles.activeTabRegister]}
            onPress={() => setSelectedTab('register')}
          >
            <Text style={[styles.tabText, selectedTab === 'register' && styles.activeTabRegisterText]}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre y Apellido</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Martina Rossi" 
              placeholderTextColor="#aaa"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="tutor@ejemplo.com" 
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Teléfono celular / WhatsApp</Text>
            <Text style={styles.helperLabel}>Para recordatorios</Text>
          </View>
          <View style={styles.phoneRow}>
            <TouchableOpacity style={styles.countryPicker}>
              <Text style={styles.countryText}>🇦🇷 +54</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            <View style={[styles.inputContainer, { flex: 1, marginBottom: 0 }]}>
              <Ionicons name="phone-portrait-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="1154329876" 
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={setTelefono}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput 
              style={[styles.input, { flex: 1 }]} 
              placeholder="••••••••••••" 
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Ionicons name="eye-outline" size={20} color="#999" style={styles.eyeIcon} />
          </View>
          
          {/* Medidor de seguridad */}
          <View style={styles.securityRow}>
            <View style={[styles.securityBar, styles.securityActive]} />
            <View style={[styles.securityBar, styles.securityActive]} />
            <View style={[styles.securityBar, styles.securityActive]} />
            <View style={[styles.securityBar, styles.securityActive]} />
            <Text style={styles.securityText}>Fuerte</Text>
          </View>
          <Text style={styles.securityHint}>Mínimo 8 caracteres, incluye mayúsculas y un símbolo.</Text>
        </View>

        {/* Selección de mascotas */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>¿Cuántas mascotas tienes en casa? <Text style={styles.optional}>(Opcional)</Text></Text>
          <View style={styles.petsRow}>
            {[
              { count: 1, label: '1 Mascota' },
              { count: 2, label: '2 Mascotas' },
              { count: 3, label: '3 o más' }
            ].map((item) => (
              <TouchableOpacity 
                key={item.count}
                style={[styles.petCard, mascotas === item.count && styles.petCardActive]}
                onPress={() => setMascotas(item.count)}
              >
                <MaterialCommunityIcons 
                  name="paw" 
                  size={18} 
                  color={mascotas === item.count ? '#00796b' : '#666'} 
                />
                <Text style={[styles.petText, mascotas === item.count && styles.petTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Términos y condiciones */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setTerminos(!terminos)} activeOpacity={0.8}>
          <View style={[styles.checkbox, terminos && styles.checkboxChecked]}>
            {terminos && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.termsText}>
            Acepto los <Text style={styles.linkText}>Términos del Servicio</Text> y la <Text style={styles.linkText}>Política de Privacidad</Text> de Lumen Vet.
          </Text>
        </TouchableOpacity>

        {/* Botón principal Crear Cuenta */}
        <TouchableOpacity style={styles.mainButton} activeOpacity={0.85}>
          <Text style={styles.mainButtonText}>Crear Cuenta</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <Text style={styles.separatorText}>O regístrate rápidamente con</Text>

        {/* Botones Sociales (Google y Apple) */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome5 name="google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome5 name="apple" size={20} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Card Informativa Inferior */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#00796b" style={{ marginRight: 8 }} />
            <Text style={styles.infoCardTitle}>Historial clínico digital integrado</Text>
          </View>
          <Text style={styles.infoCardDesc}>
            Tus datos veterinarios y cartillas de vacunación están resguardados con encriptación hospitalaria.
          </Text>
        </View>

        {/* Footer Login */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta registrada? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconButton: {
    padding: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003b36',
    marginLeft: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
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
    backgroundColor: '#137333',
    marginRight: 6,
  },
  badgeText: {
    color: '#137333',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
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
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTabRegister: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#333',
  },
  activeTabRegisterText: {
    color: '#003b36',
  },
  formGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  helperLabel: {
    fontSize: 12,
    color: '#666',
  },
  optional: {
    color: '#888',
    fontWeight: 'normal',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    height: 52,
    justifyContent: 'space-between',
    width: 100,
  },
  countryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  securityBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
  },
  securityActive: {
    backgroundColor: '#00796b',
  },
  securityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00796b',
    marginLeft: 4,
  },
  securityHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  petsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  petCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    gap: 6,
  },
  petCardActive: {
    borderColor: '#00796b',
    backgroundColor: '#e6f4ea',
  },
  petText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  petTextActive: {
    color: '#003b36',
    fontWeight: 'bold',
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
    borderColor: '#00796b',
    borderRadius: 6,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#00796b',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  linkText: {
    color: '#00796b',
    fontWeight: '600',
  },
  mainButton: {
    backgroundColor: '#005b52',
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#f0f4f8',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003b36',
  },
  infoCardDesc: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#005b52',
  },
});