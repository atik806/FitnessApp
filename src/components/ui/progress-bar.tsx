import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

interface Props {
  progress: number;
  height?: number;
  color?: string;
}

export function ProgressBar({ progress, height = 6, color }: Props) {
  const theme = useTheme();
  const clamped = Math.min(Math.max(progress, 0), 1);
  const barColor = color ?? theme.accent;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(`${clamped * 100}%`, { stiffness: 80, damping: 12 }),
  }));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: theme.ringTrack }]}>
      <Animated.View
        style={[
          styles.fill,
          { height, borderRadius: height / 2, backgroundColor: barColor },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden', width: '100%' },
  fill: { position: 'absolute', left: 0, top: 0 },
});
