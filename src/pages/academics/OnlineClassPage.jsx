import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Video, 
  Plus, 
  Clock, 
  Users, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  BookOpen, 
  Radio,
  Layers,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getOnlineClasses, deleteOnlineClass } from '../../services/api';
import CreateOnlineClassModal from '../../components/academics/CreateOnlineClassModal';
import '../../components/academics/CreateOnlineClassModal.css';

const OnlineClassPage = () => {
  const { showToast } = useToast();
  const [virtualClasses, setVirtualClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'live', 'scheduled'
  const [copiedId, setCopiedId] = useState(null);

  const role = (localStorage.getItem('preskool-role') || 'staff').toLowerCase();
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff' || role === 'teacher';
  const isStudent = role === 'student';
  // Guaranteed visible in classroom panel for staff, teachers, and admins
  const canAddClass = true;

  useEffect(() => {
    fetchOnlineClasses();
  }, []);

  const fetchOnlineClasses = async () => {
    try {
      setLoading(true);
      const data = await getOnlineClasses();
      const list = data?.onlineClasses || data?.onlineclasses || data?.items || (Array.isArray(data) ? data : []);
      setVirtualClasses(list);
    } catch (err) {
      console.warn('Virtual classes load error, using empty state:', err);
      setVirtualClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this Google Meet class session?')) return;
    try {
      await deleteOnlineClass(id);
      showToast('Classroom session deleted successfully', 'success');
      fetchOnlineClasses();
    } catch (err) {
      showToast(err.message || 'Failed to delete classroom session', 'error');
    }
  };

  const handleCopyLink = (vc) => {
    const link = vc.meetingLink || vc.meetingUrl;
    if (!link) {
      showToast('No meeting link available for this session', 'warning');
      return;
    }
    navigator.clipboard.writeText(link);
    setCopiedId(vc._id || vc.id);
    showToast('Google Meet link copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleJoinMeet = (vc) => {
    const link = vc.meetingLink || vc.meetingUrl;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      showToast('Google Meet link is generating or unavailable', 'warning');
    }
  };

  // Filter and search computation
  const filteredClasses = useMemo(() => {
    return virtualClasses.filter((vc) => {
      // In Admin mode, respect the live/scheduled filters if chosen
      if (isAdmin) {
        const isLive = vc.status?.toLowerCase() === 'live' || vc.status === 'Live Now';
        if (activeFilter === 'live' && !isLive) return false;
        if (activeFilter === 'scheduled' && isLive) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (vc.title || vc.topic || '').toLowerCase();
      const instructor = (vc.teacher?.name || vc.teacherName || '').toLowerCase();
      const className = (vc.class?.name || vc.className || '').toLowerCase();
      const subject = (vc.subject?.name || vc.subjectName || '').toLowerCase();

      return title.includes(q) || instructor.includes(q) || className.includes(q) || subject.includes(q);
    });
  }, [virtualClasses, activeFilter, searchQuery, isAdmin]);

  // Statistics counts
  const totalCount = virtualClasses.length;
  const liveCount = virtualClasses.filter(c => (c.status?.toLowerCase() === 'live' || c.status === 'Live Now')).length;
  const scheduledCount = totalCount - liveCount;

  return (
    <DashboardLayout>
      {/* ── Page Header ── */}
      <div className="online-panel-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Online Classroom Panel</h1>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            {isAdmin 
              ? 'Oversee scheduled Google Meet video lectures and classroom sessions' 
              : isStaff
                ? 'Your assigned Google Meet lecture schedule and live classroom sessions'
                : 'Join your upcoming Google Meet classes and lectures'}
          </p>
        </div>
      </div>

      {/* ── Admin-Only Realtime Stats Ribbon ── */}
      {isAdmin && (
        <div className="online-stats-ribbon">
          <div className="stat-glass-card">
            <div className="stat-icon-blob">
              <Video size={22} />
            </div>
            <div>
              <div className="stat-info-title">Total Sessions</div>
              <div className="stat-info-val">{totalCount}</div>
            </div>
          </div>

          <div className="stat-glass-card">
            <div className="stat-icon-blob">
              <Radio size={22} />
            </div>
            <div>
              <div className="stat-info-title">Live Now</div>
              <div className="stat-info-val">{liveCount}</div>
            </div>
          </div>

          <div className="stat-glass-card">
            <div className="stat-icon-blob">
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-info-title">Scheduled</div>
              <div className="stat-info-val">{scheduledCount}</div>
            </div>
          </div>

          <div className="stat-glass-card">
            <div className="stat-icon-blob">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="stat-info-title">Platform</div>
              <div className="stat-info-val" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap' }}>Google Meet</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Search & Filter Controls ── */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px', 
        marginBottom: '20px' 
      }}>
        {/* Filter Pills - Only show live & scheduled tabs for Admin */}
        {isAdmin ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              className={`duration-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Classes ({totalCount})
            </button>
            <button 
              type="button"
              className={`duration-pill ${activeFilter === 'live' ? 'active' : ''}`}
              onClick={() => setActiveFilter('live')}
            >
              🔴 Live Now ({liveCount})
            </button>
            <button 
              type="button"
              className={`duration-pill ${activeFilter === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveFilter('scheduled')}
            >
              🗓️ Scheduled ({scheduledCount})
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Scheduled Classes ({filteredClasses.length})
          </div>
        )}

        {/* Search input */}
        <div className="glass-input-wrapper" style={{ width: isAdmin ? '280px' : '320px' }}>
          <Search size={16} className="field-icon" />
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Search topic, teacher, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Virtual Classrooms Grid ── */}
      <div className="detail-grid teacher-card-grid">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1 / -1', color: 'var(--text-tertiary)' }}>
            <span className="glass-spinner" style={{ display: 'inline-block', width: '28px', height: '28px', borderWidth: '3px', borderColor: 'var(--primary, #0284c7)', borderTopColor: 'transparent', marginBottom: '12px' }} />
            <p>Loading virtual classrooms...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          /* Default state: Shows 'No classes There' */
          <div className="virtual-class-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <div className="google-meet-badge-icon" style={{ margin: '0 auto 16px auto', width: '56px', height: '56px' }}>
              <Video size={26} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No classes There
            </h3>
            <p style={{ margin: '0 auto', maxWidth: '440px', color: 'var(--text-tertiary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              {searchQuery 
                ? 'No online lectures match your current search query.' 
                : canAddClass
                  ? 'There are currently no online classes scheduled. Click the + icon in the bottom-right corner to schedule a new class.'
                  : 'There are currently no online classes scheduled.'}
            </p>
          </div>
        ) : (
          filteredClasses.map((vc) => {
            const isLive = vc.status?.toLowerCase() === 'live' || vc.status === 'Live Now';
            const topic = vc.title || vc.topic || 'Untitled Session';
            const teacherName = vc.teacher?.name || vc.teacherName || (typeof vc.teacher === 'string' ? vc.teacher : 'Assigned Instructor');
            const targetClass = vc.class?.name ? `${vc.class.name} ${vc.class.section || ''}`.trim() : (vc.className || vc.class || 'All Students');
            const subject = vc.subject?.name || vc.subjectName || (typeof vc.subject === 'string' ? vc.subject : 'General');
            const dateStr = vc.scheduledDate || vc.date || 'Today';
            const timeStr = vc.startTime || vc.time || '10:00 AM';
            const durationStr = vc.duration || '60 mins';
            const meetUrl = vc.meetingLink || vc.meetingUrl || '';
            const isCopied = copiedId === (vc._id || vc.id);

            return (
              <div key={vc._id || vc.id} className="virtual-class-card">
                {/* Top status bar */}
                <div>
                  <div className="card-top-bar">
                    {/* Live status badge is only shown in Admin panel */}
                    {isAdmin ? (
                      <span className={`status-badge-pill ${isLive ? 'live' : 'scheduled'}`}>
                        {isLive && <span className="pulse-dot" />}
                        {isLive ? 'Live Now' : (vc.status || 'Scheduled')}
                      </span>
                    ) : (
                      <span className="status-badge-pill scheduled">
                        <Clock size={12} /> {timeStr}
                      </span>
                    )}

                    <span className="meet-platform-pill">
                      <Video size={12} /> Google Meet
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <h3 className="vc-topic-title">{topic}</h3>
                  
                  {/* Meta items */}
                  <div className="vc-meta-row">
                    <span className="vc-meta-item">
                      <BookOpen size={14} /> {subject}
                    </span>
                    <span>•</span>
                    <span className="vc-meta-item">
                      <Layers size={14} /> {targetClass}
                    </span>
                  </div>

                  <div className="vc-meta-row" style={{ marginBottom: '14px' }}>
                    <span className="vc-meta-item">
                      <Users size={14} /> {teacherName}
                    </span>
                    <span>•</span>
                    <span className="vc-meta-item">
                      <Calendar size={14} /> {dateStr}
                    </span>
                    <span>•</span>
                    <span className="vc-meta-item">
                      <Clock size={14} /> {timeStr} ({durationStr})
                    </span>
                  </div>

                  {/* Meet Link Display Box */}
                  {meetUrl && (
                    <div className="vc-meet-link-box">
                      <span className="meet-link-text" title={meetUrl}>
                        {meetUrl}
                      </span>
                      <button 
                        type="button" 
                        className="copy-link-btn" 
                        onClick={() => handleCopyLink(vc)}
                        title="Copy Google Meet Link"
                      >
                        {isCopied ? <Check size={15} color="var(--primary, #0284c7)" /> : <Copy size={15} />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="vc-actions">
                  <button 
                    type="button"
                    className="join-meet-btn"
                    onClick={() => handleJoinMeet(vc)}
                  >
                    <Video size={17} />
                    <span>Join Google Meet</span>
                    <ExternalLink size={14} style={{ opacity: 0.8 }} />
                  </button>

                  {isAdmin && (
                    <button 
                      type="button" 
                      className="glass-btn glass-btn-secondary" 
                      style={{ padding: '10px' }} 
                      onClick={() => handleDelete(vc._id || vc.id)} 
                      title="Cancel and Delete Session"
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Floating '+' Button (Positioned at Screen Right-Side Bottom Corner, Directly Above AI Assistant Button) ── */}
      {canAddClass && (
        <div className="classroom-add-fab-container">
          <button
            type="button"
            className="classroom-add-fab"
            onClick={() => setIsModalOpen(true)}
            aria-label="Add Online Class (Google Meet)"
            title="Add Online Class (Google Meet)"
          >
            <span className="classroom-add-fab-tooltip">Schedule Class (+)</span>
            <div className="classroom-add-fab-pulse" />
            <Plus size={28} strokeWidth={2.6} />
          </button>
        </div>
      )}

      {/* ── Glass Theme Create Online Class Popup Modal ── */}
      <CreateOnlineClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onClassCreated={() => {
          fetchOnlineClasses();
        }} 
      />
    </DashboardLayout>
  );
};

export default OnlineClassPage;
