import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { Screen } from '@/components/ui/screen';
import { TopicCard } from '@/components/ui/topic-card';
import { slugify, topics } from '@/lib/data';

export default function ReadingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader title="Reading" subtitle="Grammar topics and concept drills" />
      <Screen>
        <View className="gap-4">
          {topics.map((topic) => (
            <TopicCard key={topic} title={topic} onPress={() => router.push(`/reading/${slugify(topic)}` as never)} />
          ))}
        </View>
      </Screen>
    </View>
  );
}
