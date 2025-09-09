type Filler = {
  phrase: string;
  striked: string[];
};

const SINGLE_WORD_FILLERS: Filler[] = [
  { phrase: 'actually', striked: ['actually'] },
  { phrase: 'basically', striked: ['basically'] },
  { phrase: 'literally', striked: ['literally'] },
  { phrase: 'seriously', striked: ['seriously'] },
  { phrase: 'really', striked: ['really'] },
  { phrase: 'very', striked: ['very'] },
  { phrase: 'quite', striked: ['quite'] },
  { phrase: 'just', striked: ['just'] },
  { phrase: 'totally', striked: ['totally'] },
  { phrase: 'completely', striked: ['completely'] },
  { phrase: 'absolutely', striked: ['absolutely'] },
  { phrase: 'definitely', striked: ['definitely'] },
  { phrase: 'extremely', striked: ['extremely'] },
  { phrase: 'probably', striked: ['probably'] },
  { phrase: 'maybe', striked: ['maybe'] },
  { phrase: 'kind', striked: ['kind'] },
  { phrase: 'sort', striked: ['sort'] },
  { phrase: 'stuff', striked: ['stuff'] },
  { phrase: 'things', striked: ['things'] },
  { phrase: 'etc', striked: ['etc'] },
];

const MULTI_WORD_FILLERS: Filler[] = [
  { phrase: 'kind of', striked: ['kind'] },
  { phrase: 'sort of', striked: ['sort'] },
  { phrase: 'in order to', striked: ['in order'] },
  { phrase: 'due to the fact that', striked: ['due to the fact'] },
  { phrase: 'the fact that', striked: ['the fact'] },
  {
    phrase: 'for all intents and purposes',
    striked: ['for all intents and purposes'],
  },
  { phrase: 'at the end of the day', striked: ['at the end of the day'] },
  { phrase: 'as a matter of fact', striked: ['as a matter of fact'] },
  { phrase: 'in my opinion', striked: ['in my opinion'] },
  { phrase: 'i think', striked: ['i think'] },
  { phrase: 'i believe', striked: ['i believe'] },
  { phrase: 'i feel like', striked: ['i feel like'] },
  { phrase: 'it seems like', striked: ['it seems like'] },
  { phrase: 'in terms of', striked: ['in terms of'] },
  { phrase: 'at this point in time', striked: ['at this point in time'] },
];

const REDUNDANT_INTENSIFIERS: Filler[] = [
  { phrase: 'absolutely essential', striked: ['absolutely'] },
  { phrase: 'absolutely necessary', striked: ['absolutely'] },
  { phrase: 'completely unanimous', striked: ['completely'] },
  { phrase: 'future plans', striked: ['future'] },
  { phrase: 'past history', striked: ['past'] },
  { phrase: 'unexpected surprise', striked: ['unexpected'] },
  { phrase: 'advance planning', striked: ['advance'] },
  { phrase: 'basic fundamentals', striked: ['basic'] },
];

export const FILLER_WORDS = [
  ...SINGLE_WORD_FILLERS,
  ...MULTI_WORD_FILLERS,
  ...REDUNDANT_INTENSIFIERS,
];
