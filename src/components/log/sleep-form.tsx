import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TimePicker } from '@/components/ui/time-picker';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const QUALITY_OPTIONS: { id: 'poor' | 'fair' | 'good' | 'great'; label: string; icon: string }[] = [
  { id: 'poor', label: 'Poor', icon: '😫' },
  { id: 'fair', label: 'Fair', icon: '😐' },
  { id: 'good', label: 'Good', icon: '😊' },
  { id: 'great', label: 'Great', icon: '😴' },
];

interface Props {
  onSave: (startH: number, startM: number, endH: number, endM: number, quality: 'poor' | 'fair' | 'good' | 'great') => void;
  onCancel: () => void;
}

export function SleepForm({ onSave, onCancel }: Props) {
  const theme = useTheme();

  const now = new Date();
  const [startHour, setStartHour] = useState(now.getHours() - 8);
  const [startMin, setStartMin] = useState(0);
  const [endHour, setEndHour] = useState(now.getHours());
  const [endMin, setEndMin] = useState(now.getMinutes());
  const [quality, setQuality] = useState<'poor' | 'fair' | 'good' | 'great'>('good');

  function handleSave() {
    onSave(startHour, startMin, endHour, endMin, quality);
  }

  function calcDuration(): string {
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    const diff = end >= start ? end - start : end + 1440 - start;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.heading, { color: theme.text }]}>Log Sleep</Text>

      <Text style={[styles.section, { color: theme.textSecondary }]}>Bedtime</Text>
      <TimePicker hour={startHour} minute={startMin} onChange={(h, m) => { setStartHour(h); setStartMin(m); }} />

      <Text style={[styles.section, { color: theme.textSecondary }]}>Wake up</Text>
      <TimePicker hour={endHour} minute={endMin} onChange={(h, m) => { setEndHour(h); setEndMin(m); }} />

      <View style={[styles.durationBadge, { backgroundColor: theme.accentLight }]}>
        <Text style={[styles.durationText, { color: theme.accent }]}>Duration: {calcDuration()}</Text>
      </View>

      <Text style={[styles.section, { color: theme.textSecondary }]}>Quality</Text>
      <View style={styles.qualityRow}>
        {QUALITY_OPTIONS.map((q) => (
          <Pressable key={q.id} onPress={() => setQuality(q.id)} style={{ flex: 1 }}>
            <View
              style={[
                styles.qualityCard,
                {
                  backgroundColor: quality === q.id ? '#F3E8FF' : theme.cardBg,
                  borderColor: quality === q.id ? '#A855F7' : theme.glassBorder,
                },
              ]}
            >
              <Text style={styles.qualityIcon}>{q.icon}</Text>
              <Text style={[styles.qualityLabel, { color: quality === q.id ? '#A855F7' : theme.text }]}>
                {q.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.buttons}>
        <Pressable onPress={onCancel} style={[styles.btn, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.btnText, { color: theme.text }]}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSave} style={[styles.btn, { backgroundColor: '#A855F7' }]}>
          <Text style={[styles.btnText, { color: '#fff', fontWeight: '800' }]}>Save</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.one },
  heading: { fontSize: 22, fontWeight: '800' },
  section: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.two,
    marginBottom: 4,
  },
  durationBadge: {
    padding: Spacing.two,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  durationText: { fontSize: 14, fontWeight: '700' },
  qualityRow: { flexDirection: 'row', gap: Spacing.two },
  qualityCard: {
    alignItems: 'center',
    padding: Spacing.two + 2,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 4,
  },
  qualityIcon: { fontSize: 22 },
  qualityLabel: { fontSize: 12, fontWeight: '700' },
  buttons: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three, marginBottom: 40 },
  btn: { flex: 1, padding: Spacing.three, borderRadius: 14, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});
