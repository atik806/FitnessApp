import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MealForm } from '@/components/log/meal-form';
import { QuickActions } from '@/components/log/quick-actions';
import { SleepForm } from '@/components/log/sleep-form';
import { WaterForm } from '@/components/log/water-form';
import { WorkoutForm } from '@/components/log/workout-form';
import { Glass } from '@/components/ui/glass';
import { Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { useTheme } from '@/hooks/use-theme';
import { useActivityStore, useMealStore, useSleepStore, useWorkoutStore } from '@/store';
import type { Workout } from '@/types';

type LogStep = 'main' | 'workout' | 'water' | 'sleep' | 'meal';

const STEP_TITLES: Record<LogStep, string> = {
  main: 'Quick Log',
  workout: 'New Workout',
  water: 'Add Water',
  sleep: 'Log Sleep',
  meal: 'Log Meal',
};

interface LastAction {
  type: 'workout' | 'water' | 'sleep' | 'meal';
  id?: string;
  label: string;
  undo: () => void;
}

export default function LogScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const resp = useResponsive();
  const [step, setStep] = useState<LogStep>('main');
  const lastAction = useRef<LastAction | null>(null);
  const [toast, setToast] = useState<{ msg: string; showUndo: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addWater = useActivityStore((s) => s.addWater);
  const addCalories = useActivityStore((s) => s.addCalories);
  const addActiveMinutes = useActivityStore((s) => s.addActiveMinutes);
  const addWorkout = useWorkoutStore((s) => s.addWorkout);
  const removeWorkout = useWorkoutStore((s) => s.removeWorkout);
  const addMeal = useMealStore((s) => s.addMeal);
  const removeMeal = useMealStore((s) => s.removeMeal);
  const addSleep = useSleepStore((s) => s.addSleep);
  const removeSleep = useSleepStore((s) => s.removeSleep);

  function showToast(msg: string, showUndo: boolean) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, showUndo });
    toastTimer.current = setTimeout(() => {
      setToast(null);
      lastAction.current = null;
    }, 4000);
  }

  function handleUndo() {
    const action = lastAction.current;
    if (!action) return;
    action.undo();
    setToast({ msg: 'Undone', showUndo: false });
    lastAction.current = null;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  }

  function handleAction(action: string) {
    setStep(action as LogStep);
  }

  function handleSaveWorkout(workout: Workout) {
    addWorkout(workout);
    addCalories(Math.round(workout.duration * 7));
    addActiveMinutes(workout.duration);
    setStep('main');
    lastAction.current = {
      type: 'workout',
      id: workout.id,
      label: `${workout.duration}min ${workout.type}`,
      undo: () => {
        removeWorkout(workout.id);
        addCalories(-Math.round(workout.duration * 7));
        addActiveMinutes(-workout.duration);
      },
    };
    showToast('Workout saved!', true);
  }

  function handleSaveWater(liters: number) {
    addWater(liters);
    setStep('main');
    lastAction.current = {
      type: 'water',
      label: `${liters}L`,
      undo: () => addWater(-liters),
    };
    showToast(`+${liters}L water`, true);
  }

  function handleSaveSleep(
    startH: number, startM: number,
    endH: number, endM: number,
    quality: 'poor' | 'fair' | 'good' | 'great',
  ) {
    const today = new Date();
    const start = new Date(today);
    start.setHours(startH, startM, 0, 0);
    const end = new Date(today);
    end.setHours(endH, endM, 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1);

    const id = addSleep(start.toISOString(), end.toISOString(), quality);
    const diff = Math.round((end.getTime() - start.getTime()) / 60000);
    addActiveMinutes(diff);
    setStep('main');
    lastAction.current = {
      type: 'sleep',
      id,
      label: quality,
      undo: () => {
        removeSleep(id);
        addActiveMinutes(-diff);
      },
    };
    showToast(`Sleep logged: ${quality}`, true);
  }

  function handleSaveMeal(name: string, calories: number) {
    const id = addMeal(name, calories);
    addCalories(calories);
    setStep('main');
    lastAction.current = {
      type: 'meal',
      id,
      label: `${name}: ${calories}cal`,
      undo: () => {
        removeMeal(id);
        addCalories(-calories);
      },
    };
    showToast(`${name}: +${calories}cal`, true);
  }

  const isSubForm = step !== 'main';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.three,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: resp.contentPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(300)} style={[styles.header, isSubForm && styles.headerSub]}>
          {isSubForm && (
            <Pressable onPress={() => setStep('main')} style={styles.backBtn}>
              <SymbolView name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }} size={18} weight="bold" tintColor={theme.accent} />
              <Text style={[styles.backText, { color: theme.accent }]}>Back</Text>
            </Pressable>
          )}
          <Text style={[styles.title, isSubForm && styles.titleSub, { color: theme.text }]}>
            {STEP_TITLES[step]}
          </Text>
        </Animated.View>

        {toast && (
          <Animated.View entering={SlideInDown.duration(300).springify()}>
            <Glass
              intensity="elevated"
              style={[styles.toast, { backgroundColor: toast.msg === 'Undone' ? theme.error + '20' : theme.accentLight }]}
            >
              <Text style={[styles.toastText, { color: toast.msg === 'Undone' ? theme.error : theme.accent }]}>
                {toast.msg}
              </Text>
              {toast.showUndo && (
                <Pressable onPress={handleUndo} style={[styles.undoBtn, { backgroundColor: theme.accent }]}>
                  <Text style={styles.undoText}>Undo</Text>
                </Pressable>
              )}
            </Glass>
          </Animated.View>
        )}

        <Animated.View key={step} entering={FadeInDown.duration(350).springify()}>
          {step === 'main' && <QuickActions onAction={handleAction} />}
          {step === 'workout' && <WorkoutForm onSave={handleSaveWorkout} onCancel={() => setStep('main')} />}
          {step === 'water' && <WaterForm onSave={handleSaveWater} onCancel={() => setStep('main')} />}
          {step === 'sleep' && <SleepForm onSave={handleSaveSleep} onCancel={() => setStep('main')} />}
          {step === 'meal' && <MealForm onSave={handleSaveMeal} onCancel={() => setStep('main')} />}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: Spacing.three },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSub: {
    justifyContent: 'flex-start',
    gap: Spacing.two,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 4,
  },
  backText: { fontSize: 16, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800' },
  titleSub: { fontSize: 26, fontWeight: '800' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
  },
  toastText: { fontSize: 14, fontWeight: '700', flex: 1 },
  undoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: Spacing.two,
  },
  undoText: { fontSize: 12, fontWeight: '800', color: '#fff' },
});
