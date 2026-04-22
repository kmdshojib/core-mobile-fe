import { Tabs } from 'expo-router';
import React from 'react';

import { TabBar } from '@/components/ui/tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: 'Reading',
        }}
      />
      <Tabs.Screen
        name="mock"
        options={{
          title: 'Mock',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
