// TRAP: the React 18 way. Every piece of the submit lifecycle is state you write and keep in sync yourself.
import { useState, type FormEvent } from 'react';
import { postReview, type Review } from './api';
import { timeline } from './shell/timeline';

export function TrapForm({ onAdded }: { onAdded: (r: Review) => void }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    timeline.mark('Click: Post review');
    setLoading(true);
    try {
      const saved = await postReview(comment, rating);
      onAdded(saved);
      setComment('');
      // forgot: setError(null), so an old error stays on screen after a successful retry
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="rf" onSubmit={handleSubmit}>
      <Stars value={rating} onChange={setRating} />
      <textarea className="rf-text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a review…" aria-label="Review" />
      <div className="rf-foot">
        {/* the button is never disabled: click twice while it's saving and it posts twice */}
        <button className="btn btn-primary rf-submit" type="submit">{loading ? 'Posting…' : 'Post review'}</button>
        {error && <p className="rf-error">{error}</p>}
      </div>
    </form>
  );
}

export function Stars({ value, onChange, name }: { value?: number; onChange?: (n: number) => void; name?: string }) {
  return (
    <div className="rf-stars" role="radiogroup" aria-label="Rating">
      {[5, 4, 3, 2, 1].map((n) => (   // reversed in the DOM so CSS can fill the stars to the left of the checked one
        <label key={n}>
          <input type="radio" name={name ?? 'rating'} value={n} {...(onChange ? { checked: value === n, onChange: () => onChange(n) } : { defaultChecked: n === 5 })} />
          <span>★</span>
        </label>
      ))}
    </div>
  );
}
