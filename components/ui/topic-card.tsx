import { Pressable, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type TopicCardProps = {
  title: string;
  onPress?: () => void;
};

export function TopicCard({ title, onPress }: TopicCardProps) {
  return (
    <Pressable className="rounded-[24px] border border-border bg-card px-5 py-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none" onPress={onPress}>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-lg font-semibold text-foreground dark:text-slate-100">{title}</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#64748b" />
      </View>
    </Pressable>
  );
}
