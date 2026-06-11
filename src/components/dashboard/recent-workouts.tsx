import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';

import { Glass } from '@/components/ui/glass';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWorkoutStore } from '@/store';
import { WORKOUT_TYPES, type WorkoutType } from '@/types';

function workoutIcon(type: WorkoutType): string {
  return WORKOUT_TYPES.find((w) => w.id === type)?.icon ?? '📝';
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function RecentWorkouts() {
  const theme = useTheme();
  const workouts = useWorkoutStore((s) => s.workouts);
  const recent = workouts.slice(0, 3);

  if (recent.length === 0) {
    return (
      <Animated.View entering={SlideInDown.duration(400).springify()}>
        <Glass intensity="elevated" style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🏋️</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No workouts yet</Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
            Tap the <Text style={{ fontWeight: '700', color: theme.accent }}>+</Text> button below to log your first workout
          </Text>
        </Glass>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.text }]}>Recent Workouts</Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {workouts.length} total
        </Text>
      </View>
      {recent.map((w, i) => (
        <Animated.View key={w.id} entering={FadeInDown.duration(300).delay(i * 80).springify()}>
          <Glass
            intensity="elevated"
            style={[styles.row, i === 0 && styles.rowFirst, { borderColor: i === 0 ? theme.accentLight : theme.glassBorder }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.rowIcon}>{workoutIcon(w.type)}</Text>
            </View>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>
                {WORKOUT_TYPES.find((t) => t.id === w.type)?.label ?? w.type}
              </Text>
              <Text style={[styles.rowMeta, { color: theme.textSecondary }]}>
                {w.duration}min{w.distance ? ` · ${w.distance}km` : ''}
              </Text>
            </View>
            <View style={styles.timeCol}>
              <Text style={[styles.timeText, { color: theme.text }]}>{formatTime(w.date)}</Text>
              <Text style={[styles.timeAgo, { color: theme.textSecondary }]}>{timeAgo(w.date)}</Text>
            </View>
          </Glass>
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.one },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  heading: { fontSize: 18, fontWeight: '700' },
  count: { fontSize: 12, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  rowFirst: { borderWidth: 1 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: { fontSize: 20 },
  rowInfo: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowMeta: { fontSize: 12, fontWeight: '500' },
  timeCol: { alignItems: 'flex-end', gap: 1 },
  timeText: { fontSize: 12, fontWeight: '600' },
  timeAgo: { fontSize: 10, fontWeight: '500' },
  emptyCard: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.one,
  },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
