import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';

import { getSupabase } from '@/lib/supabase';
import { useProfileStore, profileToRow } from '@/store/profile-store';

async function handleCallback(url: string) {
  const supabase = getSupabase();

  if (url.includes('code=')) {
    const { error } = await supabase.auth.exchangeCodeForSession(url);
    if (error) {
      console.warn('Code exchange:', error.message);
      router.replace('/auth?mode=login');
      return;
    }
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    try {
      await supabase.from('user_profile').upsert({
        id: session.user.id,
        ...profileToRow(useProfileStore.getState().profile),
        name: session.user.user_metadata?.name ?? useProfileStore.getState().profile.name,
      }, { onConflict: 'id' });
    } catch {}
    await useProfileStore.getState().loadProfile(session.user.id);
    router.replace('/(tabs)');
  } else {
    router.replace('/auth?mode=login');
  }
}

export default function AuthCallbackScreen() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      handleCallback(window.location.href);
      return;
    }

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleCallback(url);
        return;
      }
    });

    const subscription = Linking.addEventListener('url', (event) => {
      handleCallback(event.url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22C55E" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A' },
});
