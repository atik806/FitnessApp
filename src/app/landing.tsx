import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/ui/glass';
import { useResponsive } from '@/hooks/use-responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CIRCLES = [
  { size: 180, x: -60, y: SCREEN_HEIGHT * 0.05, color: 'rgba(34,197,94,0.12)', duration: 3000 },
  { size: 120, x: SCREEN_WIDTH - 100, y: SCREEN_HEIGHT * 0.15, color: 'rgba(34,197,94,0.08)', duration: 4000 },
  { size: 250, x: SCREEN_WIDTH * 0.6, y: SCREEN_HEIGHT * 0.55, color: 'rgba(34,197,94,0.06)', duration: 3500 },
];

const FEATURES = [
  { icon: '👟', title: 'Smart Step Tracking', desc: 'Auto-track your daily steps with a beautiful circular ring' },
  { icon: '🏋️', title: 'Workout Logger', desc: 'Log runs, rides, lifts and every move in between' },
  { icon: '🎯', title: 'Smart Goals', desc: 'Set targets, track progress, crush your personal bests' },
];

function FloatingCircle({
  size,
  x,
  y: top,
  color,
  duration,
}: {
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
}) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-25, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: x,
          top,
        },
        animatedStyle,
      ]}
    />
  );
}

function SignupButton() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.94); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => {
          if (Platform.OS !== 'web') {
            try {
              const Haptics = require('expo-haptics');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch {}
          }
          router.push('/auth?mode=signup');
        }}
      >
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.signupBtn}
        >
          <Text style={styles.signupText}>Get Started Free</Text>
          <Text style={styles.signupArrow}>→</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const resp = useResponsive();
  const reduceMotion = resp.isSmall;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1a2a1a', '#0F172A']}
        style={StyleSheet.absoluteFill}
      />

      {!reduceMotion && CIRCLES.slice(0, 1).map((c, i) => (
        <FloatingCircle key={i} {...c} />
      ))}

      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40, paddingHorizontal: resp.contentPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(800)} style={styles.logoSection}>
          <View style={styles.logoWrapper}>
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              style={styles.logoBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoIcon}>💪</Text>
            </LinearGradient>
          </View>
          <Text style={styles.appName}>FitTrack</Text>
          <Text style={styles.tagline}>Your complete fitness companion</Text>
        </Animated.View>

        <View style={styles.featuresSection}>
          {FEATURES.map((f, i) => (
            <Animated.View key={f.title} entering={reduceMotion ? undefined : FadeInDown.duration(500).delay(300 + i * 200).springify()}>
              <Glass intensity="elevated" style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </Glass>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={reduceMotion ? undefined : BounceIn.duration(600).delay(1000)} style={styles.ctaSection}>
          <SignupButton />
          <Pressable onPress={() => router.push('/auth?mode=login')}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink}>Log in</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 32,
  },
  logoSection: {
    alignItems: 'center',
    gap: 12,
  },
  logoWrapper: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  logoBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F1F5F9',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#94A3B8',
  },
  featuresSection: {
    gap: 10,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
    borderRadius: 18,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    flex: 1,
    gap: 3,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  featureDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    lineHeight: 17,
  },
  ctaSection: {
    alignItems: 'center',
    gap: 18,
  },
  signupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 60,
    minWidth: SCREEN_WIDTH * 0.7,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  signupText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  signupArrow: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  loginText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  loginLink: {
    fontWeight: '700',
    color: '#4ADE80',
  },
});
