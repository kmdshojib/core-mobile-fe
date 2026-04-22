import { Text, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';

const sessions = [
  { title: 'Noun practice set', score: '8/10', time: 'Today' },
  { title: 'Reading comprehension mock', score: '19/25', time: 'Yesterday' },
  { title: 'Tenses quick quiz', score: '14/15', time: 'Last week' },
];

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="History" subtitle="Recent activity and previous attempts" />
      <Screen>
        <View className="gap-4">
          {sessions.map((session) => (
            <View key={session.title} className="rounded-[24px] border border-border bg-card p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <Text className="text-base font-semibold text-foreground dark:text-slate-100">{session.title}</Text>
              <Text className="mt-2 text-sm text-muted-foreground dark:text-slate-400">{session.time}</Text>
              <View className="mt-4 self-start rounded-full bg-amber-100 px-3 py-2">
                <Text className="text-xs font-semibold uppercase tracking-[1px] text-amber-700">{session.score}</Text>
              </View>
            </View>
          ))}
        </View>
      </Screen>
    </View>
  );
}
