import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 29,
  slug: '29-react19-actions',
  title: 'React 19 Actions',
  layout: 'drawer',
  pattern: 'Form actions',
  type: 'React Concept',
  summary: 'Challenge for the React Application Development batch. This product review form is written the React 18 way and has two bugs. Find them, then rewrite the form with React 19 Actions so both disappear, without any useState for loading or error.',
  concepts: ['Actions', 'useActionState', 'useFormStatus', 'useOptimistic', 'Form reset'],
  steps: [
    'Click "Post review" twice, quickly. Watch the timeline: how many POST requests? How many times does your review appear?',
    'Post a review shorter than 10 characters, then a good one. Does the error go away?',
    'Rewrite src/ReviewForm.tsx with React 19 Actions until both bugs are gone. README.md has the tasks and the checks.',
  ],
  challenges: [
    { level: 'Warm-up', text: 'Find and describe both bugs, and say which lines in ReviewForm.tsx cause them.' },
    { level: 'Core', text: 'Rewrite ReviewForm with React 19 Actions so both bugs disappear, with no useState for loading or error.' },
    { level: 'Stretch', text: 'Show the review instantly before the server answers, and make a rejected one disappear by itself.' },
  ],
  tour: [
    { target: '.rf-text', title: 'Write a review', text: 'This form is written the React 18 way: the text, the rating, loading and error are all useState.' },
    { target: '.rf-submit', title: 'Click twice, quickly', text: 'Click "Post review" two times in a row, before the first one finishes.' },
    { target: "section[aria-label='Network and render timeline']", title: 'How many requests?', text: 'Count the POST bars, then look at the reviews. That is bug number one.' },
    { target: '.demo-card[data-code]', title: 'Your turn', text: 'Find bug number two yourself, then rewrite src/ReviewForm.tsx with React 19 Actions. README.md tells you when you are done.' },
  ],
  challenge: 'Rewrite the review form with React 19 Actions so a double click sends one request and the error clears on the next try.',
  videoUrl: '',
};
