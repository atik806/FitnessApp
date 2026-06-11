import { create } from 'zustand';

import type { SleepRecord } from '@/types';

interface SleepState {
  records: SleepRecord[];
  addSleep: (start: string, end: string, quality: SleepRecord['quality']) => string;
  removeSleep: (id: string) => void;
  lastRecord: () => SleepRecord | null;
}

export const useSleepStore = create<SleepState>((set, get) => ({
  records: [],

  addSleep: (start, end, quality) => {
    const id = Date.now().toString();
    set((state) => ({
      records: [
        ...state.records,
        { id, start, end, quality },
      ],
    }));
    return id;
  },

  removeSleep: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    })),

  lastRecord: () => get().records[0] ?? null,
}));
