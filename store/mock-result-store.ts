import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { TopicQuestion } from '@/lib/topic-service';
import { persistentStorage } from '@/lib/persistent-storage';

export interface MockResultRow {
  id: number;
  topic: string;
  prompt: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  status: 'Correct' | 'Wrong' | 'Unanswered';
  mark: number;
}

export interface MockResult {
  id: string;
  submittedAt: string;
  topics: string[];
  totalTime: number;
  hasNegativeMarking: boolean;
  totalQuestions: number;
  answers: Record<number, number>;
  questions: TopicQuestion[];
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  rows: MockResultRow[];
}

interface MockResultState {
  results: Record<string, MockResult>;
  saveResult: (result: MockResult) => void;
}

export const useMockResultStore = create<MockResultState>()(
  persist(
    (set) => ({
      results: {},
      saveResult: (result) =>
        set((state) => ({
          results: {
            ...state.results,
            [result.id]: result,
          },
        })),
    }),
    {
      name: 'core-english-mock-results',
      storage: createJSONStorage(() => persistentStorage),
    },
  ),
);
