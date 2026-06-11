import { create } from 'zustand';

import type { Goal, GoalCategory } from '@/types';
import { GOAL_CATEGORIES } from '@/types';

function defaultTarget(category: GoalCategory): number {
  const map: Record<GoalCategory, number> = {
    steps: 10000,
    water: 2.5,
    calories: 2200,
    active_minutes: 30,
    distance: 5,
    weight: 70,
    workouts: 5,
  };
  return map[category];
}

interface GoalsState {
  goals: Goal[];
  addGoal: (category: GoalCategory) => void;
  removeGoal: (id: string) => void;
  updateProgress: (id: string, value: number) => void;
  toggleComplete: (id: string) => void;
}

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: [
    {
      id: 'default-steps',
      category: 'steps',
      title: 'Daily Steps',
      target: 10000,
      current: 0,
      unit: 'steps',
      period: 'daily',
      createdAt: new Date().toISOString(),
      completed: false,
    },
    {
      id: 'default-water',
      category: 'water',
      title: 'Daily Water',
      target: 2.5,
      current: 0,
      unit: 'L',
      period: 'daily',
      createdAt: new Date().toISOString(),
      completed: false,
    },
  ],

  addGoal: (category) =>
    set((state) => {
      const cat = GOAL_CATEGORIES.find((c) => c.id === category);
      const newGoal: Goal = {
        id: `${category}-${Date.now()}`,
        category,
        title: cat?.label ?? category,
        target: defaultTarget(category),
        current: 0,
        unit: cat?.unit ?? '',
        period: 'daily',
        createdAt: new Date().toISOString(),
        completed: false,
      };
      return { goals: [...state.goals, newGoal] };
    }),

  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),

  updateProgress: (id, value) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, current: value, completed: value >= g.target } : g,
      ),
    })),

  toggleComplete: (id) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g,
      ),
    })),
}));
