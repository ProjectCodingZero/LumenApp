import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AuthTab = '/auth/login' | '/auth/register';

const TABS: { route: AuthTab; label: string }[] = [
  { route: '/auth/login', label: 'Iniciar Sesión' },
  { route: '/auth/register', label: 'Registrarse' },
];

/** Pestañas de login/registro. El estado activo se deriva de la ruta actual (sin contexto global) */
export function AuthTabContainerView() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const pathname = usePathname();
  const activeTab: AuthTab = pathname === '/auth/register' ? '/auth/register' : '/auth/login';

  // Animated.Value es un sistema externo mutable: se crea una sola vez con
  // un inicializador perezoso de useState (seguro con el React Compiler).
  const [animValue] = useState(() => new Animated.Value(activeTab === '/auth/register' ? 1 : 0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: activeTab === '/auth/register' ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // Anima un porcentaje de ancho (layout), no soporta driver nativo
    }).start();
  }, [activeTab, animValue]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.activeTabBackground, { transform: [{ translateX }] }]} />
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.route}
          style={styles.tabButton}
          onPress={() => {
            if (activeTab !== tab.route) {
              router.navigate(tab.route);
            }
          }}
          activeOpacity={0.9}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.route }}
        >
          <Text style={activeTab === tab.route ? styles.activeTabText : styles.inactiveTabText}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.backgroundSecondary,
      position: 'relative',
      padding: 4,
      marginBottom: 24,
    },
    tabButton: {
      flex: 1,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    activeTabBackground: {
      position: 'absolute',
      top: 4,
      bottom: 4,
      left: 4,
      width: '50%',
      backgroundColor: theme.backgroundElevated,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    activeTabText: {
      fontWeight: '600',
      color: theme.primary,
      fontSize: 14,
    },
    inactiveTabText: {
      fontWeight: '600',
      color: theme.textSecondary,
      fontSize: 14,
    },
  });
