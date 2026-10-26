// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { TourStep } from './types';

type Rect = { x: number; y: number; w: number; h: number };
const PAD = 8;
const seenKey = (slug: string) => `pg-tour-done:${slug}`;

function readSeen(slug: string) {
  try { return localStorage.getItem(seenKey(slug)) === '1'; } catch { return false; }
}
function markSeen(slug: string) {
  try { localStorage.setItem(seenKey(slug), '1'); } catch { /* private mode: the tour simply shows again */ }
}

/**
 * Step-by-step tooltips over the live demo. "Next" steps explain; "click" steps wait for the visitor
 * to do the thing, then continue on their own. Starts once per example (remembered in localStorage),
 * and can be restarted from the "Take the tour" buttons (they dispatch a `pg-tour` event).
 */
export function GuidedTour({ slug, steps }: { slug: string; steps: TourStep[] }) {
  const [i, setI] = useState<number | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const step = i === null ? null : steps[i];
  const floater = step ? null : (
    <button className="pg-tour-float" onClick={() => setI(0)} aria-label="Take the guided tour">
      <span className="pg-tour-float-play">▶</span>Guided tour<span className="pg-tour-float-n">{steps.length} steps</span>
    </button>
  );

  const close = useCallback(() => { setI(null); markSeen(slug); }, [slug]);
  const next = useCallback(() => setI((n) => (n === null ? null : n + 1 >= steps.length ? (markSeen(slug), window.dispatchEvent(new Event('pg-tour-done')), null) : n + 1)), [slug, steps.length]);
  const back = useCallback(() => setI((n) => (n === null || n === 0 ? n : n - 1)), []);

  // Start automatically on the first visit (never in video-capture mode), or when asked to.
  useEffect(() => {
    if (new URLSearchParams(location.search).has('capture')) return;
    const start = () => setI(0);
    window.addEventListener('pg-tour', start);
    const t = readSeen(slug) ? 0 : window.setTimeout(start, 900);
    return () => { window.removeEventListener('pg-tour', start); clearTimeout(t); };
  }, [slug]);

  // Bring the target into view when a step starts.
  useEffect(() => {
    if (!step) return;
    document.querySelector(step.target)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [step]);

  // Follow the target every frame (it moves while the page scrolls or re-renders).
  useEffect(() => {
    if (!step) return;
    let raf = 0;
    const tick = () => {
      const el = document.querySelector(step.target);
      const r = el?.getBoundingClientRect();
      setRect(r && (r.width || r.height) ? { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 } : null);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  // "Do this" steps that wait for something to happen (e.g. the visitor's search to settle).
  useEffect(() => {
    if (!step || step.action !== 'event' || !step.event) return;
    const onEvent = () => window.setTimeout(next, step.after ?? 300);
    window.addEventListener(step.event, onEvent, { once: true });
    return () => window.removeEventListener(step.event!, onEvent);
  }, [step, next]);

  // "Do this" steps: continue once the visitor clicks the target.
  useEffect(() => {
    if (!step || step.action !== 'click') return;
    const onClick = (e: MouseEvent) => {
      const el = document.querySelector(step.target);
      if (el && el.contains(e.target as Node)) window.setTimeout(next, step.after ?? 600);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [step, next]);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight' && !step?.action) next(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, step, close, next]);

  if (!step || i === null) return floater;

  // Tooltip below the target when there's room, otherwise above; centred when the target is missing.
  const tipH = tipRef.current?.offsetHeight ?? 190, tipW = Math.min(360, window.innerWidth - 24);
  let style: CSSProperties = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: tipW };
  if (rect) {
    const below = rect.y + rect.h + 14 + tipH < window.innerHeight;
    const left = Math.min(Math.max(12, rect.x), window.innerWidth - tipW - 12);
    style = { left, top: below ? rect.y + rect.h + 14 : Math.max(12, rect.y - tipH - 14), width: tipW };
  }

  return (
    <div className="tour" role="dialog" aria-live="polite" aria-label="Guided tour">
      {rect ? <div className="tour-hole" style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }} /> : <div className="tour-dim" />}
      <div className="tour-tip" ref={tipRef} style={style}>
        <div className="tour-top">
          <span className="tour-count">Step {i + 1} of {steps.length}</span>
          <button className="tour-skip" onClick={close}>Skip tour</button>
        </div>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <div className="tour-dots" aria-hidden>{steps.map((_, k) => <i key={k} className={k === i ? 'on' : k < i ? 'done' : ''} />)}</div>
        <div className="tour-actions">
          <button className="tour-btn ghost" onClick={back} disabled={i === 0}>← Back</button>
          {step.action
            ? <span className="tour-wait">{step.action === 'event' ? '⌨️ Your turn: try it' : '👆 Your turn: click it'}</span>
            : <button className="tour-btn" onClick={next}>{i + 1 === steps.length ? 'Finish ✓' : 'Next →'}</button>}
        </div>
      </div>
    </div>
  );
}

/** Restarts the guided tour from anywhere (hero button, sidebar). */
export const startTour = () => window.dispatchEvent(new Event('pg-tour'));
