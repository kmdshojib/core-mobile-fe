import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { AppHeader } from '@/components/ui/app-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { useMockResultStore } from '@/store/mock-result-store';

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default function MockResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const resultId = getParam(params.id);
  const result = useMockResultStore((state) => (resultId ? state.results[resultId] : null));

  if (!result) {
    return (
      <View className="flex-1 bg-background dark:bg-slate-950">
        <AppHeader title="মার্কশিট" showBack onBackPress={() => router.replace('/(tabs)/mock')} />
        <Screen>
          <View className="rounded-2xl border border-dashed border-border bg-card/70 px-4 py-8">
            <Text className="text-center font-semibold text-foreground dark:text-slate-100">No result found.</Text>
            <Text className="mt-1 text-center text-sm text-muted-foreground">Please submit a mock exam first.</Text>
          </View>
        </Screen>
      </View>
    );
  }

  const summaryRows = [
    ['Total Questions', result.totalQuestions],
    ['Answered', result.answeredCount],
    ['Correct', result.correctCount],
    ['Wrong', result.wrongCount],
    ['Unanswered', result.unansweredCount],
    ['Score', result.score],
  ] as const;

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader
        title="মার্কশিট"
        subtitle={`${result.topics.length}টি টপিক • সময়ঃ ${result.totalTime} মিনিট`}
        showBack
        onBackPress={() => router.replace('/(tabs)/mock')}
      />
      <Screen>
        <View className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <View className="mx-auto h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
            <MaterialCommunityIcons name="clipboard-check-outline" size={26} color="#059669" />
          </View>
          <Text className="mt-3 text-center text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            পরীক্ষা সাবমিট হয়েছে
          </Text>
          <Text className="mt-1 text-center text-3xl font-bold text-foreground dark:text-slate-50">
            {result.score}/{result.totalQuestions}
          </Text>
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl border border-border bg-card dark:border-slate-800 dark:bg-slate-900">
          {summaryRows.map(([label, value], index) => (
            <View
              key={label}
              className={`flex-row items-center justify-between px-4 py-3 ${index === summaryRows.length - 1 ? '' : 'border-b border-border dark:border-slate-800'}`}>
              <Text className="font-medium text-foreground dark:text-slate-100">{label}</Text>
              <Text className="font-bold text-foreground dark:text-slate-100">{value}</Text>
            </View>
          ))}
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl border border-border bg-card dark:border-slate-800 dark:bg-slate-900">
          {result.rows.map((row) => (
            <View key={row.id} className="border-b border-border px-4 py-4 last:border-b-0 dark:border-slate-800">
              <View className="flex-row items-center justify-between gap-3">
                <Text className="font-semibold text-foreground dark:text-slate-100">No. {row.id}</Text>
                <Text
                  className={`font-bold ${
                    row.status === 'Correct'
                      ? 'text-emerald-600'
                      : row.status === 'Wrong'
                        ? 'text-rose-600'
                        : 'text-muted-foreground'
                  }`}>
                  {row.status} ({row.mark})
                </Text>
              </View>
              <Text className="mt-2 text-sm text-muted-foreground">Selected: {row.selectedAnswer ?? '-'}</Text>
              <Text className="mt-1 text-sm text-muted-foreground">Correct: {row.correctAnswer}</Text>
            </View>
          ))}
        </View>

        <View className="mt-5 gap-3">
          <PrimaryButton
            label="মক রিভিউ ও ব্যাখ্যা"
            onPress={() =>
              router.push({
                pathname: '/mock-exam',
                params: { review: result.id, topics: result.topics.join('||'), questions: String(result.totalQuestions), time: String(result.totalTime) },
              })
            }
          />
          <Pressable onPress={() => router.replace('/(tabs)/mock')}>
            <Text className="text-center text-sm font-semibold text-primary">Back to Mock Master</Text>
          </Pressable>
        </View>
      </Screen>
    </View>
  );
}
