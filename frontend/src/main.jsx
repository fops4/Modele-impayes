import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// --- Ajouts ---
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js'; // Importer notre thème personnalisé

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envelopper toute l'application avec le ThemeProvider */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline réinitialise les styles par défaut du navigateur */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);