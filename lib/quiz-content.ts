import type { TopicQuestion } from '@/lib/topic-service';

export type QuestionSource = 'practice' | 'previous' | 'all';

const QUESTION_BANK: TopicQuestion[] = [
  {
    id: 1,
    topic: 'Grammar',
    prompt: 'Choose the correct sentence.',
    options: ['He go to school.', 'He goes to school.', 'He going school.', 'He gone to school.'],
    answer: 1,
    explanation:
      "He goes to school is correct because the subject is third person singular, so the verb takes 'es'.",
    source: 'Topic Practice',
  },
  {
    id: 2,
    topic: 'Noun',
    prompt: 'Identify the noun in the sentence: The teacher smiled.',
    options: ['The', 'teacher', 'smiled', 'sentence'],
    answer: 1,
    explanation: 'Teacher is the naming word here, so it functions as the noun in the sentence.',
    source: 'Topic Practice',
  },
  {
    id: 3,
    topic: 'Vocabulary',
    prompt: "Select the correct synonym of 'rapid'.",
    options: ['slow', 'quick', 'weak', 'late'],
    answer: 1,
    explanation: "Rapid means fast or quick, so 'quick' is the closest synonym.",
    source: 'Topic Practice',
  },
  {
    id: 4,
    topic: 'Modal Auxiliary',
    prompt: 'Which one is a modal auxiliary?',
    options: ['can', 'run', 'book', 'quickly'],
    answer: 0,
    explanation: "'Can' is a modal auxiliary because it helps express ability or possibility.",
    source: 'Topic Practice',
  },
  {
    id: 5,
    topic: 'Number',
    prompt: "Choose the correct plural form of 'child'.",
    options: ['childs', 'childes', 'children', 'childrens'],
    answer: 2,
    explanation: "'Children' is the irregular plural form of 'child'.",
    source: 'Topic Practice',
  },
];

const PREVIOUS_YEAR_BANK: TopicQuestion[] = [
  {
    id: 1,
    topic: 'Noun',
    prompt: 'Which of the following sentences uses the correct form of the noun?',
    options: [
      'The informations are incorrect.',
      'The information is incorrect.',
      'The informations is incorrect.',
      'An information are incorrect.',
    ],
    answer: 1,
    explanation: '"Information" is an uncountable noun and does not take a plural form or the article "an".',
    source: 'BCS Previous Year',
  },
  {
    id: 2,
    topic: 'Verb',
    prompt: 'Choose the correct sentence.',
    options: [
      "She don't know the answer.",
      "She doesn't knows the answer.",
      "She doesn't know the answer.",
      'She do not knows the answer.',
    ],
    answer: 2,
    explanation: 'With third-person singular subjects, use "doesn\'t" with the base form of the verb.',
    source: 'Bank Previous Year',
  },
  {
    id: 3,
    topic: 'Tenses',
    prompt: 'Which sentence is in the Present Perfect Tense?',
    options: [
      'He is writing a letter.',
      'He wrote a letter.',
      'He has written a letter.',
      'He will write a letter.',
    ],
    answer: 2,
    explanation: 'Present Perfect is formed with "has/have + past participle".',
    source: 'Primary Previous Year',
  },
];

export function getMockExamQuestions(
  topics: string[],
  questionCount: number,
  source: QuestionSource = 'all',
) {
  const bank =
    source === 'practice'
      ? QUESTION_BANK
      : source === 'previous'
        ? PREVIOUS_YEAR_BANK
        : [...QUESTION_BANK, ...PREVIOUS_YEAR_BANK];

  return Array.from({ length: questionCount }, (_, index) => {
    const base = bank[index % bank.length];
    const topic = topics[index % topics.length] || 'Mock Master';

    return {
      ...base,
      id: index + 1,
      topic,
      prompt: `${base.prompt} (${topic})`,
    };
  });
}
