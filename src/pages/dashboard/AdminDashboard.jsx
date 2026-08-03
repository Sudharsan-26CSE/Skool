import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GraduationCap, Users, UserCheck, DollarSign, ArrowUpRight, ArrowDownRight, Calendar, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Students', value: '3,654', change: '+12%', positive: true, icon: GraduationCap, color: 'blue' },
    { title: 'Total Teachers', value: '284', change: '+4%', positive: true, icon: Users, color: 'green' },
    { title: 'Total Staff', value: '162', change: '-2%', positive: false, icon: UserCheck, color: 'orange' },
    { title: 'Total Earnings', value: '$45,280', change: '+8%', positive: true, icon: DollarSign, color: 'teal' },
  ];

  const recentStudents = [
    { id: 'STU-1001', name: 'Janet Adebayo', class: 'Grade 10-A', parent: 'Michael Adebayo', phone: '+1 234 567 890', date: 'May 12, 2024', status: 'Active' },
    { id: 'STU-1002', name: 'Marcus Chen', class: 'Grade 9-B', parent: 'David Chen', phone: '+1 234 567 891', date: 'May 11, 2024', status: 'Active' },
    { id: 'STU-1003', name: 'Sophia Smith', class: 'Grade 11-A', parent: 'Sarah Smith', phone: '+1 234 567 892', date: 'May 10, 2024', status: 'Pending' },
    { id: 'STU-1004', name: 'Lucas Williams', class: 'Grade 8-C', parent: 'Robert Williams', phone: '+1 234 567 893', date: 'May 09, 2024', status: 'Active' },
    { id: 'STU-1005', name: 'Olivia Johnson', class: 'Grade 12-A', parent: 'Emma Johnson', phone: '+1 234 567 894', date: 'May 08, 2024', status: 'Inactive' },
  ];

  const noticeItems = [
    { title: 'Annual Sports Day 2024 Registration Open', date: 'May 15, 2024', tag: 'Event' },
    { title: 'Mid-Term Examination Schedule Released', date: 'May 18, 2024', tag: 'Academic' },
    { title: 'Parent-Teacher Meeting for Grade 10', date: 'May 22, 2024', tag: 'Meeting' },
    { title: 'School Closed for Summer Vacation', date: 'Jun 10, 2024', tag: 'Holiday' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome back, Administrator! Here's what's happening today.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            <Calendar size={16} /> Export Report
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/students/add')}>
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{stat.change} from last month</span>
                </div>
              </div>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard Charts & Widgets Row */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>School Earnings & Expenses</h2>
            <select style={{ padding: '4px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <option>This Year</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="chart-placeholder">
            [ Bar Chart: Monthly Income vs Expenses ($45,280 Total Revenue) ]
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Student Overview</h2>
          </div>
          <div className="chart-placeholder" style={{ borderRadius: '50%', width: '180px', height: '180px', margin: '0 auto' }}>
            [ Donut Chart: 65% Boys / 35% Girls ]
          </div>
        </div>
      </div>

      {/* Recent Students Table & Notice Board Row */}
      <div className="dashboard-row">
        <div className="data-table-container">
          <div className="data-table-header">
            <h2>Recently Enrolled Students</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/students')}>View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Parent Name</th>
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
                        <span className="table-user-email">{student.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>{student.class}</td>
                  <td>{student.parent}</td>
                  <td>
                    <span className={`badge ${student.status === 'Active' ? 'success' : student.status === 'Pending' ? 'warning' : 'error'}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Notice Board</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notice-board')}>All Notices</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {noticeItems.map((notice, idx) => (
              <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="badge info">{notice.tag}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{notice.date}</span>
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{notice.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
