// YOUR TURN · Task 1: rewrite the review form with a React 19 form action.
//
// Goal (compare with TrapForm.tsx, the React 18 version):
//   • No useState for loading or error.
//   • <form action={...}> runs an async action created with useActionState(action, initialState).
//     The action receives (previousState, formData), calls postReview(comment, rating), and RETURNS
//     the next state, e.g. { error: null } on success or { error: message } on failure.
//   • Show state.error under the button.
//   • A double click on "Post review" sends ONE request (check the timeline).
//   • After a success the form is empty again; after an error the user's text is still there.
//   • Call onAdded(savedReview) when the server accepts the review.
//
// Hints: useActionState comes from 'react'. Read the fields with formData.get('comment') and
// formData.get('rating'). The textarea needs name="comment"; <Stars name="rating" /> already has its name.
import { postReview, type Review } from './api';
import { Stars } from './TrapForm';

export function ActionForm({ onAdded }: { onAdded: (r: Review) => void }) {
  void onAdded; void postReview;   // remove this line when you use them

  return (
    <form className="rf" onSubmit={(e) => e.preventDefault()}>
      <p className="rf-todo">✏️ Your turn: implement this form with <code>useActionState</code> (see the comments in <code>src/ActionForm.tsx</code>).</p>
      <Stars name="rating" />
      <textarea className="rf-text" name="comment" placeholder="Write a review…" aria-label="Review" />
      <div className="rf-foot">
        <SubmitButton />
      </div>
    </form>
  );
}

// YOUR TURN · Task 2: make this button disable itself and say "Posting…" while the form is submitting.
// Use useFormStatus() from 'react-dom'. No props: the button reads the status of the form it's inside.
export function SubmitButton() {
  return <button className="btn btn-primary rf-submit" type="submit">Post review</button>;
}
