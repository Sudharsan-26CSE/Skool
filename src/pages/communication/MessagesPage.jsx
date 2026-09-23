import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { MessageSquare, Send, User } from 'lucide-react';
import { getStaff } from '../../services/api';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getStaff();
      const list = res.staff || (Array.isArray(res) ? res : []);
      const mapped = list.map((st, i) => ({
        id: st._id,
        sender: st.name,
        role: st.designation || st.department || st.role || 'Faculty',
        lastMsg: i === 0 ? 'Connected on Skool internal communication.' : 'Available for queries.',
        time: 'Active',
        unread: i === 0
      }));
      setConversations(mapped);
      if (mapped.length > 0) {
        setSelectedChat(mapped[0]);
        setMessages([
          { sender: mapped[0].sender, text: `Hello! You can reach out to ${mapped[0].sender} regarding institutional updates and inquiries.`, time: 'Now' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load contacts for messaging:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([
      { sender: chat.sender, text: `Active chat line with ${chat.sender} (${chat.role}).`, time: 'Now' }
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedChat) return;
    const newMsg = {
      sender: 'You',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Messages & Communication</h1>
          <p className="page-subtitle">Direct communications with registered faculty and administration</p>
        </div>
      </div>

      <div className="dashboard-row messages-layout">
        <div className="dashboard-card" style={{ maxWidth: '340px' }}>
          <div className="dashboard-card-header">
            <h2>Faculty Directory</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {loading ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>Loading contacts...</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No faculty contacts found in database.</div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectChat(c)}
                  style={{
                    padding: 'var(--space-3)',
                    background: selectedChat?.id === c.id ? 'var(--primary-50)' : 'var(--surface)',
                    border: selectedChat?.id === c.id ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{c.sender}</strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', marginTop: '2px' }}>{c.role}</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>{c.lastMsg}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '440px' }}>
          {selectedChat ? (
            <>
              <div>
                <div className="dashboard-card-header" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <h2>{selectedChat.sender}</h2>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{selectedChat.role}</span>
                  </div>
                  <span className="badge success">Registered</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: '1rem' }}>
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: m.sender === 'You' ? 'var(--primary-100)' : 'var(--surface)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-lg)',
                        alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%'
                      }}
                    >
                      <strong style={{ fontSize: 'var(--text-xs)', color: m.sender === 'You' ? 'var(--primary-dark)' : 'var(--text-secondary)' }}>
                        {m.sender}
                      </strong>
                      <p style={{ fontSize: 'var(--text-sm)', marginTop: '2px' }}>{m.text}</p>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginTop: '4px', textAlign: 'right' }}>
                        {m.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSend} style={{ display: 'flex', gap: 'var(--space-2)', marginTop: '1rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Send message to ${selectedChat.sender}...`}
                  style={{ flex: 1 }}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                />
                <button type="submit" className="btn btn-primary"><Send size={16} /></button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
              Select a contact to begin messaging.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
