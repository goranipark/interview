import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppStateProvider } from './state/useAppState.jsx';
import './styles/tokens.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>
);
