import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import App from './app/App.jsx';
import store from './app/Store.js';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  // Hydrate pre-rendered HTML
  hydrateRoot(
    rootElement,
    <StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </StrictMode>
  );
} else {
  // Normal render for dev / initial load
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </StrictMode>
  );
}
