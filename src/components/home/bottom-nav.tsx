import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavItem {
  label: string;
  icon: 'paw' | 'calendar' | 'doctor' | 'account';
  route?: '/home' | '/profile';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Mascotas', icon: 'paw', route: '/home' },
  { label: 'Turnos', icon: 'calendar' },
  { label: 'Especialistas', icon: 'doctor' },
  { label: 'Perfil', icon: 'account', route: '/profile' },
];

/** Barra de navegación inferior. Las secciones sin ruta real marcan próximamente */
export function BottomNav({ onUnavailable }: { onUnavailable: (section: string) => void }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (item: NavItem) => {
    if (item.route) {
      router.push(item.route);
    } else {
      onUnavailable(item.label);
    }
  };

  return (
    <View style={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = Boolean(item.route && pathname === item.route);
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => handlePress(item)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={22}
              color={isActive ? theme.primary : theme.textSecondary}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
            {isActive ? <View style={styles.navDotActive} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    nav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 62,
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    navItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    navText: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 2,
    },
    navTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    navDotActive: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: theme.primary,
      marginTop: 3,
    },
  });
