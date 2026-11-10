import { useAuth } from '@/hooks/use-auth';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Grupo de autenticación: redirige a /home si ya hay sesión iniciada */
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
