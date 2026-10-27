import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap first, then our overrides — order matters for the cascade.
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import App from './App'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
