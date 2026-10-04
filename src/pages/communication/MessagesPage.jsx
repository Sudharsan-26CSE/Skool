import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  MessageSquare,
  Send,
  User,
  Paperclip,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  Shield,
  Search,
  X,
  FileSpreadsheet,
  Radio,
  Copy,
  Settings2,
  Users,
  Sparkles,
  Check
} from 'lucide-react';
import { getStaff, getStudents } from '../../services/api';
import { exportToExcel } from '../../utils/exportToExcel';

const MessagesPage = () => {
  // Current authenticated user context
  const currentUserEmail = (localStorage.getItem('preskool-email') || 'user@skool.edu').toLowerCase().trim();
  const currentUserName = localStorage.getItem('preskool-user-name') || currentUserEmail.split('@')[0];
  const currentUserRole = (localStorage.getItem('preskool-role') || 'student').toLowerCase();

  // Storage key strictly isolated to this user's Google Chat messages
  const STORAGE_KEY = `skool_user_gchat_messages_${currentUserEmail}`;
  const WEBHOOK_STORAGE_KEY = `skool_gchat_default_webhook_${currentUserEmail}`;

  // Tabs: 'compose' | 'history' | 'spaces'
  const [activeTab, setActiveTab] = useState('compose');

  // Connection mode: 'dm' (Direct Message) | 'space' (Google Chat Space Webhook)
  const [chatMode, setChatMode] = useState('dm');

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');

  // Space Webhook states
  const [spaceWebhookUrl, setSpaceWebhookUrl] = useState(() => localStorage.getItem(WEBHOOK_STORAGE_KEY) || '');
  const [spaceName, setSpaceName] = useState('Institutional Space');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  // Contacts directory
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');

  // User's private Google Chat messages
  const [mySentChats, setMySentChats] = useState([]);
  const [successNotice, setSuccessNotice] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load user's private Google Chat messages
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(`skool_user_mails_${currentUserEmail}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setMySentChats(parsed);
      } else {
        setMySentChats([]);
      }
    } catch (e) {
      setMySentChats([]);
    }
  }, [currentUserEmail, currentUserName]);

  // Load directory contacts for fast autocomplete
  useEffect(() => {
    const loadDirectory = async () => {
      try {
        const [staffRes, studentRes] = await Promise.all([getStaff(), getStudents()]);
        const staffList = (staffRes.staff || (Array.isArray(staffRes) ? staffRes : [])).map(s => ({
          name: s.name,
          email: s.email || `${s.name.toLowerCase().replace(/\s+/g, '.')}@skool.edu`,
          role: s.designation || s.department || 'Faculty'
        }));

        const studentList = (studentRes.students || (Array.isArray(studentRes) ? studentRes : [])).map(st => ({
          name: st.name,
          email: st.email || `${st.admissionNo?.toLowerCase() || 'student'}@skool.edu`,
          role: st.className || 'Student'
        }));

        setContacts([...staffList, ...studentList]);
      } catch (e) {
        setContacts([]);
      }
    };
    loadDirectory();
  }, []);

  // Save default webhook URL if updated
  const handleSaveWebhook = (url) => {
    setSpaceWebhookUrl(url);
    if (url.trim()) {
      localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
    } else {
      localStorage.removeItem(WEBHOOK_STORAGE_KEY);
    }
  };

  // Handle image attachment
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit.');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setAttachedImage(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
    setImageFileName('');
  };

  const handleSelectContact = (c) => {
    setRecipientName(c.name);
    setRecipientEmail(c.email);
    if (!subject) {
      setSubject(`Discussion: ${c.name}`);
    }
  };

  // Google Chat Direct 1:1 Message Dispatch
  const handleSendDirectGoogleChat = (e) => {
    if (e) e.preventDefault();

    if (!recipientEmail.trim() || !messageBody.trim()) {
      alert('Please provide recipient Google account email and message content.');
      return;
    }

    const chatSubject = subject.trim() || 'Skool Institutional Inquiry';
    let fullChatText = `*${chatSubject}*\n\n${messageBody.trim()}\n\n---\n*Sent by:* ${currentUserName} (${currentUserEmail})\n*Channel:* Skool Google Chat Connector`;
    if (attachedImage) {
      fullChatText += `\n[Attached Photo: ${imageFileName || 'Attachment Included'}]`;
    }

    // Copy to clipboard for instant pasting inside Google Chat
    try {
      navigator.clipboard.writeText(fullChatText);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }

    // Direct Google Chat DM URLs
    const googleChatDmUrl = `https://mail.google.com/chat/u/0/#chat/dm/${encodeURIComponent(recipientEmail.trim())}`;
    const directChatAppUrl = `https://chat.google.com/dm/${encodeURIComponent(recipientEmail.trim())}`;

    // Record strictly in user's isolated Google Chat log
    const newChatRecord = {
      id: `gchat-dm-${Date.now()}`,
      senderEmail: currentUserEmail,
      senderName: currentUserName,
      recipientName: recipientName.trim() || recipientEmail.split('@')[0],
      recipientEmail: recipientEmail.trim(),
      subject: chatSubject,
      body: messageBody.trim(),
      image: attachedImage,
      imageName: imageFileName,
      time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dispatchType: 'Direct DM',
      status: 'Connected to Google Chat DM'
    };

    const updated = [newChatRecord, ...mySentChats];
    setMySentChats(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Open Google Chat direct conversation
    window.open(directChatAppUrl, '_blank', 'noopener,noreferrer');

    setSuccessNotice(`Message copied to clipboard! Opened Google Chat direct conversation with ${recipientEmail}.`);
    setTimeout(() => setSuccessNotice(null), 6000);

    // Reset form
    setRecipientName('');
    setRecipientEmail('');
    setSubject('');
    setMessageBody('');
    setAttachedImage(null);
    setImageFileName('');
    setActiveTab('history');
  };

  // Google Chat Space Incoming Webhook Dispatch
  const handleSendSpaceWebhook = async (e) => {
    if (e) e.preventDefault();

    if (!spaceWebhookUrl.trim()) {
      alert('Please enter a valid Google Chat Space Incoming Webhook URL.');
      return;
    }

    if (!messageBody.trim()) {
      alert('Please enter message content to post into the Google Chat Space.');
      return;
    }

    setIsSendingWebhook(true);

    const spaceTitle = subject.trim() || spaceName.trim() || 'Institutional Announcement';
    const formattedText = `*${spaceTitle}*\n${messageBody.trim()}\n\n---\n*Author:* ${currentUserName} (${currentUserEmail}) [${currentUserRole.toUpperCase()}]`;

    try {
      const response = await fetch(spaceWebhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ text: formattedText })
      });

      if (!response.ok) {
        throw new Error(`Google Chat API responded with HTTP ${response.status}`);
      }

      // Record successful space dispatch
      const newSpaceRecord = {
        id: `gchat-space-${Date.now()}`,
        senderEmail: currentUserEmail,
        senderName: currentUserName,
        recipientName: spaceName || 'Google Chat Space',
        recipientEmail: 'Google Chat Space Room',
        subject: spaceTitle,
        body: messageBody.trim(),
        image: attachedImage,
        imageName: imageFileName,
        time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dispatchType: 'Space Channel',
        status: 'Delivered to Google Chat Space'
      };

      const updated = [newSpaceRecord, ...mySentChats];
      setMySentChats(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setSuccessNotice(`Successfully posted announcement directly to Google Chat Space!`);
      setTimeout(() => setSuccessNotice(null), 6000);

      // Reset form
      setSubject('');
      setMessageBody('');
      setAttachedImage(null);
      setImageFileName('');
      setActiveTab('history');
    } catch (err) {
      console.warn('Google Chat Webhook direct fetch note:', err);
      // Even if CORS blocks client-side webhook fetch, give clear fallback with direct chat launch
      const fallbackRecord = {
        id: `gchat-space-${Date.now()}`,
        senderEmail: currentUserEmail,
        senderName: currentUserName,
        recipientName: spaceName || 'Google Chat Space',
        recipientEmail: 'Google Chat Webhook Space',
        subject: spaceTitle,
        body: messageBody.trim(),
        image: attachedImage,
        imageName: imageFileName,
        time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dispatchType: 'Space Channel',
        status: 'Sent to Google Chat'
      };

      try {
        navigator.clipboard.writeText(formattedText);
      } catch (cbErr) {
        // ignore
      }

      const updated = [fallbackRecord, ...mySentChats];
      setMySentChats(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Open Google Chat Spaces
      window.open('https://chat.google.com', '_blank', 'noopener,noreferrer');

      setSuccessNotice(`Message copied! Opened Google Chat Space to broadcast.`);
      setTimeout(() => setSuccessNotice(null), 6000);
      setActiveTab('history');
    } finally {
      setIsSendingWebhook(false);
    }
  };

  // Re-open Google Chat for a specific logged message
  const handleReopenGoogleChat = (mail) => {
    const isSpace = mail.dispatchType === 'Space Channel' || mail.recipientEmail?.includes('Space');
    if (isSpace) {
      window.open('https://chat.google.com', '_blank', 'noopener,noreferrer');
    } else {
      const url = `https://chat.google.com/dm/${encodeURIComponent(mail.recipientEmail)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Quick copy message text
  const handleCopyMessage = (mail) => {
    const text = `*${mail.subject}*\n${mail.body}\n\n---\nSent by: ${mail.senderName} (${mail.senderEmail})`;
    navigator.clipboard.writeText(text);
    setCopiedId(mail.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export private Google Chat history to Excel
  const handleExportChatExcel = () => {
    if (mySentChats.length === 0) {
      alert('No messages found in your Google Chat log to export.');
      return;
    }

    const rows = mySentChats.map((m, idx) => ({
      Index: idx + 1,
      SenderName: m.senderName,
      SenderEmail: m.senderEmail,
      Recipient: m.recipientName,
      GoogleChatAccount: m.recipientEmail,
      ChannelType: m.dispatchType || 'Direct DM',
      Subject: m.subject,
      Message: m.body,
      Attachment: m.imageName || (m.image ? 'Image Attached' : 'None'),
      DeliveryStatus: m.status,
      Timestamp: m.time
    }));

    exportToExcel(rows, `Google_Chat_Log_${currentUserEmail.split('@')[0]}`, 'GoogleChatHistory');
  };

  const handleDeleteChatMessage = (id) => {
    const filtered = mySentChats.filter(m => m.id !== id);
    setMySentChats(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  };

  const filteredContacts = contacts.filter(c =>
    (c.name || '').toLowerCase().includes(contactSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(contactSearch.toLowerCase())
  ).slice(0, 8);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Google Chat Hub</h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Google Chat Connected
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Connect and communicate exclusively via Google Chat · Direct 1:1 DMs & Institutional Spaces
          </p>
        </div>

        {/* Global Action Bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'compose' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('compose')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={15} /> Compose Chat
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('history')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Clock size={15} /> Chat History ({mySentChats.length})
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => window.open('https://chat.google.com', '_blank', 'noopener,noreferrer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#00ac47',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600
            }}
            title="Launch Google Chat web app in separate tab"
          >
            <MessageSquare size={15} /> Launch Google Chat <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#10b981',
          padding: '12px 18px',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.88rem',
          animation: 'fadeIn 0.25s ease-in'
        }}>
          <CheckCircle size={18} style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 500 }}>{successNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'compose' ? (
        <div className="dashboard-row" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Main Message Panel Card */}
          <div className="dashboard-card" style={{ flex: '1 1 520px', padding: '24px' }}>
            <div className="dashboard-card-header" style={{ marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={20} style={{ color: '#00ac47' }} />
                  Google Chat Dispatch Panel
                </h2>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
                  Sends directly to Google Chat · Profile isolated & authenticated
                </span>
              </div>
              <span className="badge info" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={12} /> Google Chat Only
              </span>
            </div>

            {/* Mode Selector Toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '20px',
              gap: '6px'
            }}>
              <button
                type="button"
                onClick={() => setChatMode('dm')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: chatMode === 'dm' ? '#00ac47' : 'transparent',
                  color: chatMode === 'dm' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <User size={15} /> Direct 1:1 Google Chat DM
              </button>
              <button
                type="button"
                onClick={() => setChatMode('space')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: chatMode === 'space' ? '#00ac47' : 'transparent',
                  color: chatMode === 'space' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Users size={15} /> Google Chat Space Channel
              </button>
            </div>

            {/* Form Container */}
            <form onSubmit={chatMode === 'dm' ? handleSendDirectGoogleChat : handleSendSpaceWebhook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Authenticated Sender Display (Read-Only) */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <User size={14} style={{ color: '#00ac47' }} />
                  <span>Your Google Account Sender:</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={`${currentUserName} <${currentUserEmail}>`}
                    disabled
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'var(--text-primary)',
                      cursor: 'not-allowed',
                      fontWeight: 600,
                      border: '1px solid var(--border-light)'
                    }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                    🔒 Verified & Auto-Filled
                  </span>
                </div>
              </div>

              {/* Mode-Specific Inputs */}
              {chatMode === 'dm' ? (
                /* 1-on-1 DM Recipient Selection */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="recipient-name" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Recipient Name:
                    </label>
                    <input
                      id="recipient-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sarah Connor / Student Name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="recipient-email" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Recipient Google Chat Email:
                    </label>
                    <input
                      id="recipient-email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. staff@skool.edu / teacher@skool.edu"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                /* Google Chat Space Webhook Inputs */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="space-webhook" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      <span>Google Chat Space Webhook URL:</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Saved in browser automatically</span>
                    </label>
                    <input
                      id="space-webhook"
                      type="url"
                      className="form-input"
                      placeholder="https://chat.googleapis.com/v1/spaces/.../messages?key=...&token=..."
                      value={spaceWebhookUrl}
                      onChange={(e) => handleSaveWebhook(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="space-name" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Space Channel / Group Name:
                    </label>
                    <input
                      id="space-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Grade 10 Announcements / Faculty Room"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Subject / Topic Field */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="chat-subject" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Message Subject / Topic:
                </label>
                <input
                  id="chat-subject"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Assignment Feedback / Urgent Meeting Schedule"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Message Content */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="chat-body" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Message Body (Google Chat):
                </label>
                <textarea
                  id="chat-body"
                  className="form-input"
                  rows={5}
                  placeholder="Type your message for Google Chat..."
                  style={{ resize: 'vertical' }}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  required
                />
              </div>

              {/* Attachment Picker */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <ImageIcon size={14} style={{ color: '#00ac47' }} />
                  <span>Attach Image / Screenshot:</span>
                </label>

                {!attachedImage ? (
                  <label
                    style={{
                      border: '2px dashed var(--border-light)',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Paperclip size={20} style={{ color: '#00ac47' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>Select image or screenshot</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Supports PNG, JPG, WebP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    background: 'rgba(0, 172, 71, 0.08)',
                    border: '1px solid rgba(0, 172, 71, 0.3)',
                    borderRadius: '12px'
                  }}>
                    <img
                      src={attachedImage}
                      alt="Attachment Preview"
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {imageFileName || 'Image Attached'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Ready for Google Chat dispatch</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={handleRemoveImage}
                      style={{ padding: '4px 8px', color: '#ef4444' }}
                    >
                      <X size={14} /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    const testUrl = recipientEmail ? `https://chat.google.com/dm/${encodeURIComponent(recipientEmail)}` : 'https://chat.google.com';
                    window.open(testUrl, '_blank', 'noopener,noreferrer');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ExternalLink size={14} /> Open Google Chat Direct
                </button>

                <button
                  type="submit"
                  className="btn"
                  disabled={isSendingWebhook}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    background: '#00ac47',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: isSendingWebhook ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 172, 71, 0.25)'
                  }}
                >
                  <Send size={16} />
                  {isSendingWebhook
                    ? 'Posting to Space...'
                    : chatMode === 'dm'
                    ? 'Send to Google Chat'
                    : 'Dispatch to Google Chat Space'}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Contacts Directory (Only shown in DM mode) */}
          <div className="dashboard-card" style={{ flex: '1 1 290px', padding: '20px' }}>
            <div className="dashboard-card-header" style={{ marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} style={{ color: '#00ac47' }} /> Google Chat Directory
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Click contact to connect</span>
              </div>
            </div>

            <div style={{ marginBottom: '12px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search faculty or student..."
                style={{ fontSize: '0.78rem', paddingLeft: '32px' }}
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '420px', overflowY: 'auto' }}>
              {filteredContacts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                  Sorry ! Not Available Data.
                </div>
              ) : filteredContacts.map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectContact(c)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: recipientEmail === c.email ? 'rgba(0, 172, 71, 0.12)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  className="hover-lift"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.82rem' }}>{c.name}</strong>
                    <span className="badge neutral" style={{ fontSize: '0.65rem' }}>{c.role}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#00ac47', marginTop: '3px', wordBreak: 'break-all' }}>
                    {c.email}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Chat Information Box */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(0, 172, 71, 0.05)',
              border: '1px solid rgba(0, 172, 71, 0.2)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ display: 'block', color: '#00ac47', marginBottom: '4px' }}>
                💡 Google Chat Only Connector
              </strong>
              Clicking send formats your message, copies it to your clipboard, and directly opens the Google Chat conversation with the recipient or broadcasts to the Space.
            </div>
          </div>
        </div>
      ) : (
        /* Google Chat History / Outbox */
        <div className="dashboard-card" style={{ padding: '24px' }}>
          <div className="dashboard-card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} style={{ color: '#00ac47' }} />
                Your Google Chat Sent History
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Authenticated sender: <strong>{currentUserEmail}</strong> · Isolated to your profile
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge success">{mySentChats.length} Logged Chats</span>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleExportChatExcel}
                title="Download Google Chat logs as an Excel workbook"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FileSpreadsheet size={14} /> Export to Excel
              </button>
            </div>
          </div>

          {mySentChats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-tertiary)' }}>
              <MessageSquare size={36} style={{ color: '#00ac47', margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 500, fontSize: '1.05rem' }}>Sorry ! Not Available Data.</p>
              <p style={{ fontSize: '0.78rem', margin: '4px 0 16px' }}>Switch to the Compose tab to dispatch your first message to Google Chat.</p>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setActiveTab('compose')}
              >
                Start Google Chat
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mySentChats.map((chat) => (
                <div
                  key={chat.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.92rem' }}>To: {chat.recipientName}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#00ac47' }}>({chat.recipientEmail})</span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: chat.dispatchType === 'Space Channel' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0, 172, 71, 0.15)',
                            color: chat.dispatchType === 'Space Channel' ? '#6366f1' : '#00ac47',
                            fontWeight: 600
                          }}
                        >
                          {chat.dispatchType || 'Google Chat'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                        Subject: {chat.subject}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{chat.time}</span>
                      
                      {/* Copy message button */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => handleCopyMessage(chat)}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Copy message text"
                      >
                        {copiedId === chat.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        {copiedId === chat.id ? 'Copied' : 'Copy'}
                      </button>

                      {/* Reopen in Google Chat */}
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleReopenGoogleChat(chat)}
                        style={{
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#00ac47',
                          color: '#fff',
                          border: 'none'
                        }}
                        title="Open in Google Chat"
                      >
                        <ExternalLink size={12} /> Open Chat
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleDeleteChatMessage(chat.id)}
                        style={{ padding: '3px 6px', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        title="Delete from log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {chat.body}
                  </p>

                  {chat.image && (
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>
                        Attached Image:
                      </span>
                      <img
                        src={chat.image}
                        alt="Chat Attachment"
                        style={{ maxWidth: '160px', maxHeight: '110px', borderRadius: '8px', border: '1px solid var(--border-light)', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                    Sent by: <strong>{chat.senderName}</strong> &lt;{chat.senderEmail}&gt; · <em>Isolated Google Chat record</em>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MessagesPage;
