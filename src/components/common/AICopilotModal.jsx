import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Play,
  User,
  Palette,
  Search,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Shield,
  FileText
} from 'lucide-react';
import {
  processAIQuery,
  getUserUIPreferences,
  saveUserUIPreferences,
  applyUserUIPreferences,
  UI_THEMES
} from '../../services/aiCopilotService';
import { isUserAdmin } from '../../services/api';

const AICopilotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('default');
  const [lastResult, setLastResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Identify current user and role
  const userRole = (localStorage.getItem('preskool-role') || 'student').toLowerCase();
  const userEmail = (localStorage.getItem('preskool-email') || '').toLowerCase();
  const userName = localStorage.getItem('preskool-user-name') || (userRole === 'admin' ? 'Super Administrator' : userEmail.split('@')[0] || 'User');
  const isAdmin = userRole === 'admin' || isUserAdmin(userEmail);
  const isStaff = userRole === 'staff' || userRole === 'teacher';

  const userContext = {
    email: userEmail,
    role: userRole,
    name: userName
  };

  // Load and apply this specific user's saved UI preferences on mount
  useEffect(() => {
    const prefs = getUserUIPreferences(userEmail);
    setActiveThemeId(prefs.themeId || 'default');
    applyUserUIPreferences(prefs);
  }, [userEmail]);

  const handleRunPrompt = async (forcedPrompt) => {
    const query = (forcedPrompt || promptText).trim();
    if (!query) return;

    setLoading(true);
    setCopied(false);

    try {
      const response = await processAIQuery(query, userContext);
      if (response.theme) {
        setActiveThemeId(response.theme.themeId);
      }
      setLastResult({
        prompt: query,
        message: response.message,
        type: response.type || 'info',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setPromptText('');
    } catch (err) {
      setLastResult({
        prompt: query,
        message: `⚠️ Error executing prompt: ${err.message}`,
        type: 'error',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickThemeSelect = (themeId) => {
    const currentPrefs = getUserUIPreferences(userEmail);
    const newPrefs = { ...currentPrefs, themeId };
    saveUserUIPreferences(userEmail, newPrefs);
    setActiveThemeId(themeId);

    const themeName = UI_THEMES[themeId]?.name || themeId;
    setLastResult({
      prompt: `Optimize UI to ${themeName}`,
      message: `✨ **UI Theme Applied**: **${themeName}**!\n\nThis personalized style has been saved exclusively for **${userEmail}**. Your workspace will always load with your unique design.`,
      type: 'ui_optimized',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleCopyResult = () => {
    if (lastResult?.message) {
      const plainText = lastResult.message.replace(/[*`_]/g, '');
      navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Floating Action Button in Bottom-Right Corner */}
      <div className="skool-ai-fab-container">
        {!isOpen && (
          <button
            type="button"
            className="skool-ai-fab hover-lift"
            onClick={() => setIsOpen(true)}
            aria-label="Open Skool AI Prompt Console"
            title="Open AI Prompt Console"
          >
            <div className="skool-ai-fab-glow" />
            <div className="skool-ai-fab-icon">
              <Sparkles size={22} className="ai-sparkle-icon" />
            </div>
            <span className="skool-ai-fab-label">AI Prompt</span>
            <span className="skool-ai-status-dot" />
          </button>
        )}
      </div>

      {/* Expandable AI Prompt Console Drawer in Bottom-Right Corner */}
      {isOpen && (
        <aside className="skool-ai-drawer prompt-mode" aria-label="Skool AI Prompt Console">
          {/* Header */}
          <div className="skool-ai-drawer-header">
            <div className="skool-ai-header-info">
              <div className="skool-ai-header-badge-icon">
                <Terminal size={17} />
              </div>
              <div>
                <h3 className="skool-ai-drawer-title">Skool AI Prompt Console</h3>
                <span className="skool-ai-user-pill">
                  {isAdmin ? '👑 Admin' : isStaff ? '📚 Staff' : '🎓 Student'} · {userName}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="skool-ai-header-btn"
              title="Close Prompt Console"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="skool-prompt-body">
            {/* Main AI Prompt Input Box */}
            <div className="skool-prompt-input-card">
              <label htmlFor="ai-prompt-box" className="skool-prompt-label">
                <Sparkles size={14} className="text-primary" />
                <span>Enter Your AI Prompt:</span>
              </label>
              <div className="skool-prompt-textarea-wrapper">
                <textarea
                  id="ai-prompt-box"
                  className="skool-prompt-textarea"
                  rows={3}
                  placeholder={
                    isAdmin
                      ? 'e.g. "Search my data", "Optimize UI to Cyberpunk", "Show active classes", "Post notice Exam schedule published"'
                      : isStaff
                      ? 'e.g. "Search my data", "Optimize UI to Emerald", "Check my department timetable"'
                      : 'e.g. "Search my data", "Optimize UI to Emerald", "Show my fee status"'
                  }
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleRunPrompt();
                    }
                  }}
                />
              </div>

              <div className="skool-prompt-action-bar">
                <span className="skool-prompt-hint">Ctrl + Enter to run</span>
                <button
                  type="button"
                  className="btn btn-sm btn-primary skool-prompt-run-btn"
                  onClick={() => handleRunPrompt()}
                  disabled={!promptText.trim() || loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={13} className="spin-icon" /> Running...
                    </>
                  ) : (
                    <>
                      <Play size={13} /> Run Prompt
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick 1-Click Prompt Chips */}
            <div className="skool-prompt-presets">
              <span className="skool-preset-title">Instant Prompts:</span>
              <div className="skool-preset-chips">
                <button
                  type="button"
                  className="skool-preset-btn"
                  onClick={() => handleRunPrompt('Search my data')}
                >
                  <Search size={12} /> Search My Data
                </button>
                <button
                  type="button"
                  className="skool-preset-btn"
                  onClick={() => handleRunPrompt('Optimize UI to Cyberpunk')}
                >
                  ⚡ Cyberpunk UI
                </button>
                <button
                  type="button"
                  className="skool-preset-btn"
                  onClick={() => handleRunPrompt('Optimize UI to Emerald')}
                >
                  🌿 Emerald UI
                </button>
                <button
                  type="button"
                  className="skool-preset-btn"
                  onClick={() => handleRunPrompt('Optimize UI to Sunset')}
                >
                  🌅 Sunset UI
                </button>
                <button
                  type="button"
                  className="skool-preset-btn"
                  onClick={() => handleRunPrompt('Optimize UI to Midnight')}
                >
                  🌙 Midnight OLED
                </button>
                <button
                  type="button"
                  className="skool-preset-btn"
                  onClick={() => handleRunPrompt('Reset UI to default')}
                >
                  🔄 Reset Theme
                </button>
              </div>
            </div>

            {/* Direct Theme Palette Switcher */}
            <div className="skool-prompt-theme-bar">
              <span className="skool-theme-bar-label">
                <Palette size={13} />
                <span>Live Personal Theme:</span>
              </span>
              <div className="skool-theme-bar-dots">
                {Object.values(UI_THEMES).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className={`theme-dot-btn ${activeThemeId === t.id ? 'active' : ''}`}
                    title={t.name}
                    onClick={() => handleQuickThemeSelect(t.id)}
                    style={{ background: t.primary }}
                  />
                ))}
              </div>
            </div>

            {/* Prompt Execution Result Output Card (Not Chatbot) */}
            {lastResult && (
              <div className={`skool-prompt-result-card ${lastResult.type}`}>
                <div className="skool-result-card-header">
                  <div className="skool-result-title">
                    <CheckCircle size={14} className="text-success" />
                    <span>Prompt Output: <em>"{lastResult.prompt}"</em></span>
                  </div>
                  <div className="skool-result-actions">
                    <button
                      type="button"
                      className="skool-copy-btn"
                      onClick={handleCopyResult}
                      title="Copy result"
                    >
                      {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                    </button>
                    <span className="skool-result-time">{lastResult.time}</span>
                  </div>
                </div>

                <div
                  className="skool-result-content"
                  dangerouslySetInnerHTML={{
                    __html: (lastResult.message || '')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`(.*?)`/g, '<code>$1</code>')
                      .replace(/\n/g, '<br />')
                  }}
                />
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export default AICopilotModal;
