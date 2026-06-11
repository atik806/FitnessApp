import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Glass } from '@/components/ui/glass';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function TimePicker({ hour, minute, onChange }: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selHour, setSelHour] = useState(hour);
  const [selMin, setSelMin] = useState(minute);

  const hourList = useRef<FlatList<number>>(null);
  const minList = useRef<FlatList<number>>(null);

  function format(n: number): string {
    return n.toString().padStart(2, '0');
  }

  function handleConfirm() {
    onChange(selHour, selMin);
    setOpen(false);
  }

  const display = `${format(hour)}:${format(minute)}`;
  const period = hour >= 12 ? 'PM' : 'AM';
  const display12 = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${format(minute)} ${period}`;

  return (
    <View>
      <Pressable onPress={() => setOpen(true)}>
        <View
          style={[
            styles.displayRow,
            { backgroundColor: theme.cardBg, borderColor: theme.glassBorder },
          ]}
        >
          <Text style={styles.clockIcon}>🕐</Text>
          <Text style={[styles.displayText, { color: theme.text }]}>{display12}</Text>
        </View>
      </Pressable>

      {open && (
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <Glass intensity="elevated" style={styles.pickerCard}>
            <Text style={[styles.pickerTitle, { color: theme.text }]}>Select time</Text>

            <View style={styles.columns}>
              <View style={styles.column}>
                <Text style={[styles.columnLabel, { color: theme.textSecondary }]}>Hour</Text>
                <FlatList
                  ref={hourList}
                  data={HOURS}
                  keyExtractor={(i) => i.toString()}
                  showsVerticalScrollIndicator={false}
                  style={styles.list}
                  initialScrollIndex={selHour}
                  getItemLayout={(_, index) => ({ length: 36, offset: 36 * index, index })}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => { setSelHour(item); hourList.current?.scrollToIndex({ index: item, animated: true }); }}>
                      <View style={[styles.numberRow, selHour === item && { backgroundColor: theme.accentLight }]}>
                        <Text
                          style={[
                            styles.numberText,
                            { color: selHour === item ? theme.accent : theme.text },
                            selHour === item && { fontWeight: '800' },
                          ]}
                        >
                          {format(item)}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>

              <Text style={[styles.colon, { color: theme.textSecondary }]}>:</Text>

              <View style={styles.column}>
                <Text style={[styles.columnLabel, { color: theme.textSecondary }]}>Min</Text>
                <FlatList
                  ref={minList}
                  data={MINUTES}
                  keyExtractor={(i) => i.toString()}
                  showsVerticalScrollIndicator={false}
                  style={styles.list}
                  initialScrollIndex={selMin}
                  getItemLayout={(_, index) => ({ length: 36, offset: 36 * index, index })}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => { setSelMin(item); minList.current?.scrollToIndex({ index: item, animated: true }); }}>
                      <View style={[styles.numberRow, selMin === item && { backgroundColor: theme.accentLight }]}>
                        <Text
                          style={[
                            styles.numberText,
                            { color: selMin === item ? theme.accent : theme.text },
                            selMin === item && { fontWeight: '800' },
                          ]}
                        >
                          {format(item)}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable onPress={() => setOpen(false)}>
                <Text style={[styles.actionText, { color: theme.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleConfirm}>
                <Text style={[styles.actionText, { color: theme.accent, fontWeight: '800' }]}>Done</Text>
              </Pressable>
            </View>
          </Glass>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.two + 4,
  },
  clockIcon: { fontSize: 18 },
  displayText: { fontSize: 16, fontWeight: '700' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  pickerCard: {
    width: 260,
    padding: Spacing.three,
    gap: Spacing.two,
    zIndex: 101,
  },
  pickerTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 4,
  },
  column: { alignItems: 'center', flex: 1 },
  columnLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  list: { height: 180 },
  numberRow: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  numberText: { fontSize: 18, fontWeight: '600', fontVariant: ['tabular-nums'] },
  colon: { fontSize: 22, fontWeight: '700', marginTop: 28 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
  },
  actionText: { fontSize: 15, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4 },
});
