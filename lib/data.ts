export type AppAction = {
  key: string;
  label: string;
  icon: string;
  color: 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose';
  route?: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correctOptionId: string;
  explanation: string;
};

export const actions: AppAction[] = [
  { key: 'mock', label: 'Mock Master', icon: 'bullseye-arrow', color: 'indigo', route: '/(tabs)/mock' },
  { key: 'reading', label: 'Reading', icon: 'book-open-page-variant-outline', color: 'violet', route: '/(tabs)/reading' },
  { key: 'vocab', label: 'Vocab Booster', icon: 'spellcheck', color: 'emerald' },
  { key: 'previous', label: 'Previous Year Question', icon: 'history', color: 'amber', route: '/(tabs)/history' },
  { key: 'expert', label: 'Topic Expert', icon: 'school-outline', color: 'rose', route: '/(tabs)/profile' },
];

export const topics = [
  'Basic Part',
  'Sentence Structure',
  'Noun',
  'Number',
  'Gender',
  'Pronoun',
  'Adjective',
  'Verb',
  'Modal Auxiliary',
  'Gerund',
  'Participle',
  'Adverb',
  'Infinitive',
  'Tenses',
  'Vocabulary',
  'Idioms',
  'Phrasal Verbs',
];

export const readingContent: Record<string, { title: string; body: string; keyPoints: string[] }> = {
  default: {
    title: 'Topic Overview',
    body:
      'A solid understanding of this topic is essential for mastering English grammar. This section walks you through the core concepts, rules, and common exceptions that appear frequently in competitive exams.\n\nStudy each rule carefully, pay attention to the examples, and practice the previous year questions below to solidify your understanding.',
    keyPoints: [
      'Understand the definition and core usage',
      'Memorise the key rules and exceptions',
      'Practice with real exam-style questions',
      'Review explanations for every answer',
    ],
  },
  noun: {
    title: 'Noun',
    body:
      'A noun is a word that names a person, place, thing, or idea. Nouns are one of the most fundamental parts of speech in English and appear in virtually every sentence.\n\nNouns can function as the subject of a sentence, the object of a verb, or the object of a preposition. They can be singular or plural, and they can be concrete or abstract.',
    keyPoints: [
      'Types: Common, Proper, Abstract, Collective, Material',
      'Singular and Plural forms',
      'Countable vs. Uncountable nouns',
      'Noun as Subject, Object, and Complement',
    ],
  },
  verb: {
    title: 'Verb',
    body:
      'A verb expresses action, occurrence, or a state of being. Verbs are the heart of every English sentence, and they change form to show tense, voice, and mood.\n\nMastery of verbs is crucial for grammar MCQs, writing, and comprehension.',
    keyPoints: [
      'Main, Auxiliary, and Modal verbs',
      'Transitive vs. Intransitive verbs',
      'Finite vs. Non-finite verbs',
      'Regular and Irregular verb forms',
    ],
  },
  tenses: {
    title: 'Tenses',
    body:
      'Tense locates an event or state in time. English has three primary tenses, and each one appears in four aspects: Simple, Continuous, Perfect, and Perfect Continuous.\n\nMastering tenses improves both grammar accuracy and speed in exam settings.',
    keyPoints: [
      '12 tense structures in total',
      'Signal words for each tense',
      'Active and Passive voice transformations',
      'Common mistakes in tense usage',
    ],
  },
};

export const previousYearQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which of the following sentences uses the correct form of the noun?',
    options: [
      { label: 'A', text: 'The informations are incorrect.' },
      { label: 'B', text: 'The information is incorrect.' },
      { label: 'C', text: 'The informations is incorrect.' },
      { label: 'D', text: 'An information are incorrect.' },
    ],
    correctOptionId: 'B',
    explanation: '"Information" is uncountable, so it does not take a plural form or the article "an".',
  },
  {
    id: 2,
    question: 'Choose the correct sentence:',
    options: [
      { label: 'A', text: "She don't know the answer." },
      { label: 'B', text: "She doesn't knows the answer." },
      { label: 'C', text: "She doesn't know the answer." },
      { label: 'D', text: 'She do not knows the answer.' },
    ],
    correctOptionId: 'C',
    explanation: 'With third-person singular subjects, use "doesn\'t" plus the base form of the verb.',
  },
  {
    id: 3,
    question: 'Which sentence is in the Present Perfect Tense?',
    options: [
      { label: 'A', text: 'He is writing a letter.' },
      { label: 'B', text: 'He wrote a letter.' },
      { label: 'C', text: 'He has written a letter.' },
      { label: 'D', text: 'He will write a letter.' },
    ],
    correctOptionId: 'C',
    explanation: 'Present Perfect is formed with has or have plus the past participle.',
  },
];

export const navItems = [
  { name: 'index', label: 'Home', icon: 'home-variant-outline' },
  { name: 'reading', label: 'Reading', icon: 'book-open-page-variant-outline' },
  { name: 'mock', label: 'Mock', icon: 'clipboard-text-outline' },
  { name: 'history', label: 'History', icon: 'history' },
  { name: 'profile', label: 'Profile', icon: 'account-outline' },
];

export const formatTopicLabel = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '-');
