import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ACTIONS = [
  { id: 'workout', icon: '🏃', label: 'Workout', hint: 'Log', bg: '#DCFCE7', fg: '#22C55E' },
  { id: 'water', icon: '💧', label: 'Water', hint: '+250ml', bg: '#DBEAFE', fg: '#3B82F6' },
  { id: 'sleep', icon: '😴', label: 'Sleep', hint: 'Record', bg: '#F3E8FF', fg: '#A855F7' },
  { id: 'meal', icon: '🍽️', label: 'Meal', hint: '+400cal', bg: '#FEF3C7', fg: '#F59E0B' },
];

interface Props {
  onAction: (action: string) => void;
}

function ActionCard({
  action,
  onPress,
}: {
  action: (typeof ACTIONS)[number];
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <Animated.View style={animatedStyle}>
        <View style={[styles.card, { backgroundColor: action.bg }]}>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
            <Text style={styles.icon}>{action.icon}</Text>
          </View>
          <Text style={[styles.label, { color: action.fg }]}>{action.label}</Text>
          <Text style={[styles.hint, { color: action.fg }]}>{action.hint}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function QuickActions({ onAction }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {ACTIONS.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          onPress={() => onAction(action.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: Spacing.two },
  card: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.three,
    paddingTop: Spacing.four,
    borderRadius: 20,
    gap: 6,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -Spacing.three,
  },
  icon: { fontSize: 24 },
  label: { fontSize: 13, fontWeight: '700' },
  hint: { fontSize: 10, fontWeight: '600', marginTop: -2 },
});
