import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// PWA Service Worker Offline Support & Dev Mode Resolution
if (import.meta.env.PROD) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered successfully:', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
} else {
  // In development, unregister active service workers to avoid HMR context mismatches
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister().then(unregistered => {
          if (unregistered) {
            console.log('Unregistered active service worker in development mode.');
            caches.keys().then(names => {
              for (const name of names) {
                caches.delete(name);
              }
            });
            window.location.reload();
          }
        });
      }
    });
  }
}
