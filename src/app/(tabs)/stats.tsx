import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/ui/glass';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { useTheme } from '@/hooks/use-theme';
import { useActivityStore, useWorkoutStore } from '@/store';

type Period = 'week' | 'month';

export default function StatsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const resp = useResponsive();
  const [period, setPeriod] = useState<Period>('week');

  const getWeekHistory = useActivityStore((s) => s.getWeekHistory);
  const workouts = useWorkoutStore((s) => s.workouts);

  const weekData = useMemo(() => getWeekHistory(), [getWeekHistory]);

  const totals = useMemo(() => {
    const w = weekData;
    return {
      steps: w.reduce((a, b) => a + b.steps, 0),
      calories: w.reduce((a, b) => a + b.calories, 0),
      water: parseFloat(w.reduce((a, b) => a + b.water, 0).toFixed(1)),
      activeMinutes: w.reduce((a, b) => a + b.activeMinutes, 0),
    };
  }, [weekData]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasData = weekData.some((d) => d.steps > 0 || d.calories > 0 || d.water > 0 || d.activeMinutes > 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: 120, paddingHorizontal: resp.contentPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <SymbolView name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={18} weight="bold" tintColor={theme.accent} />
            <Text style={[styles.backText, { color: theme.accent }]}>Dashboard</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.text }]}>Stats</Text>
          <View style={styles.toggleRow}>
            <Pressable onPress={() => setPeriod('week')}>
              <Glass intensity={period === 'week' ? 'elevated' : 'clear'} style={[styles.toggle, period === 'week' && { borderColor: theme.accent, borderWidth: 1 }]}>
                <Text style={[styles.toggleText, { color: period === 'week' ? theme.accent : theme.textSecondary }]}>Week</Text>
              </Glass>
            </Pressable>
            <Pressable onPress={() => setPeriod('month')}>
              <Glass intensity={period === 'month' ? 'elevated' : 'clear'} style={[styles.toggle, period === 'month' && { borderColor: theme.accent, borderWidth: 1 }]}>
                <Text style={[styles.toggleText, { color: period === 'month' ? theme.accent : theme.textSecondary }]}>Month</Text>
              </Glass>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(150).springify()}>
          <Glass intensity="elevated" style={styles.summaryCard}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>This Week</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.accent }]}>{formatNum(totals.steps)}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Steps</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{formatNum(totals.calories)}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#3B82F6' }]}>{totals.water}L</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Water</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#8B5CF6' }]}>{totals.activeMinutes}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Active</Text>
              </View>
            </View>
          </Glass>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(200).delay(300)}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Breakdown</Text>
        </Animated.View>

        {!hasData && (
          <Animated.View entering={FadeInDown.duration(300).delay(350)}>
            <Glass intensity="elevated" style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No data yet</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Start logging workouts, water, and meals to see your stats here
              </Text>
            </Glass>
          </Animated.View>
        )}

        {hasData && weekData.map((day, i) => (
          <Animated.View key={i} entering={FadeInDown.duration(300).delay(350 + i * 80).springify()}>
            <Glass intensity="elevated" style={styles.dayRow}>
              <View style={styles.dayHeader}>
                <Text style={[styles.dayName, { color: theme.text }]}>{days[new Date(day.date).getDay()]}</Text>
                <Text style={[styles.dayDate, { color: theme.textSecondary }]}>{new Date(day.date).getDate()}</Text>
              </View>
              <View style={styles.dayStats}>
                <View style={styles.dayStat}>
                  <Text style={[styles.dayStatValue, { color: theme.text }]}>{formatNum(day.steps)}</Text>
                  <ProgressBar progress={day.steps / 10000} height={3} />
                </View>
                <Text style={[styles.dayMetaText, { color: theme.textSecondary }]}>
                  🔥 {formatNum(day.calories)} · 💧 {day.water}L
                </Text>
              </View>
            </Glass>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.duration(400).delay(600).springify()}>
          <Glass intensity="elevated" style={styles.workoutSummary}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>Workouts</Text>
            <Text style={[styles.workoutCount, { color: theme.accent }]}>{workouts.length}</Text>
            <Text style={[styles.workoutLabel, { color: theme.textSecondary }]}>total logged</Text>
            {workouts.length === 0 && (
              <Text style={[styles.workoutHint, { color: theme.textSecondary }]}>
                Log a workout from the + tab to start tracking
              </Text>
            )}
          </Glass>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return Math.round(n).toString();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: Spacing.three },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800' },
  toggleRow: { flexDirection: 'row', gap: 6 },
  toggle: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  toggleText: { fontSize: 13, fontWeight: '700' },
  summaryCard: { padding: Spacing.three, gap: Spacing.two },
  summaryTitle: { fontSize: 16, fontWeight: '700' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  statItem: { flex: 1, minWidth: 70, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: Spacing.one },
  dayRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.two + 2, gap: Spacing.two },
  dayHeader: { alignItems: 'center', minWidth: 40, gap: 0 },
  dayName: { fontSize: 12, fontWeight: '700' },
  dayDate: { fontSize: 10, fontWeight: '500' },
  dayStats: { flex: 1, gap: 4 },
  dayStat: { gap: 4 },
  dayStatValue: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
  dayMetaText: { fontSize: 11, fontWeight: '500' },
  workoutSummary: { padding: Spacing.four, alignItems: 'center', gap: 2 },
  workoutCount: { fontSize: 34, fontWeight: '800' },
  workoutLabel: { fontSize: 12, fontWeight: '500' },
  workoutHint: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginTop: Spacing.one },
  emptyState: { padding: Spacing.five, alignItems: 'center', gap: Spacing.one },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
