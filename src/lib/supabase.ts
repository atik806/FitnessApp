import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

let client: ReturnType<typeof createClient> | null = null;

function createClient() {
  const { createClient } = require('@supabase/supabase-js');

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

  let storage: any = undefined;

  if (Platform.OS !== 'web' || typeof window !== 'undefined') {
    try {
      storage = require('@react-native-async-storage/async-storage').default;
    } catch {
      try {
        storage = {
          getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
          setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
          removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
        };
      } catch {}
    }
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });
}

export function getSupabase() {
  if (!client) client = createClient();
  return client;
}
