import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { QuizQuestion } from '@/lib/data';

type QuizCardProps = {
  question: QuizQuestion;
};

export function QuizCard({ question }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View className="rounded-[24px] border border-border bg-card p-4 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <Text className="text-base font-semibold leading-6 text-foreground dark:text-slate-100">{question.question}</Text>
      <View className="mt-4 gap-3">
        {question.options.map((option) => {
          const isSelected = selected === option.label;
          const isCorrect = selected && option.label === question.correctOptionId;
          const isWrong = isSelected && option.label !== question.correctOptionId;

          return (
            <Pressable
              key={option.label}
              className={`rounded-2xl border px-4 py-3 ${
                isCorrect ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : isWrong ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40' : isSelected ? 'border-primary bg-indigo-50 dark:bg-indigo-950/40' : 'border-border bg-white dark:border-slate-700 dark:bg-slate-950'
              }`}
              onPress={() => setSelected(option.label)}>
              <Text className="text-sm font-medium text-foreground dark:text-slate-100">
                {option.label}. <Text className="font-normal">{option.text}</Text>
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selected ? (
        <View className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground dark:text-slate-400">Explanation</Text>
          <Text className="mt-2 text-sm leading-6 text-foreground dark:text-slate-100">{question.explanation}</Text>
        </View>
      ) : null}
    </View>
  );
}
