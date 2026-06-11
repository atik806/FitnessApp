import { create } from 'zustand';

import type { UserProfile } from '@/types';
import { defaultProfile } from '@/types';
import { getSupabase } from '@/lib/supabase';

interface ProfileState {
  profile: UserProfile;
  loading: boolean;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveProfile: (userId: string) => Promise<void>;
  resetProfile: () => void;
}

function rowToProfile(row: any): UserProfile {
  return {
    name: row.name ?? 'Athlete',
    weight: row.weight_kg ?? 70,
    height: row.height_cm ?? 175,
    age: row.age ?? 25,
    dailyStepTarget: row.step_goal ?? 10000,
    dailyCalorieTarget: row.calorie_goal ?? 2200,
    dailyWaterTarget: row.water_goal_l ?? 2.5,
    dailyActiveMinutesTarget: row.active_goal_min ?? 30,
    theme: row.theme ?? 'system',
  };
}

export function profileToRow(profile: UserProfile) {
  return {
    name: profile.name,
    weight_kg: profile.weight,
    height_cm: profile.height,
    age: profile.age,
    step_goal: profile.dailyStepTarget,
    calorie_goal: profile.dailyCalorieTarget,
    water_goal_l: profile.dailyWaterTarget,
    active_goal_min: profile.dailyActiveMinutesTarget,
    theme: profile.theme,
  };
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile(),
  loading: false,

  loadProfile: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await getSupabase()
        .from('user_profile')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        set({ profile: rowToProfile(data), loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },

  updateProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),

  saveProfile: async (userId) => {
    const profile = get().profile;
    const { error } = await getSupabase()
      .from('user_profile')
      .upsert({ id: userId, ...profileToRow(profile) }, { onConflict: 'id' });
    if (error) throw error;
  },

  resetProfile: () => set({ profile: defaultProfile() }),
}));
