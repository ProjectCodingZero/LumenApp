import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors, darkColors, getColors, lightColors, Theme, type ColorScheme } from '@/constants/theme';

type ThemeContextType = {
  scheme: ColorScheme;
  isDark: boolean;
  theme: Theme;
  setScheme: (scheme: ColorScheme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  resetToSystem: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const THEME_STORAGE_KEY = '@lumen/theme-scheme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemColorScheme();
  const [scheme, setSchemeState] = useState<ColorScheme>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setSchemeState(stored);
        } else if (systemScheme === 'dark') {
          setSchemeState('dark');
        } else {
          setSchemeState('light');
        }
      } catch (error) {
        if (systemScheme === 'dark') {
          setSchemeState('dark');
        } else {
          setSchemeState('light');
        }
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, [systemScheme]);

  const setScheme = async (newScheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme);
      setSchemeState(newScheme);
    } catch (error) {
      setSchemeState(newScheme);
    }
  };

  const toggleTheme = async () => {
    const newScheme = scheme === 'dark' ? 'light' : 'dark';
    await setScheme(newScheme);
  };

  const resetToSystem = async () => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      if (systemScheme === 'dark') {
        setSchemeState('dark');
      } else {
        setSchemeState('light');
      }
    } catch (error) {
      if (systemScheme === 'dark') {
        setSchemeState('dark');
      } else {
        setSchemeState('light');
      }
    }
  };

  const theme = useMemo(() => getColors(scheme), [scheme]);
  const isDark = scheme === 'dark';

  const value = useMemo(
    () => ({
      scheme,
      isDark,
      theme,
      setScheme,
      toggleTheme,
      resetToSystem,
    }),
    [scheme, isDark, theme]
  );

  if (!isReady) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export { Colors, darkColors, getColors, lightColors, type ColorScheme, type Theme };

