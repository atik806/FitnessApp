import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { TimePicker } from '@/components/ui/time-picker';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { WORKOUT_TYPES, type Workout, type WorkoutType } from '@/types';

interface Props {
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

function AnimatedButton({
  label,
  onPress,
  color,
  bg,
}: {
  label: string;
  onPress: () => void;
  color: string;
  bg?: string;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          style,
          {
            padding: Spacing.three,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: bg ?? color,
          },
        ]}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color }}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function WorkoutForm({ onSave, onCancel }: Props) {
  const theme = useTheme();
  const [type, setType] = useState<WorkoutType>('running');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  const now = new Date();
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());

  const hasDistance = type === 'running' || type === 'cycling' || type === 'walking';

  function handleSave() {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);

    const workout: Workout = {
      id: Date.now().toString(),
      type,
      date: d.toISOString(),
      duration: parseInt(duration, 10) || 0,
      distance: hasDistance ? parseFloat(distance) || undefined : undefined,
      intensity,
      notes: notes || undefined,
    };
    onSave(workout);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.heading, { color: theme.text }]}>New Workout</Text>

      <Text style={[styles.section, { color: theme.textSecondary }]}>Type</Text>
      <View style={styles.typeGrid}>
        {WORKOUT_TYPES.map((wt) => (
          <Pressable key={wt.id} onPress={() => setType(wt.id)}>
            <View
              style={[
                styles.typeCard,
                {
                  backgroundColor: type === wt.id ? theme.accentLight : theme.cardBg,
                  borderColor: type === wt.id ? theme.accent : theme.glassBorder,
                },
              ]}
            >
              <Text style={styles.typeIcon}>{wt.icon}</Text>
              <Text style={[styles.typeLabel, { color: type === wt.id ? theme.accent : theme.text }]}>
                {wt.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.section, { color: theme.textSecondary }]}>Time</Text>
      <TimePicker hour={hour} minute={minute} onChange={(h, m) => { setHour(h); setMinute(m); }} />

      <Text style={[styles.section, { color: theme.textSecondary }]}>Duration (minutes)</Text>
      <TextInput
        style={[styles.input, { color: theme.text, backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="30"
        placeholderTextColor={theme.textSecondary}
      />

      {hasDistance && (
        <>
          <Text style={[styles.section, { color: theme.textSecondary }]}>Distance (km)</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
            value={distance}
            onChangeText={setDistance}
            keyboardType="decimal-pad"
            placeholder="5.0"
            placeholderTextColor={theme.textSecondary}
          />
        </>
      )}

      <Text style={[styles.section, { color: theme.textSecondary }]}>Intensity</Text>
      <View style={styles.intensityRow}>
        {(['low', 'medium', 'high'] as const).map((level) => (
          <Pressable key={level} onPress={() => setIntensity(level)} style={{ flex: 1 }}>
            <View
              style={[
                styles.intensityChip,
                {
                  backgroundColor: intensity === level ? theme.accent : theme.cardBg,
                  borderColor: intensity === level ? theme.accent : theme.glassBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.intensityLabel,
                  { color: intensity === level ? '#fff' : theme.text },
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.section, { color: theme.textSecondary }]}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notesInput, { color: theme.text, backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
        value={notes}
        onChangeText={setNotes}
        placeholder="How did it feel?"
        placeholderTextColor={theme.textSecondary}
        multiline
      />

      <View style={styles.buttons}>
        <AnimatedButton label="Cancel" onPress={onCancel} color={theme.text} bg={theme.backgroundElement} />
        <AnimatedButton label="Save Workout" onPress={handleSave} color="#fff" bg={theme.accent} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.one },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.two },
  section: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.two,
    marginBottom: 4,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typeCard: {
    alignItems: 'center',
    padding: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  typeIcon: { fontSize: 20 },
  typeLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  input: { borderWidth: 1, borderRadius: 14, padding: Spacing.two + 4, fontSize: 16, fontWeight: '600' },
  notesInput: { height: 80, textAlignVertical: 'top' },
  intensityRow: { flexDirection: 'row', gap: Spacing.two },
  intensityChip: {
    paddingVertical: Spacing.two + 2,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  intensityLabel: { fontSize: 13, fontWeight: '700' },
  buttons: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four, marginBottom: 40 },
});
