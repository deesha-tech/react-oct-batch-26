// The lines shown under the demo. Lines starting with "!" are highlighted.
export const FORM_CODE = `
!const [loading, setLoading] = useState(false);
!const [error, setError] = useState(null);

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  try {
    onAdded(await postReview(comment, rating));
    setComment('');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
<button type="submit">{loading ? 'Posting…' : 'Post review'}</button>
// Your task: rewrite this with React 19 Actions (README.md).
`;
