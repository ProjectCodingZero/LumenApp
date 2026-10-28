import { ColorScheme as ColorSchemeNative } from "react-native-screens";
export type ColorScheme = ColorSchemeNative;
export interface Theme{
  text: string,
  primary: string,
  primaryLight: string,
  background: string,
  surface: string,
  surfaceElevated: string,
  borderSubtle: string,
  textPrimary: string,
  textSecondary: string,
  textTertiary: string,
  border: string,
  success: string,
  warning: string,
  error: string,
  inactive: string,
  accent: string,
  overlay: string

}
export const lightColors: Theme = {
  text: '#1A2E3B',
  primary: '#009688',
  primaryLight: '#E6F4F3',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  borderSubtle: '#F1F5F9',
  textPrimary: '#1A2E3B',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  border: '#E2E8F0',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#DC2626',
  inactive: '#94A3B8',
  accent: '#22D3EE',
  overlay: 'rgba(15, 23, 42, 0.4)',
} as const;

export const darkColors: Theme = {
  text: '#F8FAFC',
  primary: '#00A896',
  primaryLight: 'rgba(0, 168, 150, 0.18)',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#273449',
  borderSubtle: 'rgba(51, 65, 85, 0.7)',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  border: '#334155',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  inactive: '#475569',
  accent: '#22D3EE',
  overlay: 'rgba(15, 23, 42, 0.8)',
} as const;



export const Colors: Record<ColorScheme, Theme> = {
  light: lightColors,
  dark: darkColors,
};
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  one: 4,
  half: 2,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 24,
  pill: 999,
} as const;

export const Typography = {
  size: {
    xs: 10,
    sm: 11,
    md: 12,
    base: 13,
    lg: 14,
    xl: 16,
    xxl: 18,
    h1: 22,
    h2: 32,
    h3: 48,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const MaxContentWidth = 1024;
export const BottomTabInset = 80;


export function getColors(scheme: ColorScheme | null | undefined): Theme {
  if (scheme === 'dark') return darkColors;
  if (scheme === 'light') return lightColors;
  return lightColors;
}
