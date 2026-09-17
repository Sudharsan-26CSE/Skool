import React, { useState } from 'react';
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This Month');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$248,420',
      change: '+18.6% vs Apr 1- Apr 30',
      positive: true,
      badge: 'Live',
      chart: <ParticleWaveChart color="#38bdf8" />
    },
    {
      title: 'Active Accounts',
      value: '3,816',
      change: '+8.4% vs Apr 1- Apr 30',
      positive: true,
      chart: <DotMatrixWaveChart color="#6366f1" />
    },
    {
      title: 'Monthly Recurring (MRR)',
      value: '$192,540',
      change: '+14.2% vs Apr 1- Apr 30',
      positive: true,
      chart: <AreaWaveChart color="#34d399" />
    },
    {
      title: 'Attendance & Conversion',
      value: '98.74%',
      change: '+0.6% vs Apr 1- Apr 30',
      positive: true,
      chart: <SparklineChart color="#38bdf8" />
    },
  ];

  const recentStudents = [
    { id: 'STU-1001', name: 'Janet Adebayo', class: 'Grade 10-A', parent: 'Michael Adebayo', phone: '+1 234 567 890', plan: 'Pro Plan', status: 'Active' },
    { id: 'STU-1002', name: 'Marcus Chen', class: 'Grade 9-B', parent: 'David Chen', phone: '+1 234 567 891', plan: 'Business', status: 'Active' },
    { id: 'STU-1003', name: 'Sophia Smith', class: 'Grade 11-A', parent: 'Sarah Smith', phone: '+1 234 567 892', plan: 'Enterprise', status: 'Pending' },
    { id: 'STU-1004', name: 'Lucas Williams', class: 'Grade 8-C', parent: 'Robert Williams', phone: '+1 234 567 893', plan: 'Add-ons', status: 'Active' },
  ];

  const recentActivity = [
    { org: 'COOL Corp. School District', action: 'Upgraded to Enterprise Plan', time: '2m ago' },
    { org: 'CHEAKY Academy', action: 'Invited 5 new faculty members', time: '15m ago' },
    { org: 'SNEAKY Enterprises', action: 'Activated 2 new class integrations', time: '1h ago' },
    { org: 'SUSPICIOUS LLC', action: 'Reached 90% storage capacity', time: '3h ago' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header glass-header-section">
        <div>
          <div className="badge glass-badge info" style={{ marginBottom: '6px' }}>
            <Activity size={12} style={{ marginRight: '4px' }} /> Executive Overview
          </div>
          <h1 className="page-title text-shimmer-anim">PreSkool Admin Panel</h1>
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
          <DonutRingChart centerValue="$248,420" centerLabel="Total Revenue" />
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

        {/* Recent Account Activity */}
        <div className="dashboard-card glass-card hover-lift" style={{ flex: '1 1 480px' }}>
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Recent Account Activity</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/students')}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((act, i) => (
              <div key={i} className="activity-glass-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: 'rgba(150, 160, 180, 0.08)' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{act.org}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: '2px 0 0 0' }}>{act.action}</p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{act.time}</span>
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
              <th>Tier Plan</th>
              <th>Guardian / Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((student) => (
              <tr key={student.id} onClick={() => navigate(`/students/${student.id}`)} style={{ cursor: 'pointer' }}>
                <td><strong>{student.id}</strong></td>
                <td>
                  <div className="table-user">
                    <div className="table-avatar">{student.name.charAt(0)}</div>
                    <div className="table-user-info">
                      <span className="table-user-name">{student.name}</span>
                    </div>
                  </div>
                </td>
                <td>{student.class}</td>
                <td><span className="badge neutral" style={{ borderRadius: '10px' }}>{student.plan}</span></td>
                <td>{student.parent}</td>
                <td>
                  <span className={`badge ${student.status === 'Active' ? 'success' : 'warning'}`} style={{ borderRadius: '10px' }}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
