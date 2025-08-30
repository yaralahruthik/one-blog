import type { POSOptionType } from '@/types/pos';

export const POS_OPTIONS_LIST: POSOptionType[] = [
  {
    label: 'Adjectives',
    posTag: 'Adjective',
    class: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    label: 'Nouns',
    posTag: 'Noun',
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Adverbs',
    posTag: 'Adverb',
    class: 'text-purple-600 dark:text-purple-400',
  },
  {
    label: 'Verbs',
    posTag: 'Verb',
    class: 'text-green-600 dark:text-green-400',
  },
  {
    label: 'Conjunctions',
    posTag: 'Conjunction',
    class: 'text-orange-600 dark:text-orange-400',
  },
];
