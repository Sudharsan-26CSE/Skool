import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { MessageSquare, Send, User } from 'lucide-react';

const MessagesPage = () => {
  const conversations = [
    { sender: 'Dr. Sarah Connor', role: 'Teacher', lastMsg: 'Please review the math syllabus update', time: '10:45 AM', unread: true },
    { sender: 'Michael Adebayo', role: 'Parent', lastMsg: 'Thank you for the update on Janet', time: 'Yesterday', unread: false },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Messages & Chat</h1>
          <p className="page-subtitle">Direct communication between teachers, parents, and staff</p>
        </div>
      </div>

      <div className="dashboard-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Inbox</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {conversations.map((c, idx) => (
              <div key={idx} style={{ padding: 'var(--space-3)', background: c.unread ? 'var(--primary-50)' : 'var(--gray-50)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 'var(--text-sm)' }}>{c.sender}</strong>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{c.time}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{c.lastMsg}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '400px' }}>
          <div>
            <div className="dashboard-card-header">
              <h2>Dr. Sarah Connor</h2>
              <span className="badge success">Online</span>
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)' }}>
              <p style={{ fontSize: 'var(--text-sm)' }}>Please review the math syllabus update for Grade 10-A before tomorrow's faculty meeting.</p>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>10:45 AM</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input type="text" className="form-input" placeholder="Type your message here..." style={{ flex: 1 }} />
            <button className="btn btn-primary"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
