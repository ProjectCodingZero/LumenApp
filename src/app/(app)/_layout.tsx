import { useAuth } from '@/hooks/use-auth';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

/** Grupo principal: requiere sesión iniciada */
export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
