import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TABS = [
  { name: '/(tabs)', icon: '📊', label: 'Dashboard' },
  { name: '/(tabs)/stats', icon: '📈', label: 'Stats' },
  { name: 'log', icon: '+', label: 'Log', isLog: true },
  { name: '/(tabs)/goals', icon: '🎯', label: 'Goals' },
  { name: '/(tabs)/profile', icon: '⚙️', label: 'Profile' },
];

function TabButton({
  tab,
  isActive,
  onPress,
}: {
  tab: (typeof TABS)[number];
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isActive ? 1 : 0.6);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  function handlePressIn() {
    scale.value = withSpring(0.92);
  }

  function handlePressOut() {
    scale.value = withSpring(1);
    opacity.value = withSpring(isActive ? 1 : 0.6);
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.tab, tab.isLog && styles.logTab]}
    >
      <Animated.View style={[style, { alignItems: 'center', gap: 1 }]}>
        {tab.isLog ? (
          <View style={[styles.logButton, { backgroundColor: '#22C55E' }]}>
            <View style={styles.logInner}>
              <Text style={styles.logIcon}>{tab.icon}</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={[styles.tabIcon, { color: isActive ? '#22C55E' : '#94A3B8' }]}>
              {tab.icon}
            </Text>
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#22C55E' : '#94A3B8', fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {tab.label}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  function handlePress(name: string) {
    if (name === 'log') router.push('/log' as any);
    else router.push(name as any);
  }

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom + Spacing.one,
          backgroundColor: theme.cardBg,
          borderTopColor: theme.glassBorder,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.name || (tab.name === '/(tabs)' && pathname === '/');
        return (
          <TabButton
            key={tab.name}
            tab={tab}
            isActive={isActive}
            onPress={() => handlePress(tab.name)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.one,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  logTab: { marginTop: -16 },
  logButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  logIcon: { fontSize: 28, color: '#fff', fontWeight: '300', marginTop: -2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 10 },
});
