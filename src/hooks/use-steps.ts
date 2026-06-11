import { useEffect, useRef } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { useActivityStore } from '@/store';

let mockInterval: ReturnType<typeof setInterval> | null = null;

function startMockSteps() {
  if (mockInterval) return;
  mockInterval = setInterval(() => {
    const store = useActivityStore.getState();
    const hour = new Date().getHours();
    let inc = 0;
    if (hour >= 7 && hour <= 9) inc = Math.floor(Math.random() * 6) + 2;
    else if (hour >= 17 && hour <= 20) inc = Math.floor(Math.random() * 8) + 3;
    else if (hour >= 10 && hour <= 16) inc = Math.floor(Math.random() * 4) + 1;
    else inc = Math.floor(Math.random() * 2);
    if (inc > 0) store.updateSteps(store.today.steps + inc);
  }, 15000);
}

function stopMockSteps() {
  if (mockInterval) {
    clearInterval(mockInterval);
    mockInterval = null;
  }
}

export function useSteps() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let subscription: { remove: () => void } | null = null;

    async function init() {
      if (Platform.OS === 'web') {
        startMockSteps();
        return;
      }

      try {
        const { Pedometer } = require('expo-sensors');

        const isAvailable = await Pedometer.isAvailableAsync();
        if (!isAvailable) {
          startMockSteps();
          return;
        }

        let watchBaseline: number | null = null;

        const result = await Pedometer.getStepCountAsync(
          new Date(new Date().setHours(0, 0, 0, 0)),
          new Date(),
        );
        if (result?.numberOfSteps != null) {
          const store = useActivityStore.getState();
          if (result.numberOfSteps > store.today.steps) {
            store.updateSteps(result.numberOfSteps);
          }
        }

        subscription = Pedometer.watchStepCount((r: { numberOfSteps: number }) => {
          if (watchBaseline === null) {
            watchBaseline = r.numberOfSteps;
            return;
          }
          const delta = r.numberOfSteps - watchBaseline;
          if (delta >= 2) {
            watchBaseline = r.numberOfSteps;
            const store = useActivityStore.getState();
            store.updateSteps(store.today.steps + delta);
          }
        });
      } catch {
        startMockSteps();
      }
    }

    init();

    const handleAppState = (state: AppStateStatus) => {
      if (state === 'active') {
        if (Platform.OS !== 'web') {
          try {
            const { Pedometer } = require('expo-sensors');
            Pedometer.getStepCountAsync(
              new Date(new Date().setHours(0, 0, 0, 0)),
              new Date(),
            ).then((r: { numberOfSteps: number }) => {
              if (r?.numberOfSteps != null) {
                const store = useActivityStore.getState();
                if (r.numberOfSteps > store.today.steps) {
                  store.updateSteps(r.numberOfSteps);
                }
              }
            });
          } catch {}
        }
      }
    };

    const appSub = AppState.addEventListener('change', handleAppState);

    return () => {
      if (subscription) {
        try { subscription.remove(); } catch {}
      }
      appSub.remove();
      stopMockSteps();
    };
  }, []);
}
