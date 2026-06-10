import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import './index.css';
import App from './App.tsx';

// Init Telegram SDK safely
try {
  WebApp.ready();
  WebApp.expand();
} catch {
  // Running outside Telegram
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
