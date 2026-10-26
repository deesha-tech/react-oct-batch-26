// Real requests to DummyJSON (https://dummyjson.com). Each one shows up as a bar in the request timeline.
import { timeline, trackedFetch } from './shell/timeline';

export interface Review { id: number; rating: number; comment: string; reviewerName: string; sending?: boolean }
export interface Product { title: string; brand: string; price: number; thumbnail: string; reviews: Review[] }

export async function getProduct(): Promise<Product> {
  const p = await trackedFetch<Omit<Product, 'reviews'> & { reviews: Omit<Review, 'id'>[] }>(
    'GET /products/123',
    'https://dummyjson.com/products/123?select=title,brand,price,thumbnail,reviews',
  );
  return { ...p, reviews: p.reviews.map((r, i) => ({ ...r, id: i + 1 })) };
}

/**
 * Posts a review. DummyJSON's `delay` makes the server take about a second, like a real one, so you can
 * click twice while it's busy. Reviews shorter than 10 characters are rejected, the way a real API would.
 */
export async function postReview(comment: string, rating: number): Promise<Review> {
  const id = timeline.start('POST /reviews', 'post');
  try {
    const res = await fetch('https://dummyjson.com/comments/add?delay=1200', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: comment || '-', postId: 3, userId: 5 }),
    });
    if (!res.ok) throw new Error(`The server said ${res.status}`);
    const saved = (await res.json()) as { id: number };
    if (comment.trim().length < 10) throw new Error('Too short: a review needs at least 10 characters.');
    timeline.finish(id, 'done');
    return { id: saved.id + Math.round(Math.random() * 1e6), rating, comment: comment.trim(), reviewerName: 'You' };
  } catch (e) {
    timeline.finish(id, 'error');
    throw e;
  }
}
