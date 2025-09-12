// src/prerender.js

// Must export this for vite-prerender-plugin
export function prerender() {
  document.dispatchEvent(new Event('render-event'));
}
