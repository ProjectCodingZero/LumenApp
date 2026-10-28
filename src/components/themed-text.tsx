import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: keyof Theme;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const colorKey = themeColor ?? (type === 'linkPrimary' ? 'primary' : 'textPrimary');

  return (
    <Text
      style={[
        { color: theme[colorKey] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    smallBold: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '700',
    },
    default: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    },
    title: {
      fontSize: 48,
      fontWeight: '600',
      lineHeight: 52,
      color: theme.textPrimary,
    },
    subtitle: {
      fontSize: 32,
      lineHeight: 44,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    link: {
      lineHeight: 30,
      fontSize: 14,
      color: theme.textSecondary,
    },
    linkPrimary: {
      lineHeight: 30,
      fontSize: 14,
      color: theme.primary,
    },
    code: {
      fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
      fontWeight: Platform.select({ android: '700' }) ?? '500',
      fontSize: 12,
      color: theme.textPrimary,
    },
  });

