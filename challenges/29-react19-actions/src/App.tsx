import { useEffect, useState } from 'react';
import { PlaygroundShell } from './shell/PlaygroundShell';
import { RequestTimeline } from './shell/RequestTimeline';
import { CodePeek } from './shell/CodePeek';
import { timeline } from './shell/timeline';
import { EPISODE } from './episode';
import { getProduct, type Product, type Review } from './api';
import { ProductReviews } from './Reviews';
import { ReviewForm } from './ReviewForm';
import { FORM_CODE } from './code';
import './demo.css';

export function App() {
  return (
    <PlaygroundShell episode={EPISODE}>
      <ReviewDemo />
    </PlaygroundShell>
  );
}

function ReviewDemo() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    timeline.reset('Page opened');
    getProduct().then((p) => { setProduct(p); setReviews(p.reviews); }).catch(() => {});
  }, []);

  return (
    <div className="demo">
      <section className="demo-card" data-stage="try">
        <div className="demo-head">
          <span className="stage-tag">1 · Try it</span>
          <strong className="demo-title">The review form you'll fix</strong>
        </div>
        <div className="demo-body pr-grid">
          <div>
            <p className="demo-hint">Find the two bugs: click <b>Post review</b> twice, quickly. Then post a review that's too short, and then a good one.</p>
            <ReviewForm onAdded={(r) => setReviews((rs) => [r, ...rs])} />
          </div>
          <ProductReviews product={product} reviews={reviews} />
        </div>
        <p className="demo-note">Your task: rewrite <code>src/ReviewForm.tsx</code> with React 19 Actions so a double click sends one request, the error clears on the next try, and the form resets after a success. No useState for loading or error. Details in README.md.</p>
      </section>

      <RequestTimeline minScaleMs={2600} />
      <CodePeek title="The form you'll fix" file="src/ReviewForm.tsx" code={FORM_CODE} />
    </div>
  );
}
