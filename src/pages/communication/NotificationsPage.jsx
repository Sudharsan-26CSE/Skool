import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { getNotices } from '../../services/api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotices();
      const list = res.notices || (Array.isArray(res) ? res : []);
      const mapped = list.map((n) => ({
        id: n._id,
        title: n.title,
        desc: n.content,
        time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent',
        type: n.priority === 'urgent' ? 'warning' : 'info'
      }));
      setNotifications(mapped);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications Center</h1>
          <p className="page-subtitle">Real-time school announcements and alerts from database</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No notifications or announcements found in database.</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="detail-card hover-lift" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
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
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
