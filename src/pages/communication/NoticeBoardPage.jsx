import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Plus, Calendar, Tag, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getNotices, deleteNotice } from '../../services/api';

const NoticeBoardPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await getNotices();
      setNotices(data.notices || []);
    } catch (err) {
      showToast('Failed to load notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await deleteNotice(id);
      showToast('Notice deleted successfully', 'success');
      fetchNotices();
    } catch (err) {
      showToast(err.message || 'Failed to delete notice', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notice Board</h1>
          <p className="page-subtitle">School circulars, announcements, and news</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" type="button" onClick={() => navigate('/notice-board/add')}>
            <Plus size={16} /> Post New Notice
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading notices...</div>
      ) : notices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          No notices found.
        </div>
      ) : (
        <div className="notice-list teacher-card-grid">
          {notices.map((n) => (
            <div key={n._id} className="detail-card teacher-grid-card" style={{ position: 'relative' }}>
              {isAdmin && (
                <button 
                  className="icon-btn danger" 
                  style={{ position: 'absolute', top: '16px', right: '16px' }}
                  onClick={() => handleDelete(n._id)}
                  title="Delete notice"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="notice-card-header">
                <span className="badge info">{n.category}</span>
                <span className="notice-date">
                  <Calendar size={12} />
                  {new Date(n.validFrom).toLocaleDateString()}
                  {n.validUntil ? ` - ${new Date(n.validUntil).toLocaleDateString()}` : ''}
                </span>
              </div>
              <h3 className="notice-title" style={{ paddingRight: isAdmin ? '32px' : '0' }}>{n.title}</h3>
              <p className="notice-content">{n.content}</p>
              <p className="notice-author">Issued by: <strong>{n.postedBy?.name || 'Admin'}</strong></p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NoticeBoardPage;
