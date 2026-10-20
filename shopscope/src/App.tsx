import { sampleProducts } from './data/sampleProducts';
import { formatPrice } from './lib/format';

/**
 * A component is a function from props to UI. This one has no props and
 * returns a description — not DOM — of a heading and a list.
 */
export default function App() {
  return (
    <main>
      <h1>ShopScope</h1>
      <ul>
        {sampleProducts.map((p) => (
          <li key={p.id}>
            {p.title} — {formatPrice(p.price)}
          </li>
        ))}
      </ul>
    </main>
  );
}