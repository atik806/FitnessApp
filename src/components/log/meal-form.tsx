import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRESETS = [
  { label: 'Breakfast', icon: '🥞', cal: 400 },
  { label: 'Lunch', icon: '🥗', cal: 600 },
  { label: 'Dinner', icon: '🍝', cal: 800 },
  { label: 'Snack', icon: '🍎', cal: 200 },
];

interface Props {
  onSave: (name: string, calories: number) => void;
  onCancel: () => void;
}

export function MealForm({ onSave, onCancel }: Props) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim(), parseInt(calories, 10) || 0);
  }

  function handlePreset(label: string, cal: number) {
    setName(label);
    setCalories(cal.toString());
    onSave(label, cal);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.heading, { color: theme.text }]}>Log Meal</Text>

      <Text style={[styles.section, { color: theme.textSecondary }]}>Quick add</Text>
      <View style={styles.presets}>
        {PRESETS.map((p) => (
          <Pressable key={p.label} onPress={() => handlePreset(p.label, p.cal)}>
            <View style={[styles.presetCard, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
              <Text style={styles.presetIcon}>{p.icon}</Text>
              <Text style={[styles.presetLabel, { color: '#F59E0B' }]}>{p.label}</Text>
              <Text style={[styles.presetCal, { color: '#F59E0B' }]}>{p.cal}cal</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.or, { color: theme.textSecondary }]}>or custom entry</Text>

      <Text style={[styles.section, { color: theme.textSecondary }]}>Meal name</Text>
      <TextInput
        style={[styles.input, { color: theme.text, backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
        value={name}
        onChangeText={setName}
        placeholder="Chicken salad"
        placeholderTextColor={theme.textSecondary}
      />

      <Text style={[styles.section, { color: theme.textSecondary }]}>Calories</Text>
      <TextInput
        style={[styles.input, { color: theme.text, backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        placeholder="450"
        placeholderTextColor={theme.textSecondary}
      />

      <View style={styles.buttons}>
        <Pressable onPress={onCancel} style={[styles.btn, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.btnText, { color: theme.text }]}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          style={[styles.btn, { backgroundColor: name.trim() ? '#F59E0B' : theme.backgroundElement }]}
        >
          <Text style={[styles.btnText, { color: name.trim() ? '#fff' : theme.textSecondary, fontWeight: '800' }]}>
            Save
          </Text>
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
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  presetCard: {
    alignItems: 'center',
    padding: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 14,
    borderWidth: 1.5,
    minWidth: 70,
  },
  presetIcon: { fontSize: 22 },
  presetLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  presetCal: { fontSize: 10, fontWeight: '600' },
  or: { fontSize: 12, fontWeight: '600', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5, marginVertical: Spacing.one },
  input: { borderWidth: 1, borderRadius: 14, padding: Spacing.two + 4, fontSize: 16, fontWeight: '600' },
  buttons: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three, marginBottom: 40 },
  btn: { flex: 1, padding: Spacing.three, borderRadius: 14, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});
