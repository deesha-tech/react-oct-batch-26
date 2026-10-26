import type { Product, Review } from './api';

const stars = (n: number) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);

/** The product and its reviews. A review the user posted twice is flagged, so a double submit is easy to spot. */
export function ProductReviews({ product, reviews }: { product: Product | null; reviews: Review[] }) {
  if (!product) return <p className="muted">Loading the product…</p>;
  const mine = reviews.filter((r) => r.reviewerName === 'You' && !r.sending);
  const dupes = new Set(mine.map((r) => r.comment).filter((c, i, all) => all.indexOf(c) !== i));
  return (
    <div className="pr">
      <div className="pr-head">
        <img src={product.thumbnail} alt="" width={64} height={64} />
        <div><strong>{product.title}</strong><span className="muted">{product.brand} · ${product.price}</span></div>
      </div>
      <ul className="pr-list">
        {reviews.map((r) => (
          <li key={r.id} className={`pr-item${r.sending ? ' is-sending' : ''}${dupes.has(r.comment) && r.reviewerName === 'You' ? ' is-dupe' : ''}`}>
            <span className="pr-stars">{stars(r.rating)}</span>
            <span className="pr-text">{r.comment}</span>
            <span className="pr-who">{r.reviewerName}{r.sending ? ' · sending…' : ''}{dupes.has(r.comment) && r.reviewerName === 'You' && !r.sending ? ' · posted twice ✕' : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
