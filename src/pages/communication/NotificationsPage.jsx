import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationsPage = () => {
  const notifications = [
    { title: 'New Leave Request Received', desc: 'Mr. Alan Turing submitted a leave request for May 14-16.', time: '10 mins ago', type: 'info' },
    { title: 'Fee Payment Received', desc: 'Janet Adebayo paid $4,500.00 tuition fee invoice.', time: '1 hour ago', type: 'success' },
    { title: 'Low Inventory Alert', desc: 'Whiteboard marker stock below threshold (5 remaining).', time: '3 hours ago', type: 'warning' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications Center</h1>
          <p className="page-subtitle">Real-time system updates and alerts</p>
        </div>
        <button className="btn btn-secondary">Mark All as Read</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {notifications.map((n, idx) => (
          <div key={idx} className="detail-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div className={`stat-icon ${n.type === 'success' ? 'green' : n.type === 'warning' ? 'orange' : 'blue'}`} style={{ width: '40px', height: '40px' }}>
              <Bell size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{n.title}</h4>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
