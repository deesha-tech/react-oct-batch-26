// Copied from /shell by scripts/sync-shell.mjs. Edit the original there.
import { useEffect, useRef, type ReactNode } from 'react';
import { BRAND, FEATURED_COURSE, OFFERINGS, challengesLink, tracked, whatsappLink } from './brand';
import type { Episode } from './types';
import { installCapture } from './capture';
import { grouped, isLive, stackblitzUrl } from './episodes';
import { GuidedTour } from './GuidedTour';
import logoLight from './logo-light.png';
import './shell.css';

/** The first sentence of a challenge, as a teaser; the full text lives in the learner portal. */
function brief(text: string): string {
  const first = text.match(/^.*?[.?!](\s|$)/)?.[0].trim() ?? text;
  return first.length > 90 ? first.slice(0, 87).trimEnd() + '…' : first;
}

/** Closes an open <details> menu when the user clicks anywhere outside it. */
function useCloseOnOutsideClick() {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return ref;
}

function TopBar({ episode }: { episode: Episode }) {
  const courses = useCloseOnOutsideClick();
  const examples = useCloseOnOutsideClick();
  const mobile = useCloseOnOutsideClick();
  const links = [
    episode.videoUrl ? { label: 'Watch the episode', href: episode.videoUrl } : null,
    BRAND.youtube ? { label: 'YouTube', href: BRAND.youtube } : null,
    BRAND.instagram ? { label: 'Instagram', href: BRAND.instagram } : null,
  ].filter((l): l is { label: string; href: string } => l !== null);

  const groups = grouped(episode.slug);
  const live = groups.flatMap((g) => g.episodes).filter(isLive).length;
  const item = (e: (typeof groups)[number]['episodes'][number]) =>
    isLive(e) ? (
      <a key={e.slug} className="pg-ep-live" href={stackblitzUrl(e)} target="_blank" rel="noreferrer" aria-current={e.slug === episode.slug ? 'page' : undefined} title={e.pattern}>
        <span className="pg-ep-n">{String(e.n).padStart(2, '0')}</span>{e.title}
      </a>
    ) : (
      <span key={e.slug} className="pg-ep-soon" aria-disabled="true" title="Coming soon"><span className="pg-ep-n">{String(e.n).padStart(2, '0')}</span>{e.title}</span>
    );
  // Desktop: every category side by side. Phone: one accordion per category, the current one open.
  const megaPanel = (
    <div className="pg-mega">
      <p className="pg-mega-head"><i className="pg-ep-dot" /> {live} live · {groups.flatMap((g) => g.episodes).length - live} coming, a new one every week</p>
      <div className="pg-mega-cols">
        {groups.map((g) => (
          <section key={g.category}>
            <h4>{g.category}</h4>
            {g.episodes.map(item)}
          </section>
        ))}
      </div>
    </div>
  );
  const mobileGroups = groups.map((g, i) => (
    <details key={g.category} className="pg-acc" open={i === 0}>
      <summary>{g.category}<span>{g.episodes.filter(isLive).length}/{g.episodes.length}</span></summary>
      <div>{g.episodes.map(item)}</div>
    </details>
  ));
  const courseLinks = OFFERINGS.map((o) => (
    <a key={o.path} href={tracked(o.path, episode.slug, 'menu')} target="_blank" rel="noreferrer">
      <span className="pg-menu-kind">{o.kind}</span>
      <span className="pg-menu-title">{o.title}</span>
    </a>
  ));

  return (
    <header className="pg-top">
      <div className="pg-top-inner">
        <a className="pg-brand" href={tracked('/', episode.slug, 'logo')} target="_blank" rel="noreferrer">
          <img src={logoLight} alt={BRAND.academy} />
        </a>
        <span className="pg-product">React Concepts Playground</span>
        <nav className="pg-nav" aria-label="Playground">
          <details className="pg-menu pg-menu-wide" ref={examples}>
            <summary>All examples</summary>
            <div className="pg-menu-panel">{megaPanel}</div>
          </details>
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
          <details className="pg-menu" ref={courses}>
            <summary>Courses</summary>
            <div className="pg-menu-panel">{courseLinks}</div>
          </details>
        </nav>
        {episode.layout === 'drawer' ? (
          <a className="pg-cta pg-cta-rich" href={tracked(FEATURED_COURSE.path, episode.slug, 'topbar')} target="_blank" rel="noreferrer">
            <span className="pg-cta-title">{FEATURED_COURSE.title}</span>
            <span className="pg-cta-sub">{Date.now() < new Date(FEATURED_COURSE.nextBatch.until).getTime() ? FEATURED_COURSE.nextBatch.label.replace(/^Next live batch starts /, 'Next batch ').replace(/ · Online$/, '') : 'Live sessions, with an expert'}</span>
          </a>
        ) : (
          <a className="pg-cta" href={tracked(FEATURED_COURSE.path, episode.slug, 'topbar')} target="_blank" rel="noreferrer">
            Learn React live
          </a>
        )}
        <details className="pg-menu pg-mobile" ref={mobile}>
          <summary aria-label="Menu">Menu</summary>
          <div className="pg-menu-panel">
            <p className="pg-mega-head">Episodes</p>
            {mobileGroups}
            <hr />
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"><span className="pg-menu-title">{l.label}</span></a>
            ))}
            <hr />
            {courseLinks}
          </div>
        </details>
      </div>
    </header>
  );
}

function CourseAd({ episode }: { episode: Episode }) {
  const c = FEATURED_COURSE;
  const showBatch = Date.now() < new Date(c.nextBatch.until).getTime();
  return (
    <section className="pg-card pg-ad" aria-label="Featured course">
      <p className="pg-eyebrow pg-eyebrow-saffron">{c.eyebrow}</p>
      <h3>{c.title}</h3>
      <p className="pg-ad-facts">{c.highlights.slice(0, 3).join(' · ')}</p>
      {showBatch && <p className="pg-batch">{c.nextBatch.label}</p>}
      <a className="pg-btn pg-btn-saffron" href={tracked(c.path, episode.slug, 'sidebar')} target="_blank" rel="noreferrer">{c.cta} →</a>
      <a className="pg-ad-wa" href={whatsappLink(c.whatsappMessage)} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
    </section>
  );
}

function InterviewBand({ episode }: { episode: Episode }) {
  const iv = episode.interview;
  if (!iv) return null;
  return (
    <section className="pg-interview" id="interview" aria-label="Interview question and answer">
      <div className="pg-wrap">
        <p className="pg-eyebrow pg-eyebrow-saffron">Asked in React interviews</p>
        <h2 className="pg-iv-q">“{iv.question}”</h2>
        <div className="pg-iv-grid">
          <div className="pg-iv-answer">
            <p className="pg-iv-label">A strong answer</p>
            {iv.answer.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="pg-iv-side">
            <div className="pg-iv-short">
              <p className="pg-iv-label">Say it in 30 seconds</p>
              <p>{iv.short}</p>
            </div>
            {iv.followUps?.map((f) => (
              <details className="pg-iv-follow" key={f.q}>
                <summary><span className="pg-iv-label">Follow-up</span>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlaygroundShell({ episode, children }: { episode: Episode; children: ReactNode }) {
  useEffect(() => { installCapture(); }, []);
  return (
    <div className={`pg${episode.layout === 'drawer' ? ' pg-has-drawer' : ''}`}>
      <TopBar episode={episode} />

      <section className="pg-hero">
        <div className="pg-wrap">
          <p className="pg-eyebrow">Ep {String(episode.n).padStart(2, '0')} · {episode.type}</p>
          <h1>{episode.title}</h1>
          {episode.pattern && <p className="pg-pattern"><span>Pattern</span>{episode.pattern}</p>}
          <ul className="pg-chips">
            {episode.concepts.map((c) => <li key={c}>{c}</li>)}
          </ul>
          {episode.interview && (
            <a className="pg-iv-teaser" href="#interview">
              <span className="pg-iv-teaser-tag">Interview question</span>
              <span className="pg-iv-teaser-q">{episode.interview.question}</span>
              <span className="pg-iv-teaser-link">Model answer ↓</span>
            </a>
          )}
        </div>
      </section>

      <main className={`pg-wrap pg-grid${episode.layout === 'drawer' ? ' pg-grid-solo' : ''}`}>
        <div className="pg-stage">{children}</div>
        {episode.layout !== 'drawer' && <aside className="pg-side">
          {!episode.tour && (
            <section className="pg-card">
              <p className="pg-eyebrow">How to play</p>
              <ol className="pg-steps">
                {episode.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </section>
          )}
          <section className="pg-card pg-challenge">
            <p className="pg-eyebrow pg-eyebrow-saffron">Challenges</p>
            {episode.challenges ? (
              <ul className="pg-challenges">
                {episode.challenges.map((c) => (
                  <li key={c.text}><span className={`pg-level pg-level-${c.level.toLowerCase().replace(/[^a-z]/g, '')}`}>{c.level}</span><span>{brief(c.text)}</span></li>
                ))}
              </ul>
            ) : episode.challenge ? <p className="pg-challenge-one">{brief(episode.challenge)}</p> : null}
            <p className="pg-challenge-pitch">Your repo · reviewed · leaderboard</p>
            <a className="pg-btn pg-btn-saffron pg-btn-live" href={challengesLink(episode.slug)} target="_blank" rel="noreferrer">Take the challenges →</a>
          </section>
          <CourseAd episode={episode} />
        </aside>}
      </main>

      <InterviewBand episode={episode} />
      {episode.tour && <GuidedTour slug={episode.slug} steps={episode.tour} />}

      <section className="pg-more">
        <div className="pg-wrap">
          <p className="pg-eyebrow">Keep building with Deesha</p>
          <h2>Go from concepts to production-ready skills</h2>
          <div className="pg-more-grid">
            {OFFERINGS.slice(1).map((o) => (
              <a key={o.path} className="pg-offer" href={tracked(o.path, episode.slug, 'more')} target="_blank" rel="noreferrer">
                <span className="pg-offer-kind">{o.kind}</span>
                <span className="pg-offer-title">{o.title}</span>
                <span className="pg-offer-blurb">{o.blurb}</span>
                <span className="pg-offer-link">Learn more →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="pg-footer">
        <div className="pg-wrap pg-footer-inner">
          <span>© {new Date().getFullYear()} {BRAND.academy} · {BRAND.tagline}</span>
          <a href={tracked('/', episode.slug, 'footer')} target="_blank" rel="noreferrer">{BRAND.websiteDisplay}</a>
        </div>
      </footer>
    </div>
  );
}
