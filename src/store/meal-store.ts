import { create } from 'zustand';

import type { MealEntry } from '@/types';

interface MealState {
  meals: MealEntry[];
  addMeal: (name: string, calories: number) => string;
  removeMeal: (id: string) => void;
  totalCalories: () => number;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],

  addMeal: (name, calories) => {
    const id = Date.now().toString();
    set((state) => ({
      meals: [
        ...state.meals,
        { id, name, calories, timestamp: new Date().toISOString() },
      ],
    }));
    return id;
  },

  removeMeal: (id) =>
    set((state) => ({ meals: state.meals.filter((m) => m.id !== id) })),

  totalCalories: () => get().meals.reduce((sum, m) => sum + m.calories, 0),
}));
