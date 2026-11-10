import { Theme } from '@/constants/theme';
import { BadgeTone } from '@/utils/pet-display';
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
}

type ToneStyle = { backgroundColor: string; color: string };

/** Etiqueta pequeña de estado (colores semánticos del tema) */
export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.badge, styles.tones[tone], style]}>
      <Text style={[styles.text, { color: styles.tones[tone].color }]}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) => {
  const tones: Record<BadgeTone, ToneStyle> = {
    success: { backgroundColor: `${theme.success}22`, color: theme.success },
    warning: { backgroundColor: `${theme.warning}22`, color: theme.warning },
    error: { backgroundColor: `${theme.error}22`, color: theme.error },
    info: { backgroundColor: `${theme.accent}22`, color: theme.accent },
    neutral: { backgroundColor: theme.backgroundSecondary, color: theme.textSecondary },
  };
  const base = StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 999,
    },
    text: {
      fontSize: 11,
      fontWeight: '600',
    },
  });
  return { ...base, tones };
};
