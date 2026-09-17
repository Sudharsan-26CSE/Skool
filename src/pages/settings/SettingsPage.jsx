import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Save, Palette, Sparkles, Sun, Moon, Sliders, CheckCircle2, Eye } from 'lucide-react';
import { applyLanguage } from '../../i18n.js';

const SettingsPage = () => {
  const isAdmin = (localStorage.getItem('preskool-role') || 'admin').toLowerCase() === 'admin';
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('preskool-display-name') || 'PreSkool International Academy');
  const [theme, setTheme] = useState(() => localStorage.getItem('preskool-theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('preskool-language') || 'en');
  const [blurAmount, setBlurAmount] = useState(() => {
    const saved = localStorage.getItem('preskool-blur');
    return saved !== null ? parseInt(saved, 10) : 20;
  });
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('--glass-blur', `${blurAmount}px`);
    localStorage.setItem('preskool-theme', theme);
    localStorage.setItem('preskool-blur', blurAmount.toString());
  }, [theme, blurAmount]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preskool-language', language);
    applyLanguage(language);
  }, [language]);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    applyLanguage(nextLanguage);
  };

  const handleBlurChange = (val) => {
    const parsed = parseInt(val, 10);
    setBlurAmount(parsed);
    document.documentElement.style.setProperty('--glass-blur', `${parsed}px`);
    localStorage.setItem('preskool-blur', parsed.toString());
    window.dispatchEvent(new Event('preskool-settings-change'));
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;
    localStorage.setItem('preskool-theme', selectedTheme);
    window.dispatchEvent(new Event('preskool-settings-change'));
  };

  const saveSettings = () => {
    localStorage.setItem('preskool-display-name', schoolName);
    localStorage.setItem('preskool-theme', theme);
    localStorage.setItem('preskool-language', language);
    localStorage.setItem('preskool-blur', blurAmount.toString());
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('--glass-blur', `${blurAmount}px`);
    window.dispatchEvent(new Event('preskool-settings-change'));
    window.dispatchEvent(new Event('preskool-name-change'));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const blurPresets = [
    { label: 'Off', value: 0 },
    { label: 'Subtle', value: 8 },
    { label: 'Balanced', value: 20 },
    { label: 'Deep Frosted', value: 30 },
    { label: 'Ultra Glass', value: 40 },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure application settings, theme appearance, and school information</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saveToast && (
            <span className="badge success" style={{ animation: 'glassFadeIn 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Settings Saved
            </span>
          )}
          <button className="btn btn-primary glass-btn-primary" onClick={saveSettings}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="form-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* ===== APPEARANCE SECTION ===== */}
          <div className="form-section card glass-card" style={{ borderRadius: '10px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Palette size={22} style={{ color: '#6366f1' }} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Poppins, sans-serif' }}>Appearance & Visual Glass System</h3>
            </div>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>
              Personalize your dashboard themes, background blur density, and frosted glass aesthetics.
            </p>

            {/* Themes Selector */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Select Dashboard Theme
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {/* Bright Aurora Glass */}
                <div
                  onClick={() => handleThemeSelect('light')}
                  style={{
                    padding: '18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    position: 'relative',
                    border: theme === 'light' ? '2px solid #6366f1' : '1px solid rgba(150, 160, 180, 0.25)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: theme === 'light' ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sun size={18} style={{ color: '#f59e0b' }} />
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Bright Aurora Glass</strong>
                    </div>
                    {theme === 'light' && <CheckCircle2 size={18} style={{ color: '#6366f1' }} />}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Luminous white frosted blur with soft pastel aurora glowing mesh behind glass panels.
                  </p>
                  <div style={{ marginTop: '12px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #ccfbf1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155' }}>Preview: White Frosted Glow</span>
                  </div>
                </div>

                {/* Cosmic Slate Glass (Dark Mode) */}
                <div
                  onClick={() => handleThemeSelect('dark')}
                  style={{
                    padding: '18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    position: 'relative',
                    border: theme === 'dark' ? '2px solid #38bdf8' : '1px solid rgba(150, 160, 180, 0.25)',
                    background: '#0f172a',
                    boxShadow: theme === 'dark' ? '0 0 16px rgba(56, 189, 248, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Moon size={18} style={{ color: '#38bdf8' }} />
                      <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Cosmic Slate Glass</strong>
                    </div>
                    {theme === 'dark' && <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                    Deep dark translucent blur with glowing cyan and indigo cosmic aurora.
                  </p>
                  <div style={{ marginTop: '12px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #082f49 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#38bdf8' }}>Preview: Dark Aurora Glow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blur Effect Adjustment */}
            <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid rgba(150, 160, 180, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} style={{ color: '#6366f1' }} />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Background Blur Adjustment</strong>
                </div>
                <span className="badge info" style={{ fontSize: '0.82rem', padding: '4px 10px', borderRadius: '10px' }}>
                  Current: {blurAmount}px {blurAmount === 0 ? '(Disabled)' : blurAmount <= 10 ? '(Subtle)' : blurAmount <= 25 ? '(Balanced)' : '(Deep Frosted)'}
                </span>
              </div>

              <p className="page-subtitle" style={{ fontSize: '0.82rem', marginBottom: '14px' }}>
                Adjust the backdrop blur intensity across all cards, headers, sidebars, and overlays in real-time.
              </p>

              {/* Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>0px</span>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={blurAmount}
                  onChange={(e) => handleBlurChange(e.target.value)}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '10px',
                    accentColor: '#6366f1',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>40px</span>
              </div>

              {/* Presets */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {blurPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleBlurChange(preset.value)}
                    className="btn"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      borderRadius: '10px',
                      border: blurAmount === preset.value ? '1px solid #6366f1' : '1px solid rgba(150, 160, 180, 0.25)',
                      background: blurAmount === preset.value ? 'linear-gradient(135deg, #6366f1, #3b82f6)' : 'rgba(150, 160, 180, 0.1)',
                      color: blurAmount === preset.value ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: blurAmount === preset.value ? 600 : 500,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {preset.label} ({preset.value}px)
                  </button>
                ))}
              </div>

              {/* Real-time Glass Preview Sandbox */}
              <div style={{ position: 'relative', height: '110px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(150, 160, 180, 0.2)' }}>
                {/* Colorful animated orbs behind the glass */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #ec4899)' }}>
                  <div style={{ position: 'absolute', top: '10px', left: '20px', width: '70px', height: '70px', borderRadius: '50%', background: '#fbbf24', filter: 'blur(10px)', opacity: 0.9 }} />
                  <div style={{ position: 'absolute', bottom: '10px', right: '40px', width: '90px', height: '90px', borderRadius: '50%', background: '#34d399', filter: 'blur(12px)', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', top: '25px', left: '160px', width: '80px', height: '80px', borderRadius: '50%', background: '#a855f7', filter: 'blur(14px)', opacity: 0.8 }} />
                </div>
                {/* The glass layer on top showing the actual blur */}
                <div style={{
                  position: 'absolute',
                  inset: '12px',
                  borderRadius: '10px',
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: `blur(${blurAmount}px) saturate(180%)`,
                  WebkitBackdropFilter: `blur(${blurAmount}px) saturate(180%)`,
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.85)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} style={{ color: '#6366f1' }} />
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>Live Frosted Glass Preview</strong>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Blur: {blurAmount}px • Theme: {theme}</span>
                    </div>
                  </div>
                  <span className="badge positive" style={{ fontSize: '0.75rem', borderRadius: '10px' }}>
                    Smooth Glass Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* School Identity */}
          {isAdmin && (
            <div className="form-section card glass-card" style={{ borderRadius: '10px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontFamily: 'Poppins, sans-serif' }}>School Identity Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Institution Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '10px' }}
                    value={schoolName}
                    onChange={(event) => setSchoolName(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Academic Year</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '10px' }}
                    defaultValue="2024 - 2025"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Language Settings */}
          <div className="form-section card glass-card" style={{ borderRadius: '10px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontFamily: 'Poppins, sans-serif' }}>Language & Regional</h3>
            <div className="settings-choice-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>Application Language</strong>
                <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>Choose the localization language used across the application.</p>
              </div>
              <label className="theme-select">
                <select value={language} onChange={handleLanguageChange} className="form-input glass-select" style={{ borderRadius: '10px', minWidth: '160px' }}>
                  <option value="en">English (US)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="zh">Chinese (中文)</option>
                  <option value="ja">Japanese (日本語)</option>
                </select>
              </label>
            </div>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
