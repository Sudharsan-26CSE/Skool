import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Save, Palette } from 'lucide-react';
import { applyLanguage } from '../../i18n.js';

const SettingsPage = () => {
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('preskool-display-name') || 'PreSkool International Academy');
  const [theme, setTheme] = useState(() => localStorage.getItem('preskool-theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('preskool-language') || 'en');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preskool-language', language);
    applyLanguage(language);
  }, [theme, language]);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    applyLanguage(nextLanguage);
  };

  const saveSettings = () => {
    localStorage.setItem('preskool-display-name', schoolName);
    localStorage.setItem('preskool-theme', theme);
    localStorage.setItem('preskool-language', language);
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    window.dispatchEvent(new Event('preskool-settings-change'));
    window.dispatchEvent(new Event('preskool-name-change'));
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure application settings and school info</p>
        </div>
        <button className="btn btn-primary" onClick={saveSettings}><Save size={16} /> Save Changes</button>
      </div>

      <div className="form-page">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-section">
            <h3>School Identity Settings</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Institution Name</label>
                <input type="text" className="form-input" value={schoolName} onChange={(event) => setSchoolName(event.target.value)} />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input type="text" className="form-input" defaultValue="2024 - 2025" />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Language</h3>
            <div className="settings-choice-row">
              <div><strong>Website language</strong><p className="page-subtitle">Choose the language used by the application.</p></div>
              <label className="theme-select"><select value={language} onChange={handleLanguageChange}>
                <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="hi">Hindi</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="ar">Arabic</option><option value="zh">Chinese</option><option value="ja">Japanese</option>
              </select></label>
            </div>
          </div>
          <div className="form-section">
            <h3>Appearance</h3>
            <div className="settings-choice-row">
              <div><strong>Theme</strong><p className="page-subtitle">Set the dashboard appearance for this browser.</p></div>
              <label className="theme-select"><Palette size={16} /><select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
