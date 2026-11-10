import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Tarjeta base con superficie, borde y sombra consistentes */
export function Card({ children, style }: CardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return <View style={[styles.card, style]}>{children}</View>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
    },
  });
