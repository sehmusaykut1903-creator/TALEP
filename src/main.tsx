import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { RuntimeErrorBoundary, EmergencyDashboardFallback } from './components/RuntimeErrorManager';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RuntimeErrorBoundary fallback={<EmergencyDashboardFallback />}>
      <HashRouter>
        <App />
      </HashRouter>
    </RuntimeErrorBoundary>
  </StrictMode>
);
