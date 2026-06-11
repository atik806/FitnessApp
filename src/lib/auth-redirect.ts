import { getRedirectUrl } from 'expo-auth-session';
import { Platform } from 'react-native';

/** OAuth callback URL — must match Supabase Auth → URL Configuration → Redirect URLs. */
export function getAuthRedirectUri(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  // Uses the Expo Auth Proxy (auth.expo.io) on Android to bypass Chrome's
  // custom-scheme redirect block. Requires "owner" in app.json.
  return getRedirectUrl('auth/callback');
}
