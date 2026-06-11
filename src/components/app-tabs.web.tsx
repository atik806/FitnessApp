import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TABS = [
  { name: '/(tabs)', icon: '📊', label: 'Dashboard' },
  { name: '/(tabs)/stats', icon: '📈', label: 'Stats' },
  { name: 'log', icon: '+', label: 'Log', isLog: true },
  { name: '/(tabs)/goals', icon: '🎯', label: 'Goals' },
  { name: '/(tabs)/profile', icon: '⚙️', label: 'Profile' },
];

export default function AppTabs() {
  const theme = useTheme();
  const pathname = usePathname();

  function handlePress(name: string) {
    if (name === 'log') router.push('/log' as any);
    else router.push(name as any);
  }

  return (
    <View
      style={[
        styles.tabBar,
        { backgroundColor: theme.cardBg, borderTopColor: theme.glassBorder },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.name || (tab.name === '/(tabs)' && pathname === '/');
        return (
          <Pressable
            key={tab.name}
            onPress={() => handlePress(tab.name)}
            style={[styles.tab, tab.isLog && styles.logTab]}
          >
            {tab.isLog ? (
              <View style={[styles.logButton, { backgroundColor: '#22C55E' }]}>
                <Text style={styles.logIcon}>{tab.icon}</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.tabIcon, { color: isActive ? '#22C55E' : '#94A3B8' }]}>
                  {tab.icon}
                </Text>
                <Text style={[styles.tabLabel, { color: isActive ? '#22C55E' : '#94A3B8' }]}>
                  {tab.label}
                </Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, gap: 1 },
  logTab: { marginTop: -16 },
  logButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(34, 197, 94, 0.3)',
  },
  logIcon: { fontSize: 28, color: '#fff', fontWeight: '300', marginTop: -2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 10, fontWeight: '500' },
});
