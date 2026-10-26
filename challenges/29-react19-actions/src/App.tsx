import { useEffect, useState } from 'react';
import { PlaygroundShell } from './shell/PlaygroundShell';
import { RequestTimeline } from './shell/RequestTimeline';
import { CodePeek } from './shell/CodePeek';
import { timeline } from './shell/timeline';
import { EPISODE } from './episode';
import { getProduct, type Product, type Review } from './api';
import { ProductReviews } from './Reviews';
import { TrapForm } from './TrapForm';
import { ActionForm } from './ActionForm';
import { OptimisticForm, useOptimisticReviews } from './OptimisticForm';
import { ACTION_CODE, OPTIMISTIC_CODE, TRAP_CODE } from './code';
import './demo.css';

type Mode = 'trap' | 'pattern' | 'optimistic';

const NOTE: Record<Mode, string> = {
  trap: 'Four useStates (comment, rating, loading, error) and a try/catch/finally you write yourself. The button is never disabled, so a quick double click posts the review twice, and an old error stays after a successful retry.',
  pattern: 'YOUR GOAL: the form calls an action. React tracks pending for you, useFormStatus disables the button, the error comes back as the action\'s result, and the form resets itself after a success. No loading or error state of your own.',
  optimistic: 'BONUS GOAL: same action, plus useOptimistic: the review appears instantly as "sending…", then the real one replaces it. If the server rejects it, React drops the optimistic review by itself.',
};
const CODE: Record<Mode, { title: string; file: string; code: string }> = {
  trap: { title: 'Trap: you manage every state', file: 'src/TrapForm.tsx', code: TRAP_CODE },
  pattern: { title: 'Your turn: Task 1 and 2', file: 'src/ActionForm.tsx', code: ACTION_CODE },
  optimistic: { title: 'Bonus: Task 3', file: 'src/OptimisticForm.tsx', code: OPTIMISTIC_CODE },
};

export function App() {
  return (
    <PlaygroundShell episode={EPISODE}>
      <ActionsDemo />
    </PlaygroundShell>
  );
}

function ActionsDemo() {
  const [mode, setMode] = useState<Mode>('trap');
  const [round, setRound] = useState(0);                 // remounts the form on a mode change, so each starts clean
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [optimistic, addOptimistic] = useOptimisticReviews(reviews);

  useEffect(() => {
    timeline.reset('Page opened');
    getProduct().then((p) => { setProduct(p); setReviews(p.reviews); }).catch(() => {});
  }, []);

  const switchMode = (next: Mode) => {
    setMode(next); setRound((r) => r + 1);
    setReviews((rs) => rs.filter((r) => r.reviewerName !== 'You'));
    timeline.reset(`Switched to ${next === 'trap' ? 'Trap' : next === 'pattern' ? 'Pattern' : 'Bonus'}`);
  };
  const onAdded = (r: Review) => setReviews((rs) => [r, ...rs]);

  return (
    <div className="demo">
      <section className="demo-card" data-stage="try">
        <div className="demo-head">
          <span className="stage-tag">1 · Try it</span>
          <div className="seg" role="group" aria-label="Version">
            <button aria-pressed={mode === 'trap'} onClick={() => switchMode('trap')}>Trap<span className="seg-key"> · onSubmit + useState</span></button>
            <button className="seg-good" aria-pressed={mode === 'pattern'} onClick={() => switchMode('pattern')}>Pattern<span className="seg-key"> · your turn</span></button>
            <button className="seg-good" aria-pressed={mode === 'optimistic'} onClick={() => switchMode('optimistic')}>Bonus<span className="seg-key"> · your turn</span></button>
          </div>
        </div>
        <div className="demo-body pr-grid">
          <div>
            <p className="demo-hint">Write a review and click <b>Post review</b> twice, quickly. Then try one that's too short.</p>
            {mode === 'trap' && <TrapForm key={round} onAdded={onAdded} />}
            {mode === 'pattern' && <ActionForm key={round} onAdded={onAdded} />}
            {mode === 'optimistic' && <OptimisticForm key={round} onAdded={onAdded} addOptimistic={addOptimistic} />}
          </div>
          <ProductReviews product={product} reviews={mode === 'optimistic' ? optimistic : reviews} />
        </div>
        <p className="demo-note">{NOTE[mode]}</p>
      </section>

      <RequestTimeline minScaleMs={2600} />
      <CodePeek title={CODE[mode].title} file={CODE[mode].file} code={CODE[mode].code} />
    </div>
  );
}
