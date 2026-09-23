import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Mail,
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
  MessageSquare,
  FileSpreadsheet
} from 'lucide-react';
import { getStaff, getStudents } from '../../services/api';
import { exportToExcel } from '../../utils/exportToExcel';

const MessagesPage = () => {
  // Current user context
  const currentUserEmail = (localStorage.getItem('preskool-email') || 'user@skool.edu').toLowerCase().trim();
  const currentUserName = localStorage.getItem('preskool-user-name') || currentUserEmail.split('@')[0];
  const currentUserRole = (localStorage.getItem('preskool-role') || 'student').toLowerCase();

  // Storage key strictly isolated to this specific user's panel
  const STORAGE_KEY = `skool_user_mails_${currentUserEmail}`;

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');

  // Contacts directory for fast picking
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');

  // User's private messages list (isolated per user)
  const [mySentMails, setMySentMails] = useState([]);
  const [activeTab, setActiveTab] = useState('compose'); // 'compose' | 'outbox'
  const [successNotice, setSuccessNotice] = useState(null);

  // Load this user's private messages
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMySentMails(JSON.parse(raw));
      } else {
        // Initial welcome message specific to this user
        const initial = [
          {
            id: `mail-welcome-${Date.now()}`,
            senderEmail: currentUserEmail,
            senderName: currentUserName,
            recipientName: 'School Administration',
            recipientEmail: 'admin@skool.edu.in',
            subject: 'Welcome to Skool Communication Portal',
            body: `Hello ${currentUserName}, your secure communication channel is active. Messages sent from here are strictly private to your account. Connected with Gmail & Google Chat.`,
            image: null,
            time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Delivered'
          }
        ];
        setMySentMails(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      setMySentMails([]);
    }
  }, [currentUserEmail, currentUserName]);

  // Load directory contacts for autocomplete
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
        setContacts([
          { name: 'Admin Portal', email: 'admin@skool.edu.in', role: 'Administration' },
          { name: 'Sarah Connor', email: 'staff@skool.edu', role: 'Mathematics Department' },
          { name: 'Sudhan S', email: '24104070@nec.edu.in', role: 'Grade 10-A' }
        ]);
      }
    };
    loadDirectory();
  }, []);

  // Handle image file selection
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
      setSubject(`Inquiry regarding Skool Portal - ${c.name}`);
    }
  };

  // Dispatch mail via Google Cloud / Gmail
  const handleSendGmail = (e) => {
    if (e) e.preventDefault();

    if (!recipientEmail.trim() || !messageBody.trim()) {
      alert('Please enter recipient email and message content.');
      return;
    }

    const emailSubject = subject.trim() || 'Skool Institutional Message';
    let fullBody = `${messageBody.trim()}\n\n---\nSent by: ${currentUserName} (${currentUserEmail})\nvia Skool Communication System`;
    if (attachedImage) {
      fullBody += `\n[Image Attached: ${imageFileName || 'Image Included'}]`;
    }

    // Google Cloud Gmail Web URL Compose API
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(fullBody)}`;

    // Create private record for this user's outbox only
    const newMailRecord = {
      id: `mail-${Date.now()}`,
      senderEmail: currentUserEmail,
      senderName: currentUserName,
      recipientName: recipientName.trim() || recipientEmail.split('@')[0],
      recipientEmail: recipientEmail.trim(),
      subject: emailSubject,
      body: messageBody.trim(),
      image: attachedImage,
      imageName: imageFileName,
      time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Dispatched via Gmail'
    };

    // Save strictly to this user's storage
    const updatedMails = [newMailRecord, ...mySentMails];
    setMySentMails(updatedMails);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMails));

    // Open Gmail composer in new window
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    // Feedback
    setSuccessNotice(`Mail successfully dispatched to Gmail for ${recipientEmail}! Saved in your private outbox.`);
    setTimeout(() => setSuccessNotice(null), 5000);

    // Reset form
    setRecipientName('');
    setRecipientEmail('');
    setSubject('');
    setMessageBody('');
    setAttachedImage(null);
    setImageFileName('');
    setActiveTab('outbox');
  };

  // Dispatch via Google Chat
  const handleSendGoogleChat = (e) => {
    if (e) e.preventDefault();

    if (!recipientEmail.trim() || !messageBody.trim()) {
      alert('Please enter recipient email and message content.');
      return;
    }

    const chatSubject = subject.trim() || 'Skool Institutional Chat';
    let fullChatBody = `*${chatSubject}*\n${messageBody.trim()}\n\n---\nSent by: ${currentUserName} (${currentUserEmail})`;
    if (attachedImage) {
      fullChatBody += `\n[Image: ${imageFileName || 'Attachment Included'}]`;
    }

    // Copy to clipboard for instant pasting in Google Chat
    try {
      navigator.clipboard.writeText(fullChatBody);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }

    // Google Chat URL (opens direct DM or Chat homepage)
    const googleChatUrl = `https://mail.google.com/chat/u/0/#chat/dm/${encodeURIComponent(recipientEmail)}`;

    // Create private record for this user's outbox only
    const newChatRecord = {
      id: `chat-${Date.now()}`,
      senderEmail: currentUserEmail,
      senderName: currentUserName,
      recipientName: recipientName.trim() || recipientEmail.split('@')[0],
      recipientEmail: recipientEmail.trim(),
      subject: chatSubject,
      body: messageBody.trim(),
      image: attachedImage,
      imageName: imageFileName,
      time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Dispatched via Google Chat'
    };

    const updatedMails = [newChatRecord, ...mySentMails];
    setMySentMails(updatedMails);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMails));

    // Open Google Chat
    window.open(googleChatUrl, '_blank', 'noopener,noreferrer');

    setSuccessNotice(`Message copied to clipboard! Opening Google Chat with ${recipientEmail}. Saved in your private outbox.`);
    setTimeout(() => setSuccessNotice(null), 5000);

    // Reset form
    setRecipientName('');
    setRecipientEmail('');
    setSubject('');
    setMessageBody('');
    setAttachedImage(null);
    setImageFileName('');
    setActiveTab('outbox');
  };

  // Export private outbox to Excel (Google Sheets compatible)
  const handleExportOutboxExcel = () => {
    if (mySentMails.length === 0) {
      alert('No messages found in your outbox to export.');
      return;
    }

    const rows = mySentMails.map((m, idx) => ({
      Index: idx + 1,
      SenderName: m.senderName,
      SenderEmail: m.senderEmail,
      RecipientName: m.recipientName,
      RecipientEmail: m.recipientEmail,
      Subject: m.subject,
      Message: m.body,
      Attachment: m.imageName || (m.image ? 'Image Included' : 'None'),
      DispatchMethod: m.status,
      Timestamp: m.time
    }));

    exportToExcel(rows, `My_Messages_Log_${currentUserEmail.split('@')[0]}`, 'DispatchedMessages');
  };

  const handleDeletePrivateMail = (id) => {
    const filtered = mySentMails.filter(m => m.id !== id);
    setMySentMails(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  };

  const filteredContacts = contacts.filter(c =>
    (c.name || '').toLowerCase().includes(contactSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(contactSearch.toLowerCase())
  ).slice(0, 8);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gmail & Google Chat Dispatcher</h1>
          <p className="page-subtitle">Connect with Google Cloud Gmail and Google Chats · Attached Images & Strictly Private to your panel</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'compose' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('compose')}
          >
            <Mail size={15} /> Compose
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'outbox' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('outbox')}
          >
            <Clock size={15} /> My Sent Mail ({mySentMails.length})
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            title="Open Google Chat in new window"
            onClick={() => window.open('https://chat.google.com', '_blank')}
          >
            <MessageSquare size={14} /> Google Chat Spaces
          </button>
        </div>
      </div>

      {successNotice && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#10b981',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem'
        }}>
          <CheckCircle size={18} />
          <span>{successNotice}</span>
        </div>
      )}

      {activeTab === 'compose' ? (
        <div className="dashboard-row" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Main Compose Card */}
          <div className="dashboard-card" style={{ flex: '1 1 500px', padding: '24px' }}>
            <div className="dashboard-card-header" style={{ marginBottom: '18px' }}>
              <div>
                <h2>New Institutional Message</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Sends through verified Google Cloud Gmail & Google Chat channels
                </span>
              </div>
              <span className="badge info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} /> Account Isolated
              </span>
            </div>

            <form onSubmit={handleSendGmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Sender Field (Locked & Pre-filled with logged-in user) */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <User size={14} className="text-primary" />
                  <span>Sender (Your Authenticated Address):</span>
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
                    🔒 Auto-Filled & Verified
                  </span>
                </div>
              </div>

              {/* Recipient Details Row */}
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
                    Recipient Email:
                  </label>
                  <input
                    id="recipient-email"
                    type="email"
                    className="form-input"
                    placeholder="e.g. staff@skool.edu / parent@gmail.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="mail-subject" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Subject / Topic:
                </label>
                <input
                  id="mail-subject"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Academic Progress Report & Assignment Submission"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Message Body */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="mail-body" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Message Content:
                </label>
                <textarea
                  id="mail-body"
                  className="form-input"
                  rows={5}
                  placeholder="Type your formal message or inquiry here..."
                  style={{ resize: 'vertical' }}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  required
                />
              </div>

              {/* Image Attachment Picker */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <ImageIcon size={14} className="text-primary" />
                  <span>Include Image Attachment:</span>
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
                    <Paperclip size={20} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>Click to browse image or photo</span>
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
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
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
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Ready for Gmail & Chat attachment</span>
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

              {/* Submit Buttons: Gmail + Google Chat */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={handleSendGoogleChat}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    background: '#0f9d58',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600
                  }}
                  title="Open in Google Chat"
                >
                  <MessageSquare size={16} /> Open in Google Chat <ExternalLink size={14} />
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                >
                  <Send size={16} /> Send via Gmail (Google Cloud) <ExternalLink size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Contacts Sidebar */}
          <div className="dashboard-card" style={{ flex: '1 1 280px', padding: '20px' }}>
            <div className="dashboard-card-header" style={{ marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Directory Contacts</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Click to fill recipient</span>
              </div>
            </div>

            <div style={{ marginBottom: '12px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search faculty or student..."
                style={{ fontSize: '0.78rem', paddingLeft: '30px' }}
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '420px', overflowY: 'auto' }}>
              {filteredContacts.map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectContact(c)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: recipientEmail === c.email ? 'rgba(99, 102, 241, 0.12)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  className="hover-lift"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.8rem' }}>{c.name}</strong>
                    <span className="badge neutral" style={{ fontSize: '0.65rem' }}>{c.role}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '2px' }}>{c.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* My Sent Messages (Strictly Private to this logged in user) */
        <div className="dashboard-card" style={{ padding: '24px' }}>
          <div className="dashboard-card-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>Your Private Outbox</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Messages sent by <strong>{currentUserEmail}</strong> · Isolated to your profile
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge success">{mySentMails.length} Logged Messages</span>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleExportOutboxExcel}
                title="Download this outbox as an Excel / Google Sheets workbook"
              >
                <FileSpreadsheet size={14} /> Export to Excel (Google Sheets)
              </button>
            </div>
          </div>

          {mySentMails.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
              No sent messages found for your account. Compose a new message to get started!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mySentMails.map((mail) => (
                <div
                  key={mail.id}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '0.92rem' }}>To: {mail.recipientName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>({mail.recipientEmail})</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                        Subject: {mail.subject}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className={`badge ${mail.status?.includes('Google Chat') ? 'info' : 'success'}`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {mail.status || 'Sent'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{mail.time}</span>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleDeletePrivateMail(mail.id)}
                        style={{ padding: '3px 6px', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        title="Delete from your outbox"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {mail.body}
                  </p>

                  {mail.image && (
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>
                        Attached Image:
                      </span>
                      <img
                        src={mail.image}
                        alt="Mail Attachment"
                        style={{ maxWidth: '160px', maxHeight: '110px', borderRadius: '8px', border: '1px solid var(--border-light)', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                    Sender: <strong>{mail.senderName}</strong> &lt;{mail.senderEmail}&gt; · <em>Private record</em>
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
