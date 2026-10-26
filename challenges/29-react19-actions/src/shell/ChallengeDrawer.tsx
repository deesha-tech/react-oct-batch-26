// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
import { useEffect, useState } from 'react';
import { FEATURED_COURSE, challengesLink, tracked, whatsappLink } from './brand';
import type { Episode } from './types';

/**
 * The challenges, as a drawer (right on desktop, bottom sheet on phones) instead of a sidebar, so the demo
 * gets the full width. Opens by itself once per device when the guided tour finishes; otherwise through the
 * "Challenges" pill. Never opens in video-capture mode. The full challenge text lives in the learner portal.
 */
const POINTS: Record<string, number> = { 'Warm-up': 1, Core: 3, Stretch: 5 };
const shownKey = (slug: string) => `pg-drawer-shown:${slug}`;

function brief(text: string): string {
  const first = text.match(/^.*?[.?!](\s|$)/)?.[0].trim() ?? text;
  return first.length > 90 ? first.slice(0, 87).trimEnd() + '…' : first;
}

export function ChallengeDrawer({ episode }: { episode: Episode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).has('capture')) return;
    const onDone = () => {
      try { if (localStorage.getItem(shownKey(episode.slug)) === '1') return; localStorage.setItem(shownKey(episode.slug), '1'); } catch { /* fine */ }
      setOpen(true);
    };
    const onTour = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('pg-tour-done', onDone);
    window.addEventListener('pg-tour', onTour);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('pg-tour-done', onDone); window.removeEventListener('pg-tour', onTour); window.removeEventListener('keydown', onKey); };
  }, [episode.slug]);

  const levels = episode.challenges ?? (episode.challenge ? [{ level: 'Core' as const, text: episode.challenge }] : []);
  const c = FEATURED_COURSE;
  return (
    <>
      <button className="pg-drawer-pill" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="pg-drawer">
        <span className="pg-drawer-pill-icon">🏆</span>Challenges<span className="pg-drawer-pill-n">{levels.length}</span>
      </button>
      <div className={`pg-drawer-backdrop${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} />
      <aside id="pg-drawer" className={`pg-drawer${open ? ' is-open' : ''}`} aria-label="Challenges" aria-hidden={!open}>
        <button className="pg-drawer-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
        <p className="pg-eyebrow pg-eyebrow-saffron">Challenges · Ep {String(episode.n).padStart(2, '0')}</p>
        <h3>Now make it yours.</h3>
        <p className="pg-drawer-lead">Three challenges on this pattern, reviewed by a Deesha trainer. Points, badges and a place on the React leaderboard.</p>
        <ul className="pg-drawer-levels">
          {levels.map((l) => (
            <li key={l.text}>
              <span className={`pg-level pg-level-${l.level.toLowerCase().replace(/[^a-z]/g, '')}`}>{l.level}</span>
              <span className="pg-drawer-pts">{POINTS[l.level] ?? 1} pt{(POINTS[l.level] ?? 1) > 1 ? 's' : ''}</span>
              <span className="pg-drawer-text">{brief(l.text)}</span>
            </li>
          ))}
        </ul>
        <p className="pg-eyebrow">How it works</p>
        <ol className="pg-drawer-steps">
          <li><b>Sign in</b> and get your own repository.</li>
          <li><b>Commit</b> your solution, one folder per episode.</li>
          <li><b>A trainer reviews it</b> and leaves notes.</li>
          <li><b>Earn points and badges</b>, climb the leaderboard.</li>
        </ol>
        <a className="pg-btn pg-btn-saffron pg-btn-live" href={challengesLink(episode.slug)} target="_blank" rel="noreferrer">Take the challenges →</a>
        <p className="pg-drawer-foot">
          Build the whole app live: <a href={tracked(c.path, episode.slug, 'drawer')} target="_blank" rel="noreferrer">{c.title}</a>
          <span> · </span><a href={whatsappLink(c.whatsappMessage)} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
        </p>
      </aside>
    </>
  );
}
