import { Tabs } from 'expo-router';

import AppTabs from '@/components/app-tabs';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => <AppTabs />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="goals" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
