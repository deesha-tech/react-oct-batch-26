// THE FORM YOU'LL FIX. It's written the React 18 way, and it has two bugs:
//   1. Double click "Post review": two POST requests go out and the review appears twice.
//   2. Post a review shorter than 10 characters, then a good one: the old error never goes away.
// Your task (see README.md): rewrite this form with React 19 Actions so both bugs disappear,
// without adding any useState for loading or error.
import { useState, type FormEvent } from 'react';
import { postReview, type Review } from './api';
import { timeline } from './shell/timeline';

export function ReviewForm({ onAdded }: { onAdded: (r: Review) => void }) {
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
