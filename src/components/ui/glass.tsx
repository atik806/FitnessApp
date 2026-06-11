import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type GlassProps = ViewProps & {
  intensity?: 'regular' | 'clear' | 'elevated';
};

export function Glass({ style, intensity = 'regular', ...props }: GlassProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor:
            intensity === 'clear' ? 'transparent' :
            intensity === 'elevated' ? theme.cardBg : theme.glassBg,
          borderColor: theme.glassBorder,
          ...(isWeb && {
            backdropFilter: intensity === 'clear' ? 'blur(4px)' :
              intensity === 'elevated' ? 'blur(20px)' : 'blur(16px)',
            WebkitBackdropFilter: intensity === 'clear' ? 'blur(4px)' :
              intensity === 'elevated' ? 'blur(20px)' : 'blur(16px)',
          }),
          ...(Platform.OS !== 'web' && {
            shadowColor: theme.glassShadow,
            shadowOffset: { width: 0, height: intensity === 'elevated' ? 8 : 2 },
            shadowOpacity: 1,
            shadowRadius: intensity === 'elevated' ? 24 : 12,
            elevation: intensity === 'elevated' ? 6 : 3,
          }),
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: Platform.OS === 'web' ? 0 : StyleSheet.hairlineWidth,
    borderRadius: 20,
  },
});
