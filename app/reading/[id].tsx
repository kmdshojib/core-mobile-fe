import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { AppHeader } from '@/components/ui/app-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { QuizCard } from '@/components/ui/quiz-card';
import { Screen } from '@/components/ui/screen';
import { formatTopicLabel, previousYearQuestions, readingContent } from '@/lib/data';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);

  const label = useMemo(() => formatTopicLabel(id ?? 'topic'), [id]);
  const content = readingContent[id ?? ''] ?? { ...readingContent.default, title: label };
  const paragraphs = content.body.split('\n\n');

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title={label} subtitle="Reading" showBack onBackPress={() => router.back()} />
      <Screen>
        <View className="overflow-hidden rounded-[28px] border border-primary/15 bg-white px-5 py-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <View className="relative">
            <View className="h-14 w-14 items-center justify-center rounded-3xl bg-primary/10">
              <MaterialCommunityIcons name="book-open-page-variant-outline" size={26} color="#6366f1" />
            </View>
            <Text className="mt-4 text-xs font-semibold uppercase tracking-[2px] text-muted-foreground">Reading</Text>
            <Text className="mt-2 text-3xl font-bold text-foreground dark:text-slate-50">{label}</Text>
            <View className="mt-4 flex-row flex-wrap gap-2">
              {['Concepts', 'Examples', 'Practice'].map((tag, index) => (
                <View key={tag} className={`rounded-full px-3 py-2 ${index === 0 ? 'bg-primary/15 dark:bg-indigo-400/15' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Text className={`text-xs font-semibold ${index === 0 ? 'text-primary dark:text-indigo-300' : 'text-muted-foreground dark:text-slate-400'}`}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-5 rounded-[28px] border border-border bg-card p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-violet-100">
              <MaterialCommunityIcons name="book-open-variant" size={20} color="#8b5cf6" />
            </View>
            <Text className="text-lg font-bold text-foreground dark:text-slate-100">Reading Material</Text>
          </View>

          <View className="mt-5 gap-4">
            {paragraphs.map((paragraph) => (
              <Text key={paragraph} className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                {paragraph}
              </Text>
            ))}
          </View>

          <View className="mt-5 rounded-[24px] bg-indigo-50 p-4 dark:bg-indigo-950/40">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-muted-foreground dark:text-slate-400">Key Points</Text>
            <View className="mt-3 gap-3">
              {content.keyPoints.map((point, index) => (
                <View key={point} className="flex-row gap-3">
                  <View className="mt-1 h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                    <Text className="text-[10px] font-bold text-primary">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-sm leading-6 text-foreground dark:text-slate-100">{point}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-5 rounded-[28px] border border-border bg-card p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <Pressable className="flex-row items-center justify-between" onPress={() => setExpanded((value) => !value)}>
            <View>
              <Text className="text-lg font-bold text-foreground dark:text-slate-100">Previous Year Questions</Text>
              <Text className="mt-1 text-sm text-muted-foreground dark:text-slate-400">{previousYearQuestions.length} questions from past exams</Text>
            </View>
            <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={22} color="#64748b" />
          </Pressable>

          {expanded ? (
            <View className="mt-5 gap-4">
              {previousYearQuestions.map((question) => (
                <QuizCard key={question.id} question={question} />
              ))}
            </View>
          ) : null}
        </View>

        <View className="mt-5 overflow-hidden rounded-[28px] border border-primary/15 bg-white px-5 py-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <View className="relative">
            <Text className="text-lg font-bold text-foreground dark:text-slate-100">Ready to test yourself?</Text>
            <Text className="mt-2 text-sm leading-6 text-muted-foreground dark:text-slate-400">
              Take the full exam on {label} and track your score once that mobile flow is connected.
            </Text>
            <View className="mt-5">
              <PrimaryButton label="Take Exam Soon" disabled />
            </View>
          </View>
        </View>
      </Screen>
    </View>
  );
}
