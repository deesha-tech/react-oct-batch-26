import { createRoot } from 'react-dom/client';
import { App } from './App';

// StrictMode is deliberately off, so every request in the timeline is one the user actually caused.
createRoot(document.getElementById('root')!).render(<App />);
