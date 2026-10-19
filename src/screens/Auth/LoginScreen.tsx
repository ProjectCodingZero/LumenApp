import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      // Aquí harías tu petición POST a tu API de ASP.NET Core
      // const response = await api.post('/auth/login', { email, password });
      // const token = response.data.token;

      // Simulamos un token exitoso recibido del servidor:
      const fakeToken = 'jwt-token-123456';
      
      // Al ejecutar signIn, la app cambia automáticamente al Stack principal (Home)
      signIn(fakeToken);
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas o error de servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lumen Vet</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F8F9FA' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0E6251', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  button: { backgroundColor: '#0E6251', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});