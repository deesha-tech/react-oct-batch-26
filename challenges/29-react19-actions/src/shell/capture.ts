// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
// Video-capture helpers: a spotlight that dims the page around what the trainer is talking about.
// Active only when the URL contains ?capture, so visitors never see it. A recording script drives it:
//   pg.focus('.demo-card:nth-of-type(2)', { label: 'Request waterfall' })
//   pg.lines('src/senior/routes.tsx', 12, 15, { label: 'No useState · No useEffect' })
//   pg.clear()
//   pg.rect()   -> the current spotlight rectangle (the Reel's virtual camera follows it)

type Opts = { label?: string; scroll?: boolean; block?: ScrollLogicalPosition; pad?: number };

declare global {
  interface Window {
    pg?: {
      focus: (selector: string, opts?: Opts) => void;
      lines: (file: string, from: number, to: number, opts?: Opts) => void;
      clear: () => void;
      rect: () => { x: number; y: number; w: number; h: number } | null;
    };
  }
}

export function installCapture() {
  if (typeof window === 'undefined' || window.pg || !new URLSearchParams(location.search).has('capture')) return;
  document.documentElement.setAttribute('data-capture', '');

  const hole = document.createElement('div');
  hole.className = 'cap-hole';
  const label = document.createElement('div');
  label.className = 'cap-label';
  document.body.append(hole, label);

  let targets: Element[] = [];
  let pad = 10;

  const union = () => {
    const rs = targets.map((t) => t.getBoundingClientRect()).filter((r) => r.width || r.height);
    if (!rs.length) return null;
    const x = Math.min(...rs.map((r) => r.left)) - pad, y = Math.min(...rs.map((r) => r.top)) - pad;
    const w = Math.max(...rs.map((r) => r.right)) - pad - x + pad * 2, h = Math.max(...rs.map((r) => r.bottom)) - pad - y + pad * 2;
    return { x, y, w, h };
  };

  // Follow the targets every frame (they move while the page scrolls or re-renders).
  const tick = () => {
    const r = union();
    if (r) {
      Object.assign(hole.style, { opacity: '1', left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
      const above = r.y > 48;
      Object.assign(label.style, { left: `${Math.max(8, r.x)}px`, top: above ? `${r.y - 40}px` : `${r.y + r.h + 10}px` });
      label.style.opacity = label.textContent ? '1' : '0';
    } else {
      hole.style.opacity = '0';
      label.style.opacity = '0';
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const show = (els: Element[], opts: Opts = {}) => {
    targets = els;
    pad = opts.pad ?? 10;
    label.textContent = opts.label ?? '';
    if (opts.scroll !== false && els[0]) els[0].scrollIntoView({ block: opts.block ?? 'center', behavior: 'smooth' });
  };

  window.pg = {
    focus: (selector, opts) => show([...document.querySelectorAll(selector)].slice(0, 1), opts),
    lines: (file, from, to, opts) =>
      show([...document.querySelectorAll(`[data-code="${file}"] [data-ln]`)].filter((l) => {
        const n = Number((l as HTMLElement).dataset.ln);
        return n >= from && n <= to;
      }), opts),
    clear: () => show([], { scroll: false }),
    rect: () => union(),
  };
}
