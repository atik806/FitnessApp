import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#F5F7FA',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E4E8EF',
    textSecondary: '#8E8E93',
    accent: '#22C55E',
    accentLight: '#DCFCE7',
    warning: '#F59E0B',
    error: '#EF4444',
    glassBg: 'rgba(255, 255, 255, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    glassShadow: 'rgba(0, 0, 0, 0.05)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    heroBg: '#E8F5E9',
    gradientStart: '#22C55E',
    gradientEnd: '#16A34A',
    ringTrack: '#E4E8EF',
  },
  dark: {
    text: '#F1F5F9',
    background: '#0F172A',
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
    textSecondary: '#94A3B8',
    accent: '#4ADE80',
    accentLight: '#052E16',
    warning: '#FBBF24',
    error: '#F87171',
    glassBg: 'rgba(15, 23, 42, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.06)',
    glassShadow: 'rgba(0, 0, 0, 0.4)',
    cardBg: 'rgba(30, 41, 59, 0.85)',
    heroBg: '#052E16',
    gradientStart: '#4ADE80',
    gradientEnd: '#22C55E',
    ringTrack: '#1E293B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
