import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { AppHeader } from '@/components/ui/app-header';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { topics as fallbackTopics } from '@/lib/data';
import { topicService } from '@/lib/topic-service';

const MIN_QUESTIONS = 10;
const MAX_QUESTIONS = 50;
const QUESTION_STEP = 5;

export default function MockScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [topicTitles, setTopicTitles] = useState(fallbackTopics);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState('25');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.setParams({ hideTabBar: selectedTopics.length > 0 ? 'true' : 'false' });
  }, [router, selectedTopics.length]);

  useEffect(() => {
    let mounted = true;

    const loadTopics = async () => {
      setLoading(true);

      try {
        const response = await topicService.getTopics();
        if (mounted && response.data.length > 0) {
          setTopicTitles(response.data.map((topic) => topic.title));
        }
      } catch {
        if (mounted) {
          setTopicTitles(fallbackTopics);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTopics();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return topicTitles;

    return topicTitles.filter((topic) => topic.toLowerCase().includes(query));
  }, [search, topicTitles]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic],
    );
  };

  const handleStartMock = () => {
    if (selectedTopics.length === 0) return;
    const parsedQuestions = Math.min(
      MAX_QUESTIONS,
      Math.max(MIN_QUESTIONS, Number(questionCount) || 25),
    );

    Alert.alert(
      'মক পরীক্ষা শুরু করবেন?',
      `নির্বাচিত ${selectedTopics.length}টি টপিক থেকে ${parsedQuestions}টি MCQ থাকবে। শুরু করলে টাইমার চালু হবে।`,
      [
        { text: 'না', style: 'cancel' },
        {
          text: 'শুরু করো',
          onPress: () =>
            router.push({
              pathname: '/mock-exam',
              params: {
                topics: selectedTopics.join('||'),
                questions: String(parsedQuestions),
                time: String(Math.max(10, parsedQuestions)),
                negative: 'true',
              },
            }),
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Mock Master" subtitle="Search topics and build a timed mock" />
      <View className="flex-1 relative">
        <Screen className={selectedTopics.length > 0 ? 'pb-40' : ''}>
          <View className="rounded-[24px] border border-border bg-card px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
              <TextInput
                className="flex-1 text-base text-foreground dark:text-slate-100"
                placeholder="Search mock master topics..."
                placeholderTextColor="#94a3b8"
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>

          <View className="mt-4 gap-3">
            {filteredTopics.map((topic) => {
              const selected = selectedTopics.includes(topic);

              return (
                <Pressable
                  key={topic}
                  className={`rounded-[24px] border px-5 py-5 shadow-card dark:shadow-none ${
                    selected
                      ? 'border-primary bg-primary/10 dark:bg-indigo-400/15'
                      : 'border-border bg-card dark:border-slate-800 dark:bg-slate-900'
                  }`}
                  onPress={() => toggleTopic(topic)}>
                  <View className="flex-row items-center justify-between gap-3">
                    <Text className="flex-1 text-lg font-semibold text-foreground dark:text-slate-100">{topic}</Text>
                    <MaterialCommunityIcons
                      name={selected ? 'check-circle' : 'plus-circle-outline'}
                      size={22}
                      color={selected ? '#6366f1' : '#64748b'}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>

          {loading && topicTitles.length === 0 ? (
            <View className="mt-4 rounded-2xl border border-border bg-card/70 px-4 py-6">
              <Text className="text-center text-sm text-muted-foreground">Loading topics...</Text>
            </View>
          ) : null}

          {!loading && filteredTopics.length === 0 ? (
            <View className="mt-4 rounded-2xl border border-dashed border-border bg-card/70 px-4 py-6">
              <Text className="text-center text-sm text-muted-foreground">No topics found for {search}.</Text>
            </View>
          ) : null}
        </Screen>

          {selectedTopics.length > 0 ? (
          <View className="absolute inset-x-0 bottom-0 border-t border-border bg-card/95 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/95">
            <View className="rounded-[28px] border border-border bg-background p-4 dark:border-slate-700 dark:bg-slate-950">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                    {selectedTopics.length} topics selected
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                    {Number(questionCount) || 25} questions • {Math.max(10, Number(questionCount) || 25)} minutes
                  </Text>
                </View>
              </View>
              <View className="mt-4 flex-row items-center gap-3">
                <Pressable
                  className="h-10 w-10 items-center justify-center rounded-full border border-border dark:border-slate-700"
                  onPress={() =>
                    setQuestionCount((value) =>
                      String(Math.max(MIN_QUESTIONS, (Number(value) || 25) - QUESTION_STEP)),
                    )
                  }>
                  <MaterialCommunityIcons name="minus" size={18} color="#64748b" />
                </Pressable>
                <TextInput
                  className="h-10 flex-1 rounded-full border border-border px-4 text-center text-base font-bold text-foreground dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  keyboardType="number-pad"
                  value={questionCount}
                  onChangeText={(value) => setQuestionCount(value.replace(/\D/g, ''))}
                  maxLength={2}
                />
                <Pressable
                  className="h-10 w-10 items-center justify-center rounded-full border border-border dark:border-slate-700"
                  onPress={() =>
                    setQuestionCount((value) =>
                      String(Math.min(MAX_QUESTIONS, (Number(value) || 25) + QUESTION_STEP)),
                    )
                  }>
                  <MaterialCommunityIcons name="plus" size={18} color="#64748b" />
                </Pressable>
              </View>
              <View className="mt-4">
                <PrimaryButton label="Start Mock" onPress={handleStartMock} />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
