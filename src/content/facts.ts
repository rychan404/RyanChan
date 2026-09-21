/** The three About fun facts. Each is one sentence with an inline clickable
 *  term that opens a popover, so the sentence is stored split three ways
 *  (docs/design/portfolio-home.dc.html:316,321,326). */
export type FactId = 'barns' | 'eggs' | 'sing';

export type Fact = {
  id: FactId;
  /** path fragment under /icons/ */
  icon: string;
  before: string;
  term: string;
  after: string;
  caption: string;
  slotHint: string;
  image?: string;
  imageWebp?: string;
};

export const FACTS: Fact[] = [
  {
    id: 'barns',
    icon: 'ui/seedlings-solid',
    before: 'Always passed by abandoned ',
    term: 'barns',
    after: ' and horses in my hometown',
    caption: "It's an ancient relic!",
    slotHint: 'Drop a hometown photo',
  },
  {
    id: 'eggs',
    icon: 'ui/fire-solid',
    before: 'On a quest to perfect the ultimate way to ',
    term: 'cook eggs',
    after: '',
    caption: 'I love eggs in 4 ways',
    slotHint: 'Drop an egg photo',
    image: '/assets/about/fact-eggs.png',
    imageWebp: '/assets/about/fact-eggs.webp',
  },
  {
    id: 'sing',
    icon: 'ui/music-solid',
    before: 'Would drop everything to ',
    term: 'sing',
    after: ' my heart out to pop songs on the radio',
    caption: 'Riptide by Vance Joy!',
    slotHint: 'Drop a singing photo',
  },
];
