import { Redirect } from 'expo-router';

import LoadingView from '@/components/loading-view';
import { useAuth } from '@/context/AuthContext';

export default function AppIndex() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/home" />;
}
