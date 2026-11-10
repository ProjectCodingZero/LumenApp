import { AuthProvider } from '@/context/AuthContext';
import { Theme, ThemeProvider, useThemeContext } from '@/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Toast from 'react-native-toast-message';
import { StyleSheet, Text, View } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

type ToastTone = 'success' | 'error' | 'info';

interface ToastRenderProps {
  text1?: string;
  text2?: string;
}

function ThemedToast({ text1, text2, tone }: ToastRenderProps & { tone: ToastTone }) {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const toneStyle = styles[tone];
  const icon = tone === 'success' ? 'check-circle' : tone === 'error' ? 'alert-circle' : 'information';

  return (
    <View style={[styles.toast, { borderLeftColor: toneStyle.color }]}>
      <MaterialCommunityIcons name={icon} size={22} color={toneStyle.color} />
      <View style={styles.toastTexts}>
        {text1 ? <Text style={[styles.toastTitle, { color: theme.textPrimary }]}>{text1}</Text> : null}
        {text2 ? <Text style={[styles.toastMessage, { color: theme.textSecondary }]}>{text2}</Text> : null}
      </View>
    </View>
  );
}

function AppShell() {
  const { scheme } = useThemeContext();

  const toastConfig: Record<string, (props: ToastRenderProps) => React.ReactNode> = {
    success: (props) => <ThemedToast {...props} tone="success" />,
    error: (props) => <ThemedToast {...props} tone="error" />,
    info: (props) => <ThemedToast {...props} tone="info" />,
  };

  return (
    <AuthProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Slot />
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const createStyles = (theme: Theme) => {
  const tones: Record<ToastTone, { color: string }> = {
    success: { color: theme.success },
    error: { color: theme.error },
    info: { color: theme.primary },
  };
  const base = StyleSheet.create({
    toast: {
      width: '92%',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: theme.surfaceElevated,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    toastTexts: {
      flex: 1,
      marginLeft: 10,
    },
    toastTitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    toastMessage: {
      fontSize: 12,
      marginTop: 2,
    },
  });
  return { ...base, ...tones };
};
