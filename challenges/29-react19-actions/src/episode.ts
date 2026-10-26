import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 29,
  slug: '29-react19-actions',
  title: 'React 19 Actions',
  layout: 'drawer',
  pattern: 'Form actions',
  type: 'React Concept',
  summary: 'Challenge for the React Application Development batch. The Trap tab is a review form written the React 18 way: four useStates, a try/catch/finally, and two bugs (double submit, an error that never clears). Rewrite it with React 19 Actions in the Pattern tab, then add useOptimistic in the Bonus tab.',
  concepts: ['Actions', 'useActionState', 'useFormStatus', 'useOptimistic', 'Form reset'],
  steps: [
    'Play with the Trap tab: double click "Post review" and watch two POST requests in the timeline. Post a review that is too short, then a good one: the old error stays.',
    'Task 1 · src/ActionForm.tsx: rewrite the form with <form action> and useActionState. No useState for loading or error.',
    'Task 2 · SubmitButton: disable it while posting with useFormStatus. A double click must send ONE request.',
    'Bonus · src/OptimisticForm.tsx: show the review instantly with useOptimistic; a rejected one ("Bad") disappears on its own.',
  ],
  challenges: [
    { level: 'Warm-up', text: 'Task 1: rewrite ActionForm with <form action> and useActionState. The error is the action\'s return value; the form resets after a success.' },
    { level: 'Core', text: 'Task 2: make SubmitButton disable itself and say "Posting…" with useFormStatus, so a double click sends one request.' },
    { level: 'Stretch', text: 'Task 3: add useOptimistic in OptimisticForm, so the review shows instantly and a rejected one rolls back by itself.' },
  ],
  tour: [
    { target: '.rf-text', title: 'Write a review', text: 'This is the React 18 version: the text, the rating, loading and error are all useState.' },
    { target: '.rf-submit', title: 'Click twice, quickly', text: 'Click "Post review" two times in a row, before the first one finishes.' },
    { target: "section[aria-label='Network and render timeline']", title: 'Two requests', text: 'Two POST requests went out, because nothing disabled the button. Your review is in the list twice.' },
    { target: '.demo-card[data-code]', title: 'All of this is state you manage', text: 'loading, error, preventDefault, try/catch/finally, and the button was still never disabled.' },
    { target: '.seg button:nth-of-type(2)', title: 'Your turn', text: 'Open the Pattern tab and src/ActionForm.tsx. Rewrite the form with a React 19 form action. The comments tell you when you are done.', action: 'click', after: 400 },
  ],
  challenge: 'Rewrite the review form with React 19 Actions: useActionState, useFormStatus, then useOptimistic.',
  videoUrl: '',
};
