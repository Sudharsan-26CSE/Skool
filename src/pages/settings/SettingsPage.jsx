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
    const effectiveBlur = theme === 'dark' ? 0 : blurAmount;
    document.documentElement.style.setProperty('--glass-blur', `${effectiveBlur}px`);
    localStorage.setItem('preskool-theme', theme);
    localStorage.setItem('preskool-blur', effectiveBlur.toString());
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
    const effectiveBlur = theme === 'dark' ? 0 : parsed;
    document.documentElement.style.setProperty('--glass-blur', `${effectiveBlur}px`);
    localStorage.setItem('preskool-blur', effectiveBlur.toString());
    window.dispatchEvent(new Event('preskool-settings-change'));
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;
    localStorage.setItem('preskool-theme', selectedTheme);
    localStorage.setItem('skool-theme', selectedTheme);
    const effectiveBlur = selectedTheme === 'dark' ? 0 : (blurAmount === 0 ? 20 : blurAmount);
    setBlurAmount(effectiveBlur);
    document.documentElement.style.setProperty('--glass-blur', `${effectiveBlur}px`);
    localStorage.setItem('preskool-blur', effectiveBlur.toString());
    localStorage.setItem('skool-blur', effectiveBlur.toString());
    window.dispatchEvent(new Event('preskool-settings-change'));
  };

  const saveSettings = () => {
    const effectiveBlur = theme === 'dark' ? 0 : blurAmount;
    localStorage.setItem('preskool-display-name', schoolName);
    localStorage.setItem('preskool-theme', theme);
    localStorage.setItem('skool-theme', theme);
    localStorage.setItem('preskool-language', language);
    localStorage.setItem('preskool-blur', effectiveBlur.toString());
    localStorage.setItem('skool-blur', effectiveBlur.toString());
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('--glass-blur', `${effectiveBlur}px`);
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
          <button className="btn btn-primary" onClick={saveSettings}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="form-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* ===== APPEARANCE SECTION ===== */}
          <div className="form-section card glass-card" style={{ borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Palette size={22} style={{ color: '#38bdf8' }} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Poppins, sans-serif' }}>Appearance & Display Themes</h3>
            </div>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>
              Personalize your dashboard theme, primary and secondary color accents, and display aesthetics.
            </p>

            {/* Themes Selector */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Select Dashboard Theme
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {/* Bright Mode */}
                <div
                  onClick={() => handleThemeSelect('light')}
                  style={{
                    padding: '18px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    border: theme === 'light' ? '2px solid #0284c7' : '1px solid rgba(150, 160, 180, 0.25)',
                    background: 'rgba(255, 255, 255, 0.85)',
                    boxShadow: theme === 'light' ? '0 0 16px rgba(2, 132, 199, 0.25)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sun size={18} style={{ color: '#0284c7' }} />
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Bright Mode</strong>
                    </div>
                    {theme === 'light' && <CheckCircle2 size={18} style={{ color: '#0284c7' }} />}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Crisp white canvas with sky-blue accents, modern typography, and optional glass blur.
                  </p>
                  <div style={{ marginTop: '12px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #ffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0369a1' }}>Preview: Sky Blue & White Glow</span>
                  </div>
                </div>

                {/* Dark Mode (Black & Sky Blue) */}
                <div
                  onClick={() => handleThemeSelect('dark')}
                  style={{
                    padding: '18px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    border: theme === 'dark' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.18)',
                    background: '#000000',
                    boxShadow: theme === 'dark' ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Moon size={18} style={{ color: '#38bdf8' }} />
                      <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>Dark Mode (Black & Sky Blue)</strong>
                    </div>
                    {theme === 'dark' && <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                    Primary: Black (#000000) • Secondary: Sky Blue (#38bdf8) • Text: White • Zero Blur
                  </p>
                  <div style={{ marginTop: '12px', height: '36px', borderRadius: '10px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #38bdf8' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#38bdf8' }}>Preview: Pure Black Canvas + Sky Blue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blur Effect Adjustment */}
            <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid rgba(150, 160, 180, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} style={{ color: '#38bdf8' }} />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Background Blur Adjustment</strong>
                </div>
                <span className="badge info" style={{ fontSize: '0.82rem', padding: '4px 10px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: theme === 'dark' ? '#38bdf8' : '#0284c7', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {theme === 'dark' ? '0px (Removed in Dark Theme)' : `Current: ${blurAmount}px ${blurAmount === 0 ? '(Disabled)' : blurAmount <= 10 ? '(Subtle)' : blurAmount <= 25 ? '(Balanced)' : '(Deep Frosted)'}`}
                </span>
              </div>

              {theme === 'dark' ? (
                /* Dark Mode Zero Blur Notice */
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.06)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '18px'
                }}>
                  <CheckCircle2 size={20} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block' }}>
                      Background Blur Disabled in Dark Theme
                    </strong>
                    <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.82rem' }}>
                      Dark Theme uses pure solid black (#000000) cards and header with zero blur distortion for maximum clarity, crisp contrast, and instant rendering.
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <p className="page-subtitle" style={{ fontSize: '0.82rem', marginBottom: '14px' }}>
                    Adjust the backdrop blur intensity across cards and overlays in Bright Mode in real-time.
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
                        accentColor: '#38bdf8',
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
                          borderRadius: '12px',
                          border: blurAmount === preset.value ? '1px solid #38bdf8' : '1px solid rgba(150, 160, 180, 0.25)',
                          background: blurAmount === preset.value ? 'linear-gradient(180deg, #38bdf8, #0284c7)' : 'rgba(150, 160, 180, 0.1)',
                          color: blurAmount === preset.value ? '#ffffff' : 'var(--text-primary)',
                          fontWeight: blurAmount === preset.value ? 600 : 500,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {preset.label} ({preset.value}px)
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Real-time Preview Sandbox */}
              <div style={{ position: 'relative', height: '110px', borderRadius: '14px', overflow: 'hidden', border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid rgba(150, 160, 180, 0.2)' }}>
                {theme === 'dark' ? (
                  /* Dark theme preview: Pure black canvas, zero blur */
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#000000',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={20} style={{ color: '#38bdf8' }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.92rem', color: '#ffffff', display: 'block' }}>Pure Dark Theme Preview</strong>
                        <span style={{ fontSize: '0.76rem', color: '#38bdf8' }}>Primary: Black (#000000) • Secondary: Sky Blue (#38bdf8) • Text: White</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.35)'
                    }}>
                      Zero Blur Active
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Colorful animated orbs behind the glass in light theme */}
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
                      background: 'rgba(255, 255, 255, 0.72)',
                      backdropFilter: `blur(${blurAmount}px) saturate(180%)`,
                      WebkitBackdropFilter: `blur(${blurAmount}px) saturate(180%)`,
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 20px',
                      color: '#0f172a',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={20} style={{ color: '#0284c7' }} />
                        <div>
                          <strong style={{ fontSize: '0.9rem', display: 'block' }}>Live Frosted Glass Preview</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Blur: {blurAmount}px • Theme: Bright Mode</span>
                        </div>
                      </div>
                      <span className="badge positive" style={{ fontSize: '0.75rem', borderRadius: '10px' }}>
                        Smooth Glass Active
                      </span>
                    </div>
                  </>
                )}
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
