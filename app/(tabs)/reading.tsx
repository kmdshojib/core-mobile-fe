import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';
import { TopicCard } from '@/components/ui/topic-card';
import { API_BASE_URL, topicService, type TopicSummary } from '@/lib/topic-service';

export default function ReadingScreen() {
  const router = useRouter();
  const [backendTopics, setBackendTopics] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadTopics = async () => {
      setError('');

      try {
        const response = await topicService.getTopics();
        if (mounted) setBackendTopics(response.data);
      } catch {
        if (mounted) {
          setBackendTopics([]);
          setError(`Could not load topics from ${API_BASE_URL}`);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTopics();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleTopics = backendTopics.map((topic) => ({
    title: topic.title,
    slug: topic.slug,
  }));

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Reading" subtitle="Grammar topics and concept drills" />
      <Screen>
        {loading ? (
          <Text className="mb-4 text-sm text-muted-foreground dark:text-slate-400">Loading topics...</Text>
        ) : null}
        {error ? (
          <View className="mb-4 rounded-[20px] border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
            <Text className="text-sm font-semibold text-rose-700 dark:text-rose-200">Backend connection failed</Text>
            <Text className="mt-2 text-sm leading-6 text-rose-700 dark:text-rose-200">{error}</Text>
          </View>
        ) : null}
        <View className="gap-4">
          {!loading && visibleTopics.length === 0 && !error ? (
            <Text className="text-sm text-muted-foreground dark:text-slate-400">No topics found.</Text>
          ) : null}
          {visibleTopics.map((topic) => (
            <TopicCard key={topic.slug} title={topic.title} onPress={() => router.push(`/reading/${topic.slug}` as never)} />
          ))}
        </View>
      </Screen>
    </View>
  );
}
