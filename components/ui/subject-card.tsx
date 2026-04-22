import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { PrimaryButton } from '@/components/ui/primary-button';

type SubjectCardProps = {
  title: string;
  progress: { completed: number; total: number };
  percentage: number;
};

export function SubjectCard({ title, progress, percentage }: SubjectCardProps) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="rounded-[28px] border border-border bg-card p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <View className="flex-row items-center gap-4">
        <View className="items-center justify-center">
          <Svg width={64} height={64}>
            <Circle cx="32" cy="32" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
            <Circle
              cx="32"
              cy="32"
              r={radius}
              stroke="#6366f1"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="32, 32"
            />
          </Svg>
          <View className="absolute items-center">
              <Text className="text-xs font-bold text-foreground dark:text-slate-100">
              {progress.completed}/{progress.total}
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground dark:text-slate-100">{title}</Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-slate-400">{percentage}% complete</Text>
          <Text className="mt-2 text-sm text-foreground dark:text-slate-100">Subtopics: 17</Text>
          <Text className="text-sm text-foreground dark:text-slate-100">Questions: 365</Text>
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <View className="flex-1">
          <PrimaryButton label="Questions" />
        </View>
        <View className="flex-1">
          <PrimaryButton label="Subtopics" variant="secondary" />
        </View>
        <View className="flex-1">
          <PrimaryButton label="Random Quiz" variant="outline" />
        </View>
      </View>
    </View>
  );
}
