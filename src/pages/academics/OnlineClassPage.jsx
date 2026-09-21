import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Video, Plus, Clock, Users, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getOnlineClasses, deleteOnlineClass } from '../../services/api';

const OnlineClassPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [virtualClasses, setVirtualClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isStudent = role === 'student';
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchOnlineClasses();
  }, []);

  const fetchOnlineClasses = async () => {
    try {
      setLoading(true);
      const data = await getOnlineClasses();
      setVirtualClasses(data.onlineClasses || []);
    } catch (err) {
      showToast('Failed to load virtual classes. Using offline mode.', 'warning');
      setVirtualClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this class?')) return;
    try {
      await deleteOnlineClass(id);
      showToast('Virtual class deleted successfully', 'success');
      fetchOnlineClasses();
    } catch (err) {
      showToast(err.message || 'Failed to delete virtual class', 'error');
    }
  };



  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Virtual Classrooms</h1>
          <p className="page-subtitle">{isStudent ? 'Join live online video lectures and study sessions' : 'Schedule and join live online video lectures'}</p>
        </div>
        {!isStudent && isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/online-classes/add')}>
            <Plus size={16} /> Schedule Live Session
          </button>
        )}
      </div>

      <div className="detail-grid teacher-card-grid">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>Loading classes...</div>
        ) : virtualClasses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>No virtual classes scheduled</div>
        ) : (
          virtualClasses.map((vc) => {
            const isLive = vc.status === 'live' || vc.status === 'Live Now';
            return (
              <div key={vc._id} className="detail-card teacher-grid-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span className={`badge ${isLive ? 'error' : 'info'}`} style={{ textTransform: 'capitalize' }}>
                    <Video size={12} style={{ marginRight: '4px' }} />
                    {isLive ? 'Live Now' : vc.status}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{vc.startTime} - {vc.endTime}</span>
                </div>
                <h3 style={{ border: 'none', padding: 0, margin: 'var(--space-2) 0' }}>{vc.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
                  Instructor: {vc.teacher?.name || 'Unknown'} • {vc.class?.name || vc.class || 'Unknown Class'}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className={`btn ${isLive ? 'btn-danger' : 'btn-primary'}`} style={{ flex: 1 }} onClick={() => vc.meetingLink && window.open(vc.meetingLink, '_blank')}>
                    {isLive ? 'Join Live Meeting' : 'View Link & Details'}
                  </button>
                  {isAdmin && (
                    <button className="btn btn-secondary" style={{ padding: '8px' }} onClick={() => handleDelete(vc._id)} title="Delete Session">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default OnlineClassPage;
