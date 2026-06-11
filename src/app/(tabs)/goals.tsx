import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/ui/glass';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { useTheme } from '@/hooks/use-theme';
import { useGoalsStore } from '@/store';
import { GOAL_CATEGORIES, type GoalCategory } from '@/types';

export default function GoalsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const resp = useResponsive();
  const goals = useGoalsStore((s) => s.goals);
  const addGoal = useGoalsStore((s) => s.addGoal);
  const removeGoal = useGoalsStore((s) => s.removeGoal);
  const toggleComplete = useGoalsStore((s) => s.toggleComplete);
  const updateProgress = useGoalsStore((s) => s.updateProgress);

  const [showAdd, setShowAdd] = useState(false);
  const [editTargets, setEditTargets] = useState<Record<string, string>>({});

  const completedCount = goals.filter((g) => g.completed).length;

  function handleAdd(category: GoalCategory) {
    addGoal(category);
    setShowAdd(false);
  }

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
          <Text style={[styles.title, { color: theme.text }]}>Goals</Text>
          <Pressable onPress={() => setShowAdd(!showAdd)}>
            <Glass intensity="elevated" style={[styles.addBtn, { borderColor: theme.accent, borderWidth: 1 }]}>
              <Text style={[styles.addBtnText, { color: theme.accent }]}>{showAdd ? 'Cancel' : '+ New'}</Text>
            </Glass>
          </Pressable>
        </Animated.View>

        {showAdd && (
          <Animated.View entering={SlideInDown.duration(300).springify()}>
            <Glass intensity="elevated" style={styles.addSection}>
              <Text style={[styles.addSectionTitle, { color: theme.text }]}>Choose a goal type</Text>
              <View style={styles.categoryGrid}>
                {GOAL_CATEGORIES.map((cat) => (
                  <Pressable key={cat.id} onPress={() => handleAdd(cat.id)}>
                    <View style={[styles.categoryCard, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}>
                      <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      <Text style={[styles.categoryLabel, { color: theme.accent }]}>{cat.label}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </Glass>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(400).delay(150).springify()}>
          <Glass intensity="elevated" style={styles.progressSummary}>
            <Text style={[styles.progressCount, { color: theme.accent }]}>{completedCount}/{goals.length}</Text>
            <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>goals complete</Text>
            <ProgressBar progress={goals.length > 0 ? completedCount / goals.length : 0} height={6} />
          </Glass>
        </Animated.View>

        {goals.length === 0 && !showAdd && (
          <Animated.View entering={FadeInDown.duration(300).delay(200)}>
            <Glass intensity="elevated" style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No goals yet</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Tap "+ New" to set your first goal and start tracking your progress</Text>
            </Glass>
          </Animated.View>
        )}

        {goals.map((goal, i) => (
          <Animated.View key={goal.id} entering={FadeInDown.duration(350).delay(200 + i * 80).springify()}>
            <Glass intensity="elevated" style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleRow}>
                  <Text style={styles.goalIcon}>{GOAL_CATEGORIES.find((c) => c.id === goal.category)?.icon ?? '🎯'}</Text>
                  <View>
                    <Text style={[styles.goalTitle, { color: theme.text }]}>{goal.title}</Text>
                    <Text style={[styles.goalPeriod, { color: theme.textSecondary }]}>{goal.period} · {goal.unit}</Text>
                  </View>
                </View>
                <Pressable onPress={() => toggleComplete(goal.id)}>
                  <Text style={{ fontSize: 24 }}>{goal.completed ? '✅' : '⬜'}</Text>
                </Pressable>
              </View>

              <View style={styles.goalProgress}>
                <View style={styles.goalValues}>
                  <Text style={[styles.goalCurrent, { color: goal.completed ? theme.accent : theme.text }]}>
                    {formatGoalValue(goal.current, goal.unit)}
                  </Text>
                  <Text style={[styles.goalTarget, { color: theme.textSecondary }]}>/ {formatGoalValue(goal.target, goal.unit)}</Text>
                </View>
                <ProgressBar progress={goal.target > 0 ? goal.current / goal.target : 0} height={6} />
              </View>

              <View style={styles.goalActions}>
                <TextInput
                  style={[styles.progressInput, { color: theme.text, backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
                  placeholder="Update progress"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                  value={editTargets[goal.id] ?? ''}
                  onChangeText={(t) => setEditTargets((p) => ({ ...p, [goal.id]: t }))}
                />
                <Pressable
                  onPress={() => {
                    const val = parseFloat(editTargets[goal.id] ?? '');
                    if (!isNaN(val)) {
                      updateProgress(goal.id, val);
                      setEditTargets((p) => ({ ...p, [goal.id]: '' }));
                    }
                  }}
                >
                  <Glass intensity="elevated" style={[styles.updateBtn, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.updateBtnText, { color: '#fff' }]}>Set</Text>
                  </Glass>
                </Pressable>
                <Pressable onPress={() => removeGoal(goal.id)}>
                  <Text style={[styles.deleteBtn, { color: theme.error }]}>✕</Text>
                </Pressable>
              </View>
            </Glass>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

function formatGoalValue(value: number, unit: string): string {
  if (unit === 'steps' && value >= 1000) return (value / 1000).toFixed(1).replace('.0', '') + 'k';
  if (unit === 'L') return value.toFixed(1);
  return Math.round(value).toString();
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
  addBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  addBtnText: { fontSize: 13, fontWeight: '700' },
  addSection: { padding: Spacing.three, gap: Spacing.two },
  addSectionTitle: { fontSize: 15, fontWeight: '700' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryCard: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  categoryIcon: { fontSize: 18 },
  categoryLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  progressSummary: { padding: Spacing.three, alignItems: 'center', gap: 4 },
  progressCount: { fontSize: 30, fontWeight: '800' },
  progressLabel: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
  emptyState: { padding: Spacing.six, alignItems: 'center', gap: Spacing.one },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  goalCard: { padding: Spacing.three, gap: Spacing.two },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  goalIcon: { fontSize: 24 },
  goalTitle: { fontSize: 16, fontWeight: '700' },
  goalPeriod: { fontSize: 11, fontWeight: '500', marginTop: 1 },
  goalProgress: { gap: 4 },
  goalValues: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  goalCurrent: { fontSize: 20, fontWeight: '800', fontVariant: ['tabular-nums'] },
  goalTarget: { fontSize: 14, fontWeight: '600' },
  goalActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  progressInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, fontSize: 14, fontWeight: '600' },
  updateBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  updateBtnText: { fontSize: 13, fontWeight: '700' },
  deleteBtn: { fontSize: 18, fontWeight: '700', paddingHorizontal: 8 },
});
