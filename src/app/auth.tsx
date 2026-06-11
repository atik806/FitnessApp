import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getAuthRedirectUri } from '@/lib/auth-redirect';
import { getSupabase } from '@/lib/supabase';
import { useProfileStore, profileToRow } from '@/store/profile-store';

WebBrowser.maybeCompleteAuthSession();

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const { mode: paramMode } = useLocalSearchParams<{ mode: string }>();
  const [mode, setMode] = useState<Mode>(paramMode === 'signup' ? 'signup' : 'login');
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectUri = getAuthRedirectUri();

  useEffect(() => {
    (async () => {
      const { data } = await getSupabase().auth.getSession();
      if (data?.session) {
        await useProfileStore.getState().loadProfile(data.session.user.id);
        router.replace('/(tabs)');
      }
    })();
  }, []);

  function switchMode(m: Mode) {
    setMode(m);
    setError('');
  }

  async function handleSubmit() {
    setError('');
    if (!email.trim()) { setError('Enter your email'); return; }
    if (!password.trim() || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (mode === 'signup' && !name.trim()) { setError('Enter your name'); return; }

    setLoading(true);
    try {
      const supabase = getSupabase();
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: redirectUri,
          },
        });
        if (signUpError) { setError(signUpError.message); return; }
        if (data?.user) {
          try { await supabase.from('user_profile').upsert({
            id: data.user.id,
            ...profileToRow(useProfileStore.getState().profile),
            name: name.trim(),
          }, { onConflict: 'id' }); } catch {}
        }
        if (data?.session) {
          await useProfileStore.getState().loadProfile(data.session.user.id);
          router.replace('/(tabs)');
        } else {
          setError('Check your email for the confirmation link');
          setLoading(false);
          return;
        }
      } else {
        const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) { setError(signInError.message); return; }
        if (loginData?.session) {
          await useProfileStore.getState().loadProfile(loginData.session.user.id);
        }
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError('');
    try {
      const supabase = getSupabase();
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
        },
      });

      if (oauthError) { setError(oauthError.message); return; }

      if (data?.url) {
        if (Platform.OS === 'web') {
          window.location.href = data.url;
        } else {
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
          if (result.type === 'success' && result.url) {
            const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
            if (exchangeError) { setError(exchangeError.message); return; }
            if (session?.user) {
              try { await supabase.from('user_profile').upsert({
                id: session.user.id,
                ...profileToRow(useProfileStore.getState().profile),
                name: session.user.user_metadata?.name ?? useProfileStore.getState().profile.name,
              }, { onConflict: 'id' }); } catch {}
              await useProfileStore.getState().loadProfile(session.user.id);
              router.replace('/(tabs)');
            }
          } else if (result.type !== 'cancel' && result.type !== 'dismiss') {
            setError('Google sign-in was interrupted. Please try again.');
          }
        }
      }
    } catch (e: any) {
      setError('Google sign-in failed: ' + (e?.message ?? 'unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1a2a1a', '#0F172A']} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(500).springify()} style={styles.header}>
            <Text style={styles.emoji}>{mode === 'signup' ? '🚀' : '👋'}</Text>
            <Text style={styles.title}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.subtitle}>
              {mode === 'signup' ? 'Start your fitness journey today' : 'Continue your fitness journey'}
            </Text>
          </Animated.View>

          <View style={styles.toggleRow}>
            <Pressable onPress={() => switchMode('login')} style={[styles.toggleTab, mode === 'login' ? styles.toggleActive : null]}>
              <Text style={[styles.toggleText, mode === 'login' ? styles.toggleTextActive : null]}>Log In</Text>
            </Pressable>
            <Pressable onPress={() => switchMode('signup')} style={[styles.toggleTab, mode === 'signup' ? styles.toggleActive : null]}>
              <Text style={[styles.toggleText, mode === 'signup' ? styles.toggleTextActive : null]}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {mode === 'signup' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor="#64748B"
                  autoCapitalize="words"
                />
              </View>
            ) : null}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#64748B"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            <Pressable onPress={handleSubmit} disabled={loading} style={styles.submitBtn}>
              <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.submitGradient}>
                <Text style={styles.submitText}>
                  {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />
            </View>

            <Pressable onPress={handleGoogleSignIn} disabled={loading} style={styles.googleBtn}>
              <View style={styles.googleInner}>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleText}>
                  {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => router.back()} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back to home</Text>
            </Pressable>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', gap: 24, paddingHorizontal: 24 },
  header: { alignItems: 'center', gap: 8 },
  emoji: { fontSize: 48 },
  title: { fontSize: 28, fontWeight: '900', color: '#F1F5F9' },
  subtitle: { fontSize: 14, fontWeight: '500', color: '#94A3B8' },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 4,
    width: '100%',
    maxWidth: 320,
  },
  toggleTab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11 },
  toggleActive: { backgroundColor: 'rgba(34,197,94,0.2)' },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  toggleTextActive: { color: '#4ADE80' },
  form: { width: '100%', maxWidth: 360, gap: 16 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  errorText: { fontSize: 13, fontWeight: '600', color: '#F87171' },
  submitBtn: {
    borderRadius: 60,
    overflow: 'hidden',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  submitGradient: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  submitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  googleBtn: {
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  googleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    backgroundColor: '#4285F4',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
  },
  googleText: { fontSize: 15, fontWeight: '700', color: '#F1F5F9' },
  backLink: { alignItems: 'center', paddingVertical: 8 },
  backLinkText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
});
