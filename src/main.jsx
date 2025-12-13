import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/layout/ErrorBoundary';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/globals.css';
import './styles/glassmorphism.css';
import './styles/animations.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
