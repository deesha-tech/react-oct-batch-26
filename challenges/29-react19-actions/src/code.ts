// The key lines shown under the demo. Lines starting with "!" are highlighted.
export const TRAP_CODE = `
!const [loading, setLoading] = useState(false);
!const [error, setError] = useState(null);

async function handleSubmit(e) {
!  e.preventDefault();
!  setLoading(true);
  try {
    onAdded(await postReview(comment, rating));
    setComment('');
  } catch (err) {
    setError(err.message);
  } finally {
!    setLoading(false);
  }
}
<button type="submit">{loading ? 'Posting…' : 'Post review'}</button>
`;

export const ACTION_CODE = `
// Your turn: src/ActionForm.tsx
!// 1. <form action={formAction}> with useActionState(action, { error: null })
!// 2. the action returns the next state: { error } or { error: null }
!// 3. SubmitButton reads useFormStatus() and disables itself while pending
// Done when: a double click sends ONE request, the error clears on the
// next try, and the form resets after a success.
`;

export const OPTIMISTIC_CODE = `
// Bonus: src/OptimisticForm.tsx
!// useOptimistic(reviews, updateFn): updateFn puts the pending review on top
!// call addOptimistic({ ...review, sending: true }) before awaiting the server
// Done when: the review appears instantly as "sending…" and a rejected
// one ("Bad") disappears on its own.
`;
