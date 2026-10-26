// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
export interface TourStep {
  /** CSS selector of the element to point at */
  target: string;
  title: string;
  text: string;
  /** 'click': wait for the visitor to click the target; 'event': wait for a window event (e.g. a search settling) */
  action?: 'click' | 'event';
  event?: string;
  /** ms to wait after the click/event before moving on */
  after?: number;
}

export interface Challenge {
  level: 'Warm-up' | 'Core' | 'Stretch';
  text: string;
}

export interface Episode {
  /** Episode number in the video series */
  n: number;
  /** Folder name, also used as the UTM content tag */
  slug: string;
  title: string;
  /** "React Concept", "React Interview" or "React Pattern" */
  type: string;
  /** One sentence under the title */
  summary: string;
  concepts: string[];
  /** Short "how to play" steps */
  steps: string[];
  /** A small task for the viewer, also in the README */
  challenge: string;
  /** Graded challenges shown in the sidebar (falls back to `challenge`) */
  challenges?: Challenge[];
  /** The guided tour: step-by-step tooltips that replace a wall of "how to play" text */
  tour?: TourStep[];
  /** The interview question and a model answer, written the way you'd say it out loud */
  interview?: {
    question: string;
    /** The full answer, one paragraph per idea */
    answer: string[];
    /** The same answer in about 30 seconds */
    short: string;
    followUps?: { q: string; a: string }[];
  };
  /** The episode video, once published (the menu hides it while empty) */
  videoUrl?: string;
  /** 'drawer': no sidebar; the challenges open in a drawer (after the tour, or from a pill). Default: 'sidebar'. */
  layout?: 'sidebar' | 'drawer';
  /** The named pattern this episode teaches, e.g. "Abort stale requests". Shown under the title and listed in the README. */
  pattern?: string;
}
