// BONUS · Task 3: show the review instantly, before the server answers, with useOptimistic.
//
// Goal:
//   • useOptimisticReviews(reviews) should return [shownReviews, addOptimistic] using useOptimistic from 'react'.
//   • In the form's action, call addOptimistic({ ...review, sending: true }) BEFORE awaiting postReview.
//     The list already greys out reviews with sending: true and labels them "sending…".
//   • If the server rejects the review (try "Bad"), it must disappear on its own: no cleanup code.
//   • Reuse your Task 1 action and your SubmitButton.
import type { Review } from './api';
import { Stars } from './TrapForm';
import { SubmitButton } from './ActionForm';

export function useOptimisticReviews(reviews: Review[]): readonly [Review[], (r: Review) => void] {
  return [reviews, () => {}] as const;   // replace with useOptimistic
}

export function OptimisticForm({ onAdded, addOptimistic }: { onAdded: (r: Review) => void; addOptimistic: (r: Review) => void }) {
  void onAdded; void addOptimistic;   // remove this line when you use them

  return (
    <form className="rf" onSubmit={(e) => e.preventDefault()}>
      <p className="rf-todo">✏️ Bonus: add <code>useOptimistic</code> (see the comments in <code>src/OptimisticForm.tsx</code>).</p>
      <Stars name="rating" />
      <textarea className="rf-text" name="comment" placeholder="Write a review…" aria-label="Review" />
      <div className="rf-foot">
        <SubmitButton />
      </div>
    </form>
  );
}
