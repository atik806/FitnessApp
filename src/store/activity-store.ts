import { create } from 'zustand';

import type { DailyActivity } from '@/types';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function emptyDaily(date?: string): DailyActivity {
  return {
    date: date ?? todayKey(),
    steps: 0,
    calories: 0,
    water: 0,
    activeMinutes: 0,
    distance: 0,
  };
}

function initToday(): DailyActivity {
  return emptyDaily(todayKey());
}

const MAX_HISTORY_DAYS = 30;

interface ActivityState {
  today: DailyActivity;
  history: DailyActivity[];

  updateSteps: (steps: number) => void;
  addCalories: (cal: number) => void;
  addWater: (amount: number) => void;
  addActiveMinutes: (min: number) => void;
  setDistance: (km: number) => void;
  saveTodayToHistory: () => void;
  getWeekHistory: () => DailyActivity[];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  today: initToday(),
  history: [],

  updateSteps: (steps) =>
    set((state) => {
      if (state.today.date !== todayKey()) {
        const old = state.today;
        const newHistory = [old, ...state.history].slice(0, MAX_HISTORY_DAYS);
        return { today: { ...emptyDaily(), steps }, history: newHistory };
      }
      return { today: { ...state.today, steps } };
    }),

  addCalories: (cal) =>
    set((state) => {
      if (state.today.date !== todayKey()) {
        const old = state.today;
        const newHistory = [old, ...state.history].slice(0, MAX_HISTORY_DAYS);
        return { today: { ...emptyDaily(), calories: cal }, history: newHistory };
      }
      return { today: { ...state.today, calories: state.today.calories + cal } };
    }),

  addWater: (amount) =>
    set((state) => {
      if (state.today.date !== todayKey()) {
        const old = state.today;
        const newHistory = [old, ...state.history].slice(0, MAX_HISTORY_DAYS);
        return { today: { ...emptyDaily(), water: amount }, history: newHistory };
      }
      return { today: { ...state.today, water: parseFloat((state.today.water + amount).toFixed(2)) } };
    }),

  addActiveMinutes: (min) =>
    set((state) => {
      if (state.today.date !== todayKey()) {
        const old = state.today;
        const newHistory = [old, ...state.history].slice(0, MAX_HISTORY_DAYS);
        return { today: { ...emptyDaily(), activeMinutes: min }, history: newHistory };
      }
      return { today: { ...state.today, activeMinutes: state.today.activeMinutes + min } };
    }),

  setDistance: (km) =>
    set((state) => {
      if (state.today.date !== todayKey()) {
        const old = state.today;
        const newHistory = [old, ...state.history].slice(0, MAX_HISTORY_DAYS);
        return { today: { ...emptyDaily(), distance: km }, history: newHistory };
      }
      return { today: { ...state.today, distance: km } };
    }),

  saveTodayToHistory: () =>
    set((state) => {
      const newHistory = [state.today, ...state.history].slice(0, MAX_HISTORY_DAYS);
      return { today: initToday(), history: newHistory };
    }),

  getWeekHistory: () => {
    const state = get();
    const days: DailyActivity[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (key === state.today.date) {
        days.push(state.today);
      } else {
        const found = state.history.find((h) => h.date === key);
        days.push(found ?? emptyDaily(key));
      }
    }
    return days;
  },
}));
