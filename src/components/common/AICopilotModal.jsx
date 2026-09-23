import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  User,
  Shield,
  Palette,
  Search,
  CheckCircle,
  AlertTriangle,
  Lock,
  RefreshCw,
  Sliders,
  ChevronDown
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
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('default');
  const [showThemePanel, setShowThemePanel] = useState(false);

  const messagesEndRef = useRef(null);

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

  // Initial greeting
  useEffect(() => {
    const roleTitle = isAdmin ? 'Super Administrator' : isStaff ? 'Faculty Member' : 'Student';
    setMessages([
      {
        id: 'init-1',
        sender: 'ai',
        text: `👋 Hello **${userName}**! I'm your personalized **Skool AI Assistant**.\n\n` +
          `• 🔍 Prompt **"Search my data"** to view your authenticated ${roleTitle} records.\n` +
          `• 🎨 Prompt **"Optimize my UI"** to customize and theme your workspace.\n` +
          `${isAdmin || isStaff ? `• 🛡️ *You have verified edit permissions across school datasets.*` : `• 🔒 *Edit access is restricted to Admin and Staff only.*`}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [userEmail, userRole, userName, isAdmin, isStaff]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await processAIQuery(query, userContext);
      
      if (response.theme) {
        setActiveThemeId(response.theme.themeId);
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.message,
        type: response.type,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ I encountered an issue processing your request: ${err.message}`,
          type: 'error',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
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
    const aiMsg = {
      id: `theme-${Date.now()}`,
      sender: 'ai',
      text: `✨ **UI Theme Applied**: **${themeName}**!\n\nThis personalized style has been saved for **${userEmail}**. Your workspace will always load with your unique design.`,
      type: 'ui_optimized',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, aiMsg]);
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
            aria-label="Open Skool AI Copilot"
            title="Ask Skool AI Copilot"
          >
            <div className="skool-ai-fab-glow" />
            <div className="skool-ai-fab-icon">
              <Sparkles size={22} className="ai-sparkle-icon" />
            </div>
            <span className="skool-ai-fab-label">AI Copilot</span>
            <span className="skool-ai-status-dot" />
          </button>
        )}
      </div>

      {/* Expandable AI Dialog Modal in Bottom-Right Corner */}
      {isOpen && (
        <aside
          className="skool-ai-drawer"
          aria-label="Skool AI Copilot"
        >
          {/* Header */}
          <div className="skool-ai-drawer-header">
            <div className="skool-ai-header-info">
              <div className="skool-ai-header-badge-icon">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="skool-ai-drawer-title">Skool AI Copilot</h3>
                <span className="skool-ai-user-pill">
                  {isAdmin ? '👑 Admin' : isStaff ? '📚 Staff' : '🎓 Student'} · {userName}
                </span>
              </div>
            </div>
            <div className="skool-ai-header-actions">
              <button
                type="button"
                className="skool-ai-header-btn"
                title="Personalize UI Theme"
                onClick={() => setShowThemePanel(!showThemePanel)}
              >
                <Palette size={15} />
              </button>
              <button
                type="button"
                className="skool-ai-header-btn"
                title="Close"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick UI Theming Drawer Strip (Per-User Personalization) */}
          {showThemePanel && (
            <div className="skool-ai-theme-panel">
              <div className="skool-ai-theme-title">
                <Palette size={13} />
                <span>Your Unique UI Theme:</span>
              </div>
              <div className="skool-ai-theme-chips">
                {Object.values(UI_THEMES).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className={`skool-theme-chip ${activeThemeId === t.id ? 'active' : ''}`}
                    onClick={() => handleQuickThemeSelect(t.id)}
                  >
                    <span className="theme-color-dot" style={{ background: t.primary }} />
                    {t.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="skool-ai-messages-container">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`skool-ai-message ${m.sender === 'user' ? 'user-message' : 'ai-message'} ${m.type || ''}`}
              >
                <div className="skool-ai-message-bubble">
                  {/* Markdown formatted output */}
                  <div
                    className="skool-ai-message-content"
                    dangerouslySetInnerHTML={{
                      __html: (m.text || '')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/\n/g, '<br />')
                    }}
                  />
                  <span className="skool-ai-message-time">{m.time}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="skool-ai-message ai-message">
                <div className="skool-ai-message-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="skool-ai-quick-prompts">
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Search my data')}
            >
              <Search size={12} /> Search My Data
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Optimize UI to Cyberpunk')}
            >
              <Sparkles size={12} /> Cyberpunk UI
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Optimize UI to Emerald')}
            >
              <Palette size={12} /> Emerald Glass
            </button>
            {isAdmin && (
              <button
                type="button"
                className="skool-quick-chip"
                onClick={() => handleSendMessage('Show classes')}
              >
                🏫 Active Classes
              </button>
            )}
          </div>

          {/* Input Footer */}
          <form
            className="skool-ai-drawer-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="skool-ai-input"
              placeholder={
                isAdmin
                  ? 'Ask AI or query school records...'
                  : isStaff
                  ? 'Ask AI or check class timetables...'
                  : 'Search your student records or customize UI...'
              }
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="skool-ai-send-btn"
              disabled={!inputQuery.trim() || loading}
              title="Send to AI Copilot"
            >
              <Send size={15} />
            </button>
          </form>
        </aside>
      )}
    </>
  );
};

export default AICopilotModal;
