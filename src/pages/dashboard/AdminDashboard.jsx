import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  GraduationCap,
  Users,
  DollarSign,
  ArrowUpRight,
  Plus,
  FileText,
  Library,
  CalendarPlus,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import {
  ParticleWaveChart,
  DotMatrixWaveChart,
  AreaWaveChart,
  SparklineChart,
  DonutRingChart,
  FlowFunnelChart,
  ProgressChannelList
} from '../../components/common/GlassCharts';
import { getDashboardStats } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalClasses: 0,
    totalRevenue: 0,
    recentStudents: [],
    recentNotices: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res && res.success) {
        setStatsData({
          totalStudents: res.totalStudents || 0,
          totalStaff: res.totalStaff || 0,
          totalClasses: res.totalClasses || 0,
          totalRevenue: res.totalRevenue || 0,
          recentStudents: res.recentStudents || [],
          recentNotices: res.recentNotices || []
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard stats from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Enrolled Students',
      value: statsData.totalStudents.toLocaleString(),
      change: 'Active in Database',
      positive: true,
      badge: 'Live DB',
      chart: <ParticleWaveChart color="#38bdf8" />
    },
    {
      title: 'Faculty & Staff Members',
      value: statsData.totalStaff.toLocaleString(),
      change: 'Verified Accounts',
      positive: true,
      chart: <DotMatrixWaveChart color="#6366f1" />
    },
    {
      title: 'Fee Revenue Collected',
      value: `₹${statsData.totalRevenue.toLocaleString()}`,
      change: 'Paid Invoices in DB',
      positive: true,
      chart: <AreaWaveChart color="#34d399" />
    },
    {
      title: 'Active Classes & Sections',
      value: statsData.totalClasses.toString(),
      change: 'Active Curriculums',
      positive: true,
      chart: <SparklineChart color="#38bdf8" />
    },
  ];

  const recentStudents = statsData.recentStudents;
  const recentNotices = statsData.recentNotices;

  return (
    <DashboardLayout>
      <div className="page-header glass-header-section">
        <div>
          <div className="badge glass-badge info" style={{ marginBottom: '6px' }}>
            <Activity size={12} style={{ marginRight: '4px' }} /> Executive Overview
          </div>
          <h1 className="page-title text-shimmer-anim">Skool Admin Panel</h1>
          <p className="page-subtitle">Admin Panel</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <button className="btn btn-secondary glass-btn" onClick={() => navigate('/reports')}>
            <TrendingUp size={16} /> Reports & Insights
          </button>
          <button className="btn btn-primary glass-btn-primary" onClick={() => navigate('/students/add')}>
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards with Rich SVG Micro-Charts */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card glass-card hover-lift" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 className="stat-title">{stat.title}</h3>
              {stat.badge && (
                <span className="live-pulse-badge">
                  <span className="live-dot" /> {stat.badge}
                </span>
              )}
            </div>

            <div className="stat-value text-glow-anim">{stat.value}</div>

            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`} style={{ marginBottom: '12px' }}>
              <ArrowUpRight size={14} />
              <span>{stat.change}</span>
            </div>

            {/* Embedded Micro-Graph */}
            <div className="stat-chart-container">
              {stat.chart}
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Revenue by Product (Donut) & User Acquisition Funnel */}
      <div className="dashboard-row" style={{ marginTop: 'var(--space-6)' }}>
        {/* Left: Revenue by Product / Academic Program */}
        <div className="dashboard-card glass-card hover-lift" style={{ flex: '1 1 440px' }}>
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Revenue by Product</h2>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="glass-select"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Academic Year</option>
            </select>
          </div>
          <DonutRingChart centerValue={`₹${statsData.totalRevenue.toLocaleString()}`} centerLabel="Total Revenue" />
        </div>

        {/* Right: User Acquisition Funnel */}
        <div className="dashboard-card glass-card hover-lift" style={{ flex: '1 1 540px' }}>
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>User Acquisition Flow</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/reports')}>
              Full Funnel <ArrowRight size={14} />
            </button>
          </div>
          <FlowFunnelChart />
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="dashboard-quick-actions" style={{ margin: 'var(--space-6) 0' }}>
        <button className="btn btn-primary glass-btn-primary" type="button" onClick={() => navigate('/notice-board')}>
          <FileText size={16} /> Post New Notice
        </button>
        <button className="btn btn-secondary glass-btn" type="button" onClick={() => navigate('/library')}>
          <Library size={16} /> Add Book to Catalog
        </button>
        <button className="btn btn-secondary glass-btn" type="button" onClick={() => navigate('/calendar')}>
          <CalendarPlus size={16} /> Add Calendar Event
        </button>
      </div>

      {/* Bottom Row: Top Acquisition Channels & Recent Account Activity */}
      <div className="dashboard-row">
        {/* Top Acquisition Channels */}
        <div className="dashboard-card glass-card hover-lift" style={{ flex: '1 1 480px' }}>
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2>Top Acquisition Channels</h2>
            <span className="badge neutral" style={{ fontSize: '0.75rem' }}>This Month</span>
          </div>
          <ProgressChannelList />
        </div>

        {/* Recent School Notices / Announcements */}
        <div className="dashboard-card glass-card hover-lift" style={{ flex: '1 1 480px' }}>
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Recent Circulars & Notices</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notice-board')}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentNotices.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>No notices published yet.</p>
            ) : recentNotices.map((notice, i) => (
              <div key={notice._id || i} className="activity-glass-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: 'rgba(150, 160, 180, 0.08)' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{notice.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: '2px 0 0 0' }}>
                    <span className="badge info" style={{ marginRight: '6px', fontSize: '0.7rem' }}>{notice.category || 'Notice'}</span>
                    {notice.content ? notice.content.substring(0, 55) + '...' : ''}
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                  {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Students Table in Frosted Glass */}
      <div className="data-table-container glass-card hover-lift" style={{ marginTop: 'var(--space-6)' }}>
        <div className="data-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Recently Enrolled Students</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/students')}>View All Students</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Guardian / Parent</th>
              <th>Contact Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>
                  No students found in database. Click Add Student to enroll.
                </td>
              </tr>
            ) : recentStudents.map((student) => {
              const studentName = student.name || student.user?.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
              const studentId = student._id || student.id;
              return (
                <tr key={studentId} onClick={() => navigate(`/students/${studentId}`)} style={{ cursor: 'pointer' }}>
                  <td><strong>{student.admissionNo || 'STU'}</strong></td>
                  <td>
                    <div className="table-user">
                      <div className="table-avatar">{studentName.charAt(0)}</div>
                      <div className="table-user-info">
                        <span className="table-user-name">{studentName}</span>
                      </div>
                    </div>
                  </td>
                  <td>{student.className || student.class?.name || 'Class 10-A'}</td>
                  <td>{student.parentName || 'Parent'}</td>
                  <td>{student.parentPhone || student.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${student.isActive !== false ? 'success' : 'warning'}`} style={{ borderRadius: '10px' }}>
                      {student.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
