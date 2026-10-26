// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
// Brand, menu and course promotions shown around every example.
// Edit this file in /shell, then run `npm run sync` at the repo root to copy it into every example.

export const BRAND = {
  academy: 'Deesha Tech Academy',
  tagline: 'Talent needs direction.',
  website: 'https://www.deeshatechacademy.com',
  websiteDisplay: 'deeshatechacademy.com',
  // Set once the public repo exists, e.g. https://github.com/deesha-tech/react-concepts-playground
  repoUrl: 'https://github.com/deesha-tech/react-concepts-playground',
  whatsapp: '917796010100',
  instagram: '', // profile URL; the menu hides empty links
  youtube: '', // channel or playlist URL
};

const CAMPAIGN = 'react-series';

/** Adds UTM tags so the website analytics shows which playground example sent each visitor. */
export function tracked(path: string, episodeSlug: string, medium = 'playground'): string {
  const url = new URL(path, BRAND.website);
  url.searchParams.set('utm_source', 'stackblitz');
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', CAMPAIGN);
  url.searchParams.set('utm_content', episodeSlug);
  return url.toString();
}

/** The learner portal page for this example's challenges (one playground per technology, this one is "react"): sign in, take the challenges, commit to "My repository". */
export function challengesLink(episodeSlug: string): string {
  return tracked(`/learn?next=/learn/playground/react/${episodeSlug}`, episodeSlug, 'challenges');
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** The main promotion in the sidebar. */
export const FEATURED_COURSE = {
  eyebrow: 'Academy · Live course',
  title: 'React Application Development',
  pitch: 'You just played with one concept. In the course you build a complete production-ready React app around it, live with an expert.',
  highlights: ['25 live sessions', 'One real app, built end to end', 'TypeScript strict from day one', 'React 19 and React Router 8', 'Testing, CI and deployment'],
  path: '/academy/courses/react-application-development',
  cta: 'See the course',
  // Shown only until `until`, so stale batch dates never appear.
  nextBatch: { label: 'Next live batch starts Mon 12 Oct · 10 PM IST · Online', until: '2026-10-12T22:00:00+05:30' },
  whatsappMessage: "Hi, I saw the React Concepts Playground and I'd like to know about the React Application Development course.",
};

/** "Keep building" cards under the example, and the Courses menu. */
export const OFFERINGS = [
  {
    kind: 'Academy course',
    title: 'React Application Development',
    blurb: 'One real React app across 25 live sessions: typed, routed, secured, tested and deployed.',
    path: '/academy/courses/react-application-development',
  },
  {
    kind: 'Learning pathway',
    title: 'Frontend Application Engineering',
    blurb: 'From web fundamentals to tested, accessible, production-ready apps. Choose React or Angular.',
    path: '/academy/pathways/frontend-application-engineering',
  },
  {
    kind: 'SkillLab · 2 days',
    title: 'TypeScript for Application Developers',
    blurb: 'Types that model your data honestly, generics without fear, and strict mode in a real codebase.',
    path: '/skilllabs/typescript-for-application-developers',
  },
  {
    kind: 'SkillLab · 2 days',
    title: 'Frontend Testing Lab',
    blurb: 'Test what users actually do: Testing Library, API mocking and Playwright journeys wired into CI.',
    path: '/skilllabs/frontend-testing-lab',
  },
  {
    kind: 'Academy course',
    title: 'Claude Code Deep Dive',
    blurb: 'Turn an AI coding assistant into a disciplined, team-ready engineering workflow.',
    path: '/academy/courses/code-with-claude',
  },
];
