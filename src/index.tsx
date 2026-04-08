import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hide loader when app is mounted
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    // Add hidden class for smooth fade out
    loader.classList.add('loader-hidden');
    // Remove from DOM after animation
    setTimeout(() => {
      loader.remove();
    }, 600);
  }
});
