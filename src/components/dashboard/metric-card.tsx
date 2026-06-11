import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  icon: string;
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color?: string;
}

export function MetricCard({ icon, label, value, goal, unit = '', color }: Props) {
  const theme = useTheme();
  const progress = goal > 0 ? Math.min(value / goal, 1) : 0;
  const accent = color ?? theme.accent;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress, { damping: 20, stiffness: 100 });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
      <View style={styles.top}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: theme.text }]}>
        {formatValue(value)}
        <Text style={[styles.unit, { color: theme.textSecondary }]}> {unit}</Text>
      </Text>
      <View style={[styles.barTrack, { backgroundColor: theme.glassBorder }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: accent }, barStyle]} />
      </View>
      <Text style={[styles.goal, { color: theme.textSecondary }]}>
        {formatValue(goal)} {unit}
      </Text>
    </View>
  );
}

function formatValue(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return Math.round(n).toString();
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.two + 2,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: { fontSize: 14 },
  label: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
  unit: { fontSize: 12, fontWeight: '600' },
  barTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  goal: { fontSize: 9, fontWeight: '500' },
});
