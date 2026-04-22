import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { ActionCard } from '@/components/ui/action-card';
import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';
import { SubjectCard } from '@/components/ui/subject-card';
import { actions } from '@/lib/data';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Core English" subtitle="Mobile-first exam prep experience" />
      <Screen>
        <View className="rounded-[28px] border border-primary/15 bg-white px-5 py-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <View className="relative">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-primary">Dashboard</Text>
            <Text className="mt-2 text-3xl font-bold text-foreground dark:text-slate-50">Build exam confidence, one topic at a time.</Text>
            <Text className="mt-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
              The home grid, reading flow, and cards below are all translated from the web frontend into native screens.
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row flex-wrap gap-4">
          {actions.map((action, index) => (
            <View key={action.key} className={actions.length % 2 !== 0 && index === actions.length - 1 ? 'w-full' : 'w-[47%]'}>
              <ActionCard label={action.label} icon={action.icon} color={action.color} onPress={() => action.route && router.push(action.route as never)} />
            </View>
          ))}
        </View>

        <View className="mt-6">
          <SubjectCard title="English Grammar" progress={{ completed: 9, total: 17 }} percentage={53} />
        </View>
      </Screen>
    </View>
  );
}
