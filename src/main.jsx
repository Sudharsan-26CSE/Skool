import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; // Assuming this contains your global styles and design tokens
import { startLanguageSupport } from './i18n.js';

const savedTheme = localStorage.getItem('preskool-theme');
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}

const savedLanguage = localStorage.getItem('preskool-language') || 'en';
document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
startLanguageSupport();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter>
  </React.StrictMode>,
);
