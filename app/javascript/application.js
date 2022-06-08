// Entry point for the build script in your package.json
import React from 'react';
import { createRoot } from 'react-dom/client';


const container = document.getElementById('root');
const root = createRoot(container);

document.addEventListener('DOMContentLoaded', () => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});