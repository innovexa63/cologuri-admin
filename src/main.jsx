import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initSocket } from './services/socket';

// Initialize background Socket.io connection
try {
  initSocket();
} catch (e) {
  // Socket fallback
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
