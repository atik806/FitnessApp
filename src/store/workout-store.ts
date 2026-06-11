import { create } from 'zustand';

import type { Workout } from '@/types';

interface WorkoutState {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
  recentWorkouts: () => Workout[];
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],

  addWorkout: (workout) =>
    set((state) => ({
      workouts: [workout, ...state.workouts],
    })),

  removeWorkout: (id) =>
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    })),

  recentWorkouts: () => get().workouts.slice(0, 3),
}));
