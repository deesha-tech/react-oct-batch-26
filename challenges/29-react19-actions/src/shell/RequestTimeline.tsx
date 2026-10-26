// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
import { useEffect, useState } from 'react';
import { useTimeline, type RequestStatus } from './timeline';

const STATUS_TEXT: Record<RequestStatus, string> = {
  pending: 'loading…',
  done: '',
  cancelled: 'cancelled',
  error: 'failed',
  stale: 'stale, overwrote newer data',
};

/** Draws every fake request as a bar on a shared time axis, plus render events underneath. */
export function RequestTimeline({ title = 'Network and render timeline', minScaleMs = 2000 }: { title?: string; minScaleMs?: number }) {
  const { t0, requests, events } = useTimeline();
  const pending = requests.some((r) => r.status === 'pending');

  // Re-render every frame while something is loading, so pending bars grow live.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!pending) return;
    let raf = 0;
    const loop = () => { setTick((t) => t + 1); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pending]);

  const nowMs = performance.now() - t0;
  const ends = [...requests.map((r) => r.end ?? nowMs), ...events.map((e) => e.at)];
  const scale = Math.max(minScaleMs, ...ends) * 1.08;
  const pct = (ms: number) => `${Math.min(100, (ms / scale) * 100)}%`;
  const done = requests.filter((r) => r.end !== undefined);
  const lastEvent = events.length > 1 ? events[events.length - 1] : null;

  return (
    <section className="demo-card" aria-label={title} data-stage="watch">
      <div className="demo-head"><span className="stage-tag">2 · Watch it</span><h2>{title}</h2><span className="tl-live"><i />live</span></div>
      <div className="demo-body">
        {requests.length === 0 && events.length <= 1 ? (
          <p className="tl-empty">Interact with the demo above and every request and render shows up here.</p>
        ) : (
          <>
            <div className="tl-summary">
              <span>Requests: <strong>{requests.length}</strong></span>
              {done.length > 0 && <span>Network time: <strong>{Math.round(Math.max(...done.map((r) => r.end!)))} ms</strong></span>}
              {lastEvent && !pending && <span>Last render: <strong>{Math.round(lastEvent.at)} ms</strong></span>}
            </div>
            {requests.map((r) => {
              const end = r.end ?? nowMs;
              const note = STATUS_TEXT[r.status];
              return (
                <div className="tl-row" key={r.id}>
                  <span className="tl-label" title={r.label}>{r.label}</span>
                  <div className="tl-track">
                    <div className={`tl-bar tl-${r.status}`} style={{ left: pct(r.start), width: pct(end - r.start) }}>
                      {Math.round(end - r.start)} ms
                    </div>
                    {note && <span className={`tl-note ${r.status === 'stale' || r.status === 'error' ? 'tl-note-bad' : ''}`} style={{ left: pct(end) }}>{note}</span>}
                  </div>
                </div>
              );
            })}
            {events.length > 1 && (
              <div className="tl-row">
                <span className="tl-label">renders</span>
                <div className="tl-track">
                  {events.slice(1).map((e, i) => <span key={i} className="tl-dot" style={{ left: pct(e.at) }} title={`${Math.round(e.at)} ms · ${e.label}`} />)}
                </div>
              </div>
            )}
            <div className="tl-axis"><span /><div><span>0</span><span>{Math.round(scale / 2)} ms</span><span>{Math.round(scale)} ms</span></div></div>
            <ol className="tl-events">
              {events.map((e, i) => <li key={i}><time>{Math.round(e.at)} ms</time><span>{e.label}</span></li>)}
            </ol>
            <div className="tl-legend">
              <span><i style={{ background: 'var(--teal)' }} />done</span>
              <span><i style={{ background: '#9aa3b2' }} />cancelled</span>
              <span><i style={{ background: 'var(--bad)' }} />failed or stale</span>
              <span><i style={{ background: 'var(--saffron)', borderRadius: '50%' }} />render</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
