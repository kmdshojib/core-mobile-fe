import { Text, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';

export default function MockScreen() {
  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Mock Master" subtitle="Ready your full-length practice sessions" />
      <Screen>
        <View className="rounded-[28px] border border-border bg-card p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <Text className="text-2xl font-bold text-foreground dark:text-slate-50">Full mock exams are on deck.</Text>
          <Text className="mt-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
            This matches the web app’s feature tile and gives the mobile app a themed destination for upcoming test flows.
          </Text>
          <View className="mt-5 rounded-[24px] bg-indigo-50 p-4 dark:bg-indigo-950/40">
            <Text className="text-sm font-semibold text-primary">3 test formats</Text>
            <Text className="mt-2 text-sm text-foreground dark:text-slate-100">Timed mode, quick practice, and revision-focused retakes.</Text>
          </View>
          <View className="mt-5">
            <PrimaryButton label="Start Mock Soon" disabled />
          </View>
        </View>
      </Screen>
    </View>
  );
}
