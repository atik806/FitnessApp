import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MetricCard } from '@/components/dashboard/metric-card';
import { RecentWorkouts } from '@/components/dashboard/recent-workouts';
import { HapticPressable } from '@/components/ui/animated-pressable';
import { Glass } from '@/components/ui/glass';
import { StepRing } from '@/components/ui/step-ring';
import { Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { useTheme } from '@/hooks/use-theme';
import { useSteps } from '@/hooks/use-steps';
import { useActivityStore, useProfileStore } from '@/store';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const resp = useResponsive();
  useSteps();

  const profile = useProfileStore((s) => s.profile);
  const today = useActivityStore((s) => s.today);

  const stepProgress = profile.dailyStepTarget > 0 ? Math.min(today.steps / profile.dailyStepTarget, 1) : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.three,
            paddingBottom: 120,
            paddingHorizontal: resp.contentPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInRight.duration(400).springify()}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.greeting, { color: theme.text, fontSize: resp.fontSize(26) }]}>
                {greeting()}, {profile.name}
              </Text>
              <Text style={[styles.date, { color: theme.textSecondary }]}>{todayDate()}</Text>
            </View>
            <Glass intensity="clear" style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </Glass>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(150).springify()}>
          <Glass
            intensity="elevated"
            style={[styles.heroCard, { borderColor: theme.accentLight, padding: resp.spacing(24) }]}
          >
            <StepRing value={today.steps} goal={profile.dailyStepTarget} size={resp.isSmall ? 150 : 180} />
            <Animated.View entering={FadeIn.duration(300).delay(400)}>
              <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>Daily Step Goal</Text>
              <Text style={[styles.heroSub, { color: stepProgress >= 1 ? theme.accent : theme.textSecondary }]}>
                {stepProgress >= 1
                  ? 'Goal complete! 🎉'
                  : `${profile.dailyStepTarget - today.steps} steps remaining`}
              </Text>
            </Animated.View>
          </Glass>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(300).delay(300)}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Activity</Text>
        </Animated.View>

        <View style={[styles.metricsRow, resp.isSmall && { flexDirection: 'column' }]}>
          <Animated.View entering={FadeInDown.duration(400).delay(250)} style={{ flex: 1 }}>
            <MetricCard
              icon="🔥"
              label="Calories"
              value={today.calories}
              goal={profile.dailyCalorieTarget}
              unit="cal"
              color="#F59E0B"
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(400).delay(350)} style={{ flex: 1 }}>
            <MetricCard
              icon="💧"
              label="Water"
              value={today.water}
              goal={profile.dailyWaterTarget}
              unit="L"
              color="#3B82F6"
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(400).delay(450)} style={{ flex: 1 }}>
            <MetricCard
              icon="⏱"
              label="Active"
              value={today.activeMinutes}
              goal={profile.dailyActiveMinutesTarget}
              unit="min"
              color="#8B5CF6"
            />
          </Animated.View>
        </View>

        <Animated.View entering={SlideInDown.duration(500).delay(500).springify()}>
          <RecentWorkouts />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: Spacing.three },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontWeight: '800' },
  date: { fontSize: 13, fontWeight: '500', marginTop: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarIcon: { fontSize: 18 },
  heroCard: { alignItems: 'center', gap: Spacing.one, borderWidth: 1 },
  heroLabel: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroSub: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: Spacing.one },
  metricsRow: { flexDirection: 'row', gap: Spacing.two },
});
