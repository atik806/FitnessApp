import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSupabase } from '@/lib/supabase';
import { Glass } from '@/components/ui/glass';
import { Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { useTheme } from '@/hooks/use-theme';
import { useActivityStore, useProfileStore, useWorkoutStore } from '@/store';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const resp = useResponsive();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const workouts = useWorkoutStore((s) => s.workouts);
  const today = useActivityStore((s) => s.today);

  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState(profile.name);
  const [editWeight, setEditWeight] = useState(profile.weight.toString());
  const [editHeight, setEditHeight] = useState(profile.height.toString());
  const [editAge, setEditAge] = useState(profile.age.toString());
  const [editCal, setEditCal] = useState(profile.dailyCalorieTarget.toString());
  const [editWater, setEditWater] = useState(profile.dailyWaterTarget.toString());
  const [editActive, setEditActive] = useState(profile.dailyActiveMinutesTarget.toString());
  const [editSteps, setEditSteps] = useState(profile.dailyStepTarget.toString());

  useEffect(() => {
    getSupabase().auth.getSession().then((res: any) => {
      if (res.data?.session) setUserId(res.data.session.user.id);
    });
  }, []);

  async function handleSave() {
    updateProfile({
      name: editName || 'Athlete',
      weight: parseFloat(editWeight) || 70,
      height: parseFloat(editHeight) || 175,
      age: parseInt(editAge, 10) || 25,
      dailyCalorieTarget: parseInt(editCal, 10) || 2200,
      dailyWaterTarget: parseFloat(editWater) || 2.5,
      dailyActiveMinutesTarget: parseInt(editActive, 10) || 30,
      dailyStepTarget: parseInt(editSteps, 10) || 10000,
    });
    if (userId) await useProfileStore.getState().saveProfile(userId);
    setEditing(false);
  }

  const hasActivity = workouts.length > 0 || today.calories > 0 || today.water > 0 || today.activeMinutes > 0;

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
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
          <Pressable onPress={() => (editing ? handleSave() : setEditing(true))}>
            <Glass intensity="elevated" style={[styles.editBtn, { borderColor: theme.accent, borderWidth: 1 }]}>
              <Text style={[styles.editBtnText, { color: theme.accent }]}>{editing ? 'Save' : 'Edit'}</Text>
            </Glass>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(150).springify()}>
          <Glass intensity="elevated" style={styles.profileCard}>
            <View style={[styles.avatarLarge, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.avatarLargeIcon}>👤</Text>
            </View>
            {editing ? (
              <TextInput
                style={[styles.nameInput, { color: theme.text, borderBottomColor: theme.accent }]}
                value={editName}
                onChangeText={setEditName}
                placeholderTextColor={theme.textSecondary}
              />
            ) : (
              <Text style={[styles.profileName, { color: theme.text }]}>{profile.name}</Text>
            )}
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={[styles.profileStatValue, { color: theme.text }]}>{profile.weight}kg</Text>
                <Text style={[styles.profileStatLabel, { color: theme.textSecondary }]}>Weight</Text>
              </View>
              <View style={[styles.profileStatDivider, { backgroundColor: theme.textSecondary }]} />
              <View style={styles.profileStat}>
                <Text style={[styles.profileStatValue, { color: theme.text }]}>{profile.height}cm</Text>
                <Text style={[styles.profileStatLabel, { color: theme.textSecondary }]}>Height</Text>
              </View>
              <View style={[styles.profileStatDivider, { backgroundColor: theme.textSecondary }]} />
              <View style={styles.profileStat}>
                <Text style={[styles.profileStatValue, { color: theme.text }]}>{profile.age}</Text>
                <Text style={[styles.profileStatLabel, { color: theme.textSecondary }]}>Age</Text>
              </View>
            </View>
          </Glass>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(200).delay(300)}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Targets</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(350).springify()}>
          <Glass intensity="elevated" style={styles.targetsCard}>
            <TargetRow label="Steps" value={profile.dailyStepTarget} unit="steps" editing={editing} editValue={editSteps} onChange={setEditSteps} theme={theme} />
            <TargetRow label="Calories" value={profile.dailyCalorieTarget} unit="cal" editing={editing} editValue={editCal} onChange={setEditCal} theme={theme} />
            <TargetRow label="Water" value={profile.dailyWaterTarget} unit="L" editing={editing} editValue={editWater} onChange={setEditWater} theme={theme} />
            <TargetRow label="Active Min" value={profile.dailyActiveMinutesTarget} unit="min" editing={editing} editValue={editActive} onChange={setEditActive} theme={theme} />
          </Glass>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(200).delay(400)}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(450).springify()}>
          <Glass intensity="elevated" style={styles.themeCard}>
            {(['system', 'light', 'dark'] as const).map((t) => (
              <Pressable key={t} onPress={() => {
                updateProfile({ theme: t });
                if (userId) useProfileStore.getState().saveProfile(userId);
              }}>
                <View style={[styles.themeOption, profile.theme === t && { backgroundColor: theme.accentLight }]}>
                  <Text style={[styles.themeLabel, { color: profile.theme === t ? theme.accent : theme.text }]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                  {profile.theme === t && <Text style={[styles.themeCheck, { color: theme.accent }]}>✓</Text>}
                </View>
              </Pressable>
            ))}
          </Glass>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(200).delay(500)}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity Summary</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(550).springify()}>
          <Glass intensity="elevated" style={styles.activitySummary}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryValue, { color: theme.accent }]}>{workouts.length}</Text>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Workouts</Text>
            </View>
            <View style={[styles.summaryRow, { borderLeftWidth: 1, borderLeftColor: theme.glassBorder }]}>
              <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>{formatShort(today.calories)}</Text>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Cal Today</Text>
            </View>
            <View style={[styles.summaryRow, { borderLeftWidth: 1, borderLeftColor: theme.glassBorder }]}>
              <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>{today.water}L</Text>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Water Today</Text>
            </View>
          </Glass>
          {!hasActivity && (
            <Text style={[styles.activityHint, { color: theme.textSecondary }]}>
              Start logging to see your activity summary here
            </Text>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(600).springify()}>
          <Pressable
            onPress={() => {
              function doSignOut() {
                getSupabase().auth.signOut().then(() => router.push('/landing' as any));
              }
              if (Platform.OS === 'web') {
                if (window.confirm('Sign out?')) doSignOut();
              } else {
                Alert.alert('Sign Out', 'Are you sure?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', style: 'destructive', onPress: doSignOut },
                ]);
              }
            }}
            style={[styles.signOutBtn, { borderColor: '#EF4444' }]}
          >
            <SymbolView name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }} size={16} weight="bold" tintColor="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function TargetRow({ label, value, unit, editing, editValue, onChange, theme }: any) {
  return (
    <View style={styles.targetRow}>
      <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>{label}</Text>
      {editing ? (
        <View style={styles.targetEdit}>
          <TextInput style={[styles.targetInput, { color: theme.text, borderBottomColor: theme.accent }]} value={editValue} onChangeText={onChange} keyboardType="decimal-pad" />
          <Text style={[styles.targetUnit, { color: theme.textSecondary }]}>{unit}</Text>
        </View>
      ) : (
        <Text style={[styles.targetValue, { color: theme.text }]}>{value} <Text style={[styles.targetUnit, { color: theme.textSecondary }]}>{unit}</Text></Text>
      )}
    </View>
  );
}

function formatShort(n: number): string {
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
  editBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  editBtnText: { fontSize: 13, fontWeight: '700' },
  profileCard: { padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  avatarLargeIcon: { fontSize: 32 },
  nameInput: { fontSize: 20, fontWeight: '700', textAlign: 'center', borderBottomWidth: 1, paddingBottom: 2, minWidth: 120 },
  profileName: { fontSize: 22, fontWeight: '800' },
  profileStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginTop: Spacing.one },
  profileStat: { alignItems: 'center', gap: 1 },
  profileStatValue: { fontSize: 18, fontWeight: '700' },
  profileStatLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  profileStatDivider: { width: 1, height: 30, opacity: 0.3 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: Spacing.one },
  targetsCard: { padding: Spacing.three, gap: Spacing.two },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  targetLabel: { fontSize: 14, fontWeight: '600' },
  targetValue: { fontSize: 16, fontWeight: '700' },
  targetUnit: { fontSize: 12, fontWeight: '500' },
  targetEdit: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  targetInput: { fontSize: 16, fontWeight: '700', borderBottomWidth: 1, paddingBottom: 2, minWidth: 60, textAlign: 'right' },
  themeCard: { padding: Spacing.two, gap: 2 },
  themeOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: Spacing.two, borderRadius: 10 },
  themeLabel: { fontSize: 15, fontWeight: '600' },
  themeCheck: { fontSize: 16, fontWeight: '700' },
  activitySummary: { flexDirection: 'row', padding: Spacing.three, gap: Spacing.two },
  summaryRow: { flex: 1, alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
  summaryLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  activityHint: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginTop: Spacing.one },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: Spacing.one,
  },
  signOutText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
});
