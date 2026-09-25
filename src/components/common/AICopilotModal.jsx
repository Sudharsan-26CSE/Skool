import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  User,
  Bot,
  Palette,
  RotateCcw,
  Copy,
  Check,
  PlusCircle,
  Trash2,
  Users,
  Briefcase,
  Bell,
  Wand2,
  Sliders,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import {
  handleAIAssistantMessage,
  applyTwoColorTheme,
  applyPresetTheme,
  getCurrentColors,
  generateMatchingSecondaryColor,
  TWO_COLOR_PRESETS
} from '../../services/aiAssistantService';
import { isUserAdmin } from '../../services/api';

const INITIAL_WELCOME = {
  id: 'welcome-1',
  sender: 'assistant',
  text: `👋 **Hello! I am your Skool AI Assistant.**

I work just like ChatGPT and can directly update your school database and customize your screens!

✨ **What I can do for you:**
• ➕ **Add / Delete Students**: \`Add student Aarav, class 10-A, roll 101\` or \`Delete student Aarav\`
• ➕ **Add / Delete Staff**: \`Add staff Dr. Anita Roy, department Science\` or \`Delete staff Dr. Anita\`
• 🎨 **Two-Color System**: Pick any color and it automatically generates and applies the **2 matching colors** across all screens!
• 📢 **Publish Notices**: \`Add notice Sports Meet on Friday\`
• 📋 **Query Data**: \`List students\` or \`List staff\`

Tap a quick action below or type any command!`,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const AICopilotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('skool_ai_chat_history');
      return saved ? JSON.parse(saved) : [INITIAL_WELCOME];
    } catch (e) {
      return [INITIAL_WELCOME];
    }
  });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showColorPanel, setShowColorPanel] = useState(false);

  // Dual-Color Theme State
  const initialColors = getCurrentColors();
  const [primaryHex, setPrimaryHex] = useState(initialColors.primary);
  const [secondaryHex, setSecondaryHex] = useState(initialColors.secondary);
  const [activePresetId, setActivePresetId] = useState(() => {
    return localStorage.getItem('skool-theme-preset') || 'sky-violet';
  });

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // User credentials & role
  const userRole = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const userEmail = (localStorage.getItem('preskool-email') || '').toLowerCase();
  const userName = localStorage.getItem('preskool-user-name') || (userRole === 'admin' ? 'Super Admin' : userEmail.split('@')[0] || 'User');
  const isAdmin = userRole === 'admin' || isUserAdmin(userEmail);
  const isStaff = userRole === 'staff' || userRole === 'teacher';

  const userContext = {
    email: userEmail,
    role: userRole,
    name: userName
  };

  // Persist chat in session
  useEffect(() => {
    try {
      sessionStorage.setItem('skool_ai_chat_history', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    const userMsgId = `u-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await handleAIAssistantMessage(query, userContext);

      if (res.action === 'theme_changed') {
        if (res.primaryColor) setPrimaryHex(res.primaryColor);
        if (res.secondaryColor) setSecondaryHex(res.secondaryColor);
      }

      // Notify any listening data components to re-fetch
      if (res.action) {
        window.dispatchEvent(new CustomEvent('skool-db-mutation', { detail: res }));
      }

      const assistantMsg = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: res.reply || 'Task completed successfully.',
        action: res.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Error executing request**: ${err.message || 'Server error occurred'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // When primary color changes, auto-match the partner secondary color
  const handlePrimaryChange = (newPrimary) => {
    setPrimaryHex(newPrimary);
    if (/^#[0-9A-Fa-f]{6}$/.test(newPrimary)) {
      const autoSec = generateMatchingSecondaryColor(newPrimary);
      setSecondaryHex(autoSec);
      applyTwoColorTheme(newPrimary, autoSec);
      setActivePresetId('custom');
    }
  };

  // When secondary color changes manually
  const handleSecondaryChange = (newSecondary) => {
    setSecondaryHex(newSecondary);
    if (/^#[0-9A-Fa-f]{6}$/.test(newSecondary) && /^#[0-9A-Fa-f]{6}$/.test(primaryHex)) {
      applyTwoColorTheme(primaryHex, newSecondary);
      setActivePresetId('custom');
    }
  };

  // Auto-Match partner secondary color
  const handleAutoMatchPartner = () => {
    const autoSec = generateMatchingSecondaryColor(primaryHex);
    setSecondaryHex(autoSec);
    applyTwoColorTheme(primaryHex, autoSec);
    setActivePresetId('custom');

    const confirmationMsg = {
      id: `theme-automatch-${Date.now()}`,
      sender: 'assistant',
      text: `🪄 **Harmonious Color Auto-Matched!**\n\n• **Primary**: \`${primaryHex}\`\n• **Matching Partner**: \`${autoSec}\`\n\n*These two complementary colors are now live across all screens.*`,
      action: 'theme_changed',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, confirmationMsg]);
  };

  // Apply both colors explicitly to all screens
  const handleApplyToAll = () => {
    let cleanP = primaryHex.trim();
    let cleanS = secondaryHex.trim();
    if (!cleanP.startsWith('#')) cleanP = `#${cleanP}`;
    if (!cleanS.startsWith('#')) cleanS = `#${cleanS}`;

    if (!/^#[0-9A-Fa-f]{6}$/.test(cleanP)) cleanP = '#0284c7';
    if (!/^#[0-9A-Fa-f]{6}$/.test(cleanS)) cleanS = generateMatchingSecondaryColor(cleanP);

    setPrimaryHex(cleanP);
    setSecondaryHex(cleanS);
    applyTwoColorTheme(cleanP, cleanS);

    const confirmationMsg = {
      id: `theme-applied-${Date.now()}`,
      sender: 'assistant',
      text: `🎨 **Two Matching Colors Applied Across All Screens!**\n\n• **Primary Brand Color**: \`${cleanP}\`\n• **Secondary Accent Color**: \`${cleanS}\`\n\n*Only these two complementary colors have been updated across headers, buttons, cards, and navigation.*`,
      action: 'theme_changed',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, confirmationMsg]);
  };

  // Select a preset two-color theme
  const handlePresetSelect = (preset) => {
    setPrimaryHex(preset.primary);
    setSecondaryHex(preset.secondary);
    setActivePresetId(preset.id);
    applyPresetTheme(preset.id);

    const confirmationMsg = {
      id: `theme-preset-${Date.now()}`,
      sender: 'assistant',
      text: `✨ **Two-Color Theme Applied: ${preset.name}!**\n\n• **Primary**: \`${preset.primary}\`\n• **Accent**: \`${preset.secondary}\`\n\n*Applied across all screens and dashboards.*`,
      action: 'theme_changed',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, confirmationMsg]);
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_WELCOME]);
    sessionStorage.removeItem('skool_ai_chat_history');
  };

  const handleCopyText = (msgId, text) => {
    const plain = text.replace(/[*`_]/g, '');
    navigator.clipboard.writeText(plain);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Format AI text with bold, code, and bullet styles
  const renderFormattedText = (rawText) => {
    const formatted = rawText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="ai-inline-code">$1</code>')
      .replace(/• /g, '&bull; ')
      .replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <>
      {/* Floating Action Button (Glass Orb FAB) */}
      <div className="skool-ai-fab-container">
        {!isOpen && (
          <button
            type="button"
            className="skool-ai-fab glass-fab hover-lift"
            onClick={() => setIsOpen(true)}
            aria-label="Open Skool AI Assistant"
            title="Open Skool AI Assistant"
          >
            <div className="skool-ai-fab-glow" />
            <div className="skool-ai-fab-icon">
              <Sparkles size={20} className="ai-sparkle-icon" />
            </div>
            <span className="skool-ai-fab-label">AI Assistant</span>
            <span className="skool-ai-status-dot" title="Online" />
          </button>
        )}
      </div>

      {/* Glassmorphic AI Assistant Modal / Drawer */}
      {isOpen && (
        <aside
          className="skool-ai-drawer chatgpt-glass-drawer"
          aria-label="Skool AI Assistant"
          role="dialog"
          aria-modal="true"
        >
          {/* Glass Header */}
          <div className="skool-ai-drawer-header glass-header">
            <div className="skool-ai-header-info">
              <div className="skool-ai-header-badge-icon pulse-glow">
                <Bot size={18} />
              </div>
              <div>
                <div className="skool-ai-title-row">
                  <h3 className="skool-ai-drawer-title">Skool AI Assistant</h3>
                  <span className="skool-ai-badge-online">Online</span>
                </div>
                <span className="skool-ai-user-pill">
                  {isAdmin ? '👑 Admin' : isStaff ? '📚 Staff' : '🎓 Student'} · {userName}
                </span>
              </div>
            </div>

            <div className="skool-ai-header-actions">
              {/* Toggle Color Customizer Button */}
              <button
                type="button"
                className={`skool-ai-header-btn ${showColorPanel ? 'active' : ''}`}
                title="Dual-Color Theme Settings"
                onClick={() => setShowColorPanel(prev => !prev)}
              >
                <Palette size={15} />
              </button>

              {/* Reset / Clear Chat Button */}
              <button
                type="button"
                className="skool-ai-header-btn"
                title="Clear conversation"
                onClick={handleClearHistory}
              >
                <RotateCcw size={14} />
              </button>

              {/* Close Drawer Button */}
              <button
                type="button"
                className="skool-ai-header-btn close-btn"
                title="Close AI Assistant"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Collapsible Dual-Color Theme Customizer Panel */}
          {showColorPanel && (
            <div className="skool-ai-color-panel glass-panel">
              <div className="color-panel-header">
                <span className="color-panel-title">
                  <Palette size={13} className="text-primary" />
                  Dual-Color Theme (2 Matching Colors Only)
                </span>
                <span className="color-panel-badge">Live Sync</span>
              </div>

              {/* Two-Color Curated Presets */}
              <div className="preset-theme-row">
                {TWO_COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-theme-chip dual-chip ${activePresetId === preset.id ? 'active' : ''}`}
                    title={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <span className="dual-preset-dots">
                      <span
                        className="preset-theme-dot"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span
                        className="preset-theme-dot"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </span>
                    <span className="preset-theme-name">{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Dual Color Inputs: Color 1 (Primary) and Color 2 (Matching Partner) */}
              <div className="color-picker-dual-grid">
                {/* Color 1: Primary Brand */}
                <div className="color-picker-dual-item">
                  <span className="dual-input-label">Color 1 (Primary Brand)</span>
                  <div className="dual-input-row">
                    <input
                      type="color"
                      className="native-color-input"
                      value={primaryHex}
                      onChange={(e) => handlePrimaryChange(e.target.value)}
                      title="Pick Primary Color"
                    />
                    <input
                      type="text"
                      className="custom-hex-text-input"
                      value={primaryHex}
                      maxLength={7}
                      onChange={(e) => handlePrimaryChange(e.target.value)}
                    />
                  </div>
                </div>

                {/* Color 2: Matching Accent Partner */}
                <div className="color-picker-dual-item">
                  <span className="dual-input-label">Color 2 (Matching Accent)</span>
                  <div className="dual-input-row">
                    <input
                      type="color"
                      className="native-color-input"
                      value={secondaryHex}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                      title="Pick Matching Accent"
                    />
                    <input
                      type="text"
                      className="custom-hex-text-input"
                      value={secondaryHex}
                      maxLength={7}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Action Toolbar: Auto-Match & Apply to All */}
              <div className="dual-color-action-bar">
                <button
                  type="button"
                  className="btn-auto-match"
                  onClick={handleAutoMatchPartner}
                  title="Automatically calculate suitable matching partner color"
                >
                  <Wand2 size={12} /> Auto-Match Partner
                </button>
                <button
                  type="button"
                  className="btn-apply-dual-color"
                  onClick={handleApplyToAll}
                >
                  <Sparkles size={12} /> Apply to All (2 Colors)
                </button>
              </div>

              {/* Live Two-Color Blend Preview Bar */}
              <div
                className="dual-color-preview-bar"
                style={{
                  background: `linear-gradient(135deg, ${primaryHex} 0%, ${secondaryHex} 100%)`
                }}
              >
                <span className="preview-label">Live Matching Preview</span>
                <div className="preview-badges">
                  <span className="preview-chip primary-chip" style={{ background: primaryHex }}>
                    Primary
                  </span>
                  <span className="preview-chip accent-chip" style={{ background: secondaryHex }}>
                    Accent
                  </span>
                </div>
              </div>

              <p className="color-panel-hint">
                ✨ Only changes these <strong>two matching colors</strong> across all screens, keeping your school dashboard balanced, readable, and elegant.
              </p>
            </div>
          )}

          {/* ChatGPT Message Thread Stream */}
          <div className="skool-ai-messages-container chatgpt-thread">
            {messages.map((msg, idx) => (
              <div
                key={msg.id ? `${msg.id}-${idx}` : idx}
                className={`skool-ai-message ${msg.sender === 'user' ? 'user-message' : 'ai-message'} ${msg.action ? `action-${msg.action}` : ''}`}
              >
                <div className="skool-ai-message-row">
                  {msg.sender === 'assistant' && (
                    <div className="skool-ai-avatar">
                      <Bot size={15} />
                    </div>
                  )}

                  <div className="skool-ai-message-bubble glass-bubble">
                    <div className="skool-ai-message-content">
                      {renderFormattedText(msg.text)}
                    </div>

                    <div className="skool-ai-bubble-footer">
                      <span className="skool-ai-message-time">{msg.time}</span>
                      {msg.sender === 'assistant' && (
                        <button
                          type="button"
                          className="skool-bubble-copy"
                          title="Copy response"
                          onClick={() => handleCopyText(msg.id, msg.text)}
                        >
                          {copiedId === msg.id ? (
                            <Check size={12} className="text-success" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="skool-ai-message ai-message">
                <div className="skool-ai-message-row">
                  <div className="skool-ai-avatar">
                    <Bot size={15} />
                  </div>
                  <div className="skool-ai-message-bubble glass-bubble typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Suggestion Chips (ChatGPT style) */}
          <div className="skool-ai-quick-prompts glass-chips-bar">
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Add student Aryan Patel, class 10-A, roll 108, parent Rajesh')}
            >
              <PlusCircle size={12} className="chip-icon" /> Add Student
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Delete student Aryan Patel')}
            >
              <Trash2 size={12} className="chip-icon danger-icon" /> Delete Student
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Add staff Priya Sharma, department Science, role Teacher')}
            >
              <PlusCircle size={12} className="chip-icon" /> Add Staff
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Delete staff Priya Sharma')}
            >
              <Trash2 size={12} className="chip-icon danger-icon" /> Delete Staff
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => setShowColorPanel(prev => !prev)}
            >
              <Palette size={12} className="chip-icon" /> 2 Matching Colors
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('List students')}
            >
              <Users size={12} className="chip-icon" /> List Students
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('List staff')}
            >
              <Briefcase size={12} className="chip-icon" /> List Staff
            </button>
            <button
              type="button"
              className="skool-quick-chip"
              onClick={() => handleSendMessage('Add notice Annual Sports Day on Monday, content Bring your sports uniform')}
            >
              <Bell size={12} className="chip-icon" /> Post Notice
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            className="skool-ai-drawer-footer glass-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <div className="skool-ai-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="skool-ai-input glass-input"
                placeholder={
                  isAdmin
                    ? 'Type "Add student [Name], class [10-A]" or ask anything...'
                    : 'Ask me anything about school, exams, timetable...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="skool-ai-send-btn glass-btn"
              disabled={!inputText.trim() || loading}
              title="Send to AI Assistant"
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
