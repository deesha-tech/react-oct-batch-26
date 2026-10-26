// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
import type { ReactNode } from 'react';

// comments | strings | function calls  — or a keyword
const TOKEN = /(\/\/[^\n]*|'[^']*'|`[^`]*`|"[^"]*"|\b[A-Za-z_]\w*(?=\())|\b(?:const|let|function|async|await|return|if|else|new|export|import|from|type|interface|throw|try|catch|finally|null|true|false)\b/g;

/** A very small highlighter: comments, strings, keywords and function calls. */
function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const t = m[0];
    const at = m.index ?? 0;
    if (at > last) out.push(line.slice(last, at));
    const cls = m[1] === undefined ? 'k' : t.startsWith('//') ? 'c' : /^['"`]/.test(t) ? 's' : 'f';
    out.push(<span key={at} className={cls}>{t}</span>);
    last = at + t.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/** Shows the key lines of the pattern. Lines that start with "!" are highlighted.
 *  data-code (the file name) and data-ln (1-based line) let video capture spotlight exact lines. */
export function CodePeek({ title, file, code }: { title: string; file: string; code: string }) {
  const lines = code.replace(/^\n+|\n\s*$/g, '').split('\n');
  return (
    <section className="demo-card" aria-label={title} data-code={file} data-stage="read">
      <div className="demo-head"><span className="stage-tag">3 · Read it</span><h2>{title}</h2><span className="muted" style={{ fontSize: '.78rem', fontFamily: 'var(--font-mono)' }}>{file}</span></div>
      <pre className="code">
        {lines.map((l, i) => {
          const hot = l.startsWith('!');
          const text = hot ? l.slice(1) : l;
          const body = text ? highlight(text) : ' ';
          return <div key={i} data-ln={i + 1}>{hot ? <mark>{body}</mark> : body}</div>;
        })}
      </pre>
    </section>
  );
}
