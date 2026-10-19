import { AuthProvider } from '@/context/AuthContext';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useAuth } from '@/context/AuthContext';
SplashScreen.preventAutoHideAsync();
/*
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Revisa si la ruta actual está dentro del grupo privado (app)
    const inAuthGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAuthGroup) {
      // Si NO está autenticado y está en área privada -> mandar a login
      router.replace('/login' as any);
    } else if (isAuthenticated && !inAuthGroup) {
      // Si SÍ está autenticado y está fuera de área privada -> mandar a (app)
      router.replace('/(app)' as any);
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0E6251" />
      </View>
    );
  }
  return (<Stack screenOptions={{ headerShown: false }} />);
}
*/
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </AuthProvider>
    </ThemeProvider>
  );
}