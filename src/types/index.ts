export type WorkoutType = 'running' | 'strength' | 'cycling' | 'yoga' | 'walking' | 'custom';

export interface Workout {
  id: string;
  type: WorkoutType;
  date: string;
  duration: number;
  distance?: number;
  sets?: number;
  reps?: number;
  intensity?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface DailyActivity {
  date: string;
  steps: number;
  calories: number;
  water: number;
  activeMinutes: number;
  distance: number;
}

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
}

export interface SleepRecord {
  id: string;
  start: string;
  end: string;
  quality: 'poor' | 'fair' | 'good' | 'great';
}

export type GoalCategory = 'steps' | 'water' | 'calories' | 'active_minutes' | 'distance' | 'weight' | 'workouts';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export interface Goal {
  id: string;
  category: GoalCategory;
  title: string;
  target: number;
  current: number;
  unit: string;
  period: GoalPeriod;
  createdAt: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  dailyCalorieTarget: number;
  dailyWaterTarget: number;
  dailyActiveMinutesTarget: number;
  dailyStepTarget: number;
  theme: 'system' | 'light' | 'dark';
}

export const WORKOUT_TYPES: { id: WorkoutType; label: string; icon: string }[] = [
  { id: 'running', label: 'Running', icon: '🏃' },
  { id: 'walking', label: 'Walking', icon: '🚶' },
  { id: 'cycling', label: 'Cycling', icon: '🚴' },
  { id: 'strength', label: 'Strength', icon: '🏋️' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'custom', label: 'Custom', icon: '📝' },
];

export const INTENSITY_OPTIONS: { id: 'low' | 'medium' | 'high'; label: string }[] = [
  { id: 'low', label: 'Easy' },
  { id: 'medium', label: 'Moderate' },
  { id: 'high', label: 'Hard' },
];

export const GOAL_CATEGORIES: { id: GoalCategory; label: string; icon: string; unit: string }[] = [
  { id: 'steps', label: 'Steps', icon: '👟', unit: 'steps' },
  { id: 'water', label: 'Water', icon: '💧', unit: 'L' },
  { id: 'calories', label: 'Calories', icon: '🔥', unit: 'cal' },
  { id: 'active_minutes', label: 'Active Minutes', icon: '⏱', unit: 'min' },
  { id: 'distance', label: 'Distance', icon: '📏', unit: 'km' },
  { id: 'weight', label: 'Weight', icon: '⚖️', unit: 'kg' },
  { id: 'workouts', label: 'Workouts', icon: '🏋️', unit: 'workouts' },
];

export function defaultProfile(): UserProfile {
  return {
    name: 'Athlete',
    weight: 70,
    height: 175,
    age: 25,
    dailyCalorieTarget: 2200,
    dailyWaterTarget: 2.5,
    dailyActiveMinutesTarget: 30,
    dailyStepTarget: 10000,
    theme: 'system',
  };
}
