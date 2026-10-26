// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
// The whole series, for the "All examples" menu: every planned episode, grouped by category.
// An episode is live once it has a `file` (the file StackBlitz opens); the rest show muted as "soon".
import { BRAND } from './brand';

export type SeriesEpisode = { n: number; slug: string; title: string; category: string; pattern?: string; file?: string };

export const CATEGORIES = ["Data fetching", "Rendering & performance", "Hooks & effects", "State & forms", "UI, routing & testing"] as const;

export const EPISODES: SeriesEpisode[] = [
  { n: 1, slug: '01-race-conditions', title: 'Race Conditions', category: 'Data fetching', pattern: 'Abort stale requests', file: 'src/FixedSearch.tsx' },
  { n: 2, slug: '02-cart-persistence', title: 'Cart Empty After Refresh', category: 'State & forms' },
  { n: 3, slug: '03-error-boundaries', title: 'One Crash, Blank App', category: 'UI, routing & testing' },
  { n: 4, slug: '04-rules-of-hooks', title: 'A Hook Inside an If', category: 'Hooks & effects' },
  { n: 5, slug: '05-stale-closures', title: 'Counter Stuck at 1', category: 'Hooks & effects' },
  { n: 6, slug: '06-dependency-array', title: 'The Dependency Array', category: 'Hooks & effects' },
  { n: 7, slug: '07-strictmode-double-effect', title: 'Why useEffect Runs Twice', category: 'Hooks & effects' },
  { n: 8, slug: '08-keys-in-lists', title: 'Index as Key Bug', category: 'Rendering & performance', pattern: 'Stable identity keys', file: 'src/KeyedList.tsx' },
  { n: 9, slug: '09-you-might-not-need-an-effect', title: 'You Might Not Need an Effect', category: 'Hooks & effects' },
  { n: 10, slug: '10-controlled-vs-uncontrolled', title: 'Controlled vs Uncontrolled', category: 'State & forms' },
  { n: 11, slug: '11-context-rerenders', title: 'The Context Re-render Trap', category: 'Rendering & performance' },
  { n: 12, slug: '12-usememo-usecallback', title: 'useMemo & useCallback Myths', category: 'Rendering & performance' },
  { n: 13, slug: '13-custom-hooks', title: 'Build a Custom Hook', category: 'Hooks & effects' },
  { n: 14, slug: '14-lift-state-vs-store', title: 'Props, Context or Store?', category: 'State & forms' },
  { n: 15, slug: '15-url-as-state', title: 'Filters in the URL', category: 'UI, routing & testing' },
  { n: 16, slug: '16-token-refresh-queue', title: 'Token Expires Mid-Request', category: 'Data fetching' },
  { n: 17, slug: '17-axios-interceptors', title: 'Axios Interceptors', category: 'Data fetching' },
  { n: 18, slug: '18-protected-routes', title: 'Protected Routes & Roles', category: 'UI, routing & testing' },
  { n: 19, slug: '19-loaders-vs-useeffect', title: 'Loaders vs useEffect', category: 'Data fetching', pattern: 'Route loaders for page data', file: 'src/senior/routes.tsx' },
  { n: 20, slug: '20-slow-loader-suspense', title: 'Slow Loader Blocks Navigation', category: 'Data fetching' },
  { n: 21, slug: '21-optimistic-ui', title: 'Optimistic UI', category: 'Data fetching' },
  { n: 22, slug: '22-forms-rhf-zod', title: 'Forms with RHF + Zod', category: 'State & forms' },
  { n: 23, slug: '23-virtualised-lists', title: '10,000 Rows Are Janky', category: 'Rendering & performance' },
  { n: 24, slug: '24-realtime-batching', title: '50 Updates a Second', category: 'Rendering & performance' },
  { n: 25, slug: '25-server-vs-client-state', title: 'Server State vs Client State', category: 'Data fetching' },
  { n: 26, slug: '26-zustand-vs-redux', title: 'Zustand vs Redux Toolkit', category: 'State & forms' },
  { n: 27, slug: '27-compound-components', title: 'Compound Components', category: 'UI, routing & testing' },
  { n: 28, slug: '28-portals-modals', title: 'Modals with Portals', category: 'UI, routing & testing' },
  { n: 29, slug: '29-react19-actions', title: 'React 19 Actions', category: 'State & forms' },
  { n: 30, slug: '30-testing-what-to-test', title: 'What to Test in React', category: 'UI, routing & testing' },
  { n: 31, slug: '31-why-did-it-rerender', title: 'Why Did It Re-render?', category: 'Rendering & performance' },
  { n: 32, slug: '32-props-into-state', title: 'Copying Props into State', category: 'State & forms' },
  { n: 33, slug: '33-useref-vs-usestate', title: 'useRef vs useState', category: 'Hooks & effects' },
  { n: 34, slug: '34-code-splitting', title: 'A 2 MB Bundle on Mobile', category: 'Rendering & performance' },
  { n: 35, slug: '35-where-does-state-live', title: 'Where Does This State Live?', category: 'State & forms' },
  { n: 36, slug: '36-trigger-render-commit', title: 'Trigger → Render → Commit', category: 'Rendering & performance', pattern: 'Render is a function call; commit is the DOM', file: 'src/Helpdesk.tsx' },
  { n: 37, slug: '37-render-is-not-paint', title: 'Rendered, But Nothing Changed', category: 'Rendering & performance' },
];

export const isLive = (ep: SeriesEpisode): boolean => Boolean(ep.file);

/** Opens a live example in StackBlitz straight from the public repo. */
export function stackblitzUrl(ep: SeriesEpisode): string {
  const repo = BRAND.repoUrl.replace('https://github.com/', '');
  return `https://stackblitz.com/github/${repo}/tree/main/examples/${ep.slug}?file=${ep.file ?? ''}`;
}

/** Episodes by category, in series order inside each group; the current episode's group first. */
export function grouped(currentSlug: string): Array<{ category: string; episodes: SeriesEpisode[] }> {
  const current = EPISODES.find((e) => e.slug === currentSlug)?.category;
  return [...CATEGORIES]
    .sort((a, b) => Number(b === current) - Number(a === current))
    .map((category) => ({ category, episodes: EPISODES.filter((e) => e.category === category) }));
}
