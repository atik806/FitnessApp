import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRESETS = [
  { label: 'Small', amount: 0.25, icon: '🥤' },
  { label: 'Medium', amount: 0.5, icon: '🧃' },
  { label: 'Large', amount: 0.75, icon: '🫗' },
  { label: 'Bottle', amount: 1.0, icon: '🍶' },
];

interface Props {
  onSave: (liters: number) => void;
  onCancel: () => void;
}

export function WaterForm({ onSave, onCancel }: Props) {
  const theme = useTheme();
  const [custom, setCustom] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  function handleSave(amount: number) {
    onSave(amount);
  }

  const customAmount = parseFloat(custom);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.heading, { color: theme.text }]}>Add Water</Text>
      <Text style={[styles.sub, { color: theme.textSecondary }]}>Quick add or enter custom amount</Text>

      <View style={styles.presets}>
        {PRESETS.map((p) => (
          <Pressable key={p.amount} onPress={() => { setSelected(p.amount); handleSave(p.amount); }}>
            <View
              style={[
                styles.presetCard,
                {
                  backgroundColor: selected === p.amount ? '#DBEAFE' : theme.cardBg,
                  borderColor: selected === p.amount ? '#3B82F6' : theme.glassBorder,
                },
              ]}
            >
              <Text style={styles.presetIcon}>{p.icon}</Text>
              <Text style={[styles.presetLabel, { color: selected === p.amount ? '#3B82F6' : theme.text }]}>
                {p.label}
              </Text>
              <Text style={[styles.presetAmount, { color: theme.textSecondary }]}>
                {p.amount}L
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.or, { color: theme.textSecondary }]}>or custom amount</Text>

      <View style={styles.customRow}>
        <TextInput
          style={[styles.customInput, { color: theme.text, backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
          value={custom}
          onChangeText={setCustom}
          keyboardType="decimal-pad"
          placeholder="0.25"
          placeholderTextColor={theme.textSecondary}
        />
        <Text style={[styles.unit, { color: theme.textSecondary }]}>liters</Text>
        <Pressable
          onPress={() => {
            if (customAmount > 0) handleSave(customAmount);
          }}
        >
          <View style={[styles.addBtn, { backgroundColor: customAmount > 0 ? '#3B82F6' : theme.backgroundElement }]}>
            <Text style={[styles.addBtnText, { color: customAmount > 0 ? '#fff' : theme.textSecondary }]}>Add</Text>
          </View>
        </Pressable>
      </View>

      <Pressable onPress={onCancel} style={[styles.cancelBtn, { backgroundColor: theme.backgroundElement }]}>
        <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  heading: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: -Spacing.one },
  presets: { flexDirection: 'row', gap: Spacing.two },
  presetCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.two + 2,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 2,
  },
  presetIcon: { fontSize: 24 },
  presetLabel: { fontSize: 12, fontWeight: '700' },
  presetAmount: { fontSize: 10, fontWeight: '600' },
  or: { fontSize: 12, fontWeight: '600', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.two + 2,
    fontSize: 16,
    fontWeight: '600',
  },
  unit: { fontSize: 13, fontWeight: '600' },
  addBtn: { paddingHorizontal: 20, paddingVertical: Spacing.two + 2, borderRadius: 14 },
  addBtnText: { fontSize: 15, fontWeight: '700' },
  cancelBtn: { padding: Spacing.two + 2, borderRadius: 14, alignItems: 'center', marginTop: Spacing.one },
  cancelText: { fontSize: 15, fontWeight: '600' },
});
