import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: keyof Theme;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const { theme } = useTheme();

  const backgroundColor = type ? theme[type] : theme.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

