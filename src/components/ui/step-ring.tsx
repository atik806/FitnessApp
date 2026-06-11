import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

interface Props {
  value: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export function StepRing({ value, goal, size = 180, strokeWidth = 12 }: Props) {
  const theme = useTheme();
  const progress = goal > 0 ? Math.min(value / goal, 1) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.ringTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.value, { color: theme.text }]}>
          {value >= 1000
            ? (value / 1000).toFixed(1).replace('.0', '')
            : Math.round(value).toString()}
        </Text>
        <Text style={[styles.unit, { color: theme.textSecondary }]}>
          {value >= 1000 ? 'k' : ''} steps
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 42,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: -4,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: -2,
  },
});
