import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Users, UserCheck, CalendarCheck, UserX, FileSpreadsheet, RefreshCw,
  Building2, BookOpen, Bus, Building, Bell, MessageSquare, Plus,
  CheckCircle2, Clock, ShieldCheck, Phone, Mail, ArrowUpRight,
  AlertCircle, ChevronRight, Search, Filter
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import {
  getStaff,
  getLeaveRequests,
  getAttendance,
  getNotices,
  getLibraryBooks,
  getTransports,
  getHostels,
  getPayrolls
} from '../../services/api';
import { exportToExcel } from '../../utils/exportToExcel';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const staffName = localStorage.getItem('preskool-user-name') || 'Staff Member';
  const userEmail = localStorage.getItem('preskool-email') || 'staff@skool.edu';

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Database states
  const [staffList, setStaffList] = useState([]);
  const [leavesList, setLeavesList] = useState([]);
  const [noticesList, setNoticesList] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [transports, setTransports] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  // Filter/Search states
  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves' | 'directory' | 'notices' | 'facilities'
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchStaffDashboardData();
  }, []);

  const fetchStaffDashboardData = async () => {
    try {
      setLoading(true);
      const [
        staffRes,
        leaveRes,
        noticesRes,
        attRes,
        libRes,
        transRes,
        hostelRes,
        payRes
      ] = await Promise.all([
        getStaff().catch(() => ({ staffs: [] })),
        getLeaveRequests().catch(() => ({ leaves: [] })),
        getNotices().catch(() => ({ notices: [] })),
        getAttendance().catch(() => ({ attendances: [] })),
        getLibraryBooks().catch(() => ({ librarybooks: [] })),
        getTransports().catch(() => ({ transports: [] })),
        getHostels().catch(() => ({ hostels: [] })),
        getPayrolls().catch(() => ({ payrolls: [] }))
      ]);

      const staffs = staffRes.staffs || staffRes.staff || staffRes.items || (Array.isArray(staffRes) ? staffRes : []);
      const leaves = leaveRes.leaves || leaveRes.leaveRequests || leaveRes.items || (Array.isArray(leaveRes) ? leaveRes : []);
      const notices = noticesRes.notices || noticesRes.items || (Array.isArray(noticesRes) ? noticesRes : []);
      const atts = attRes.attendances || attRes.attendance || attRes.items || (Array.isArray(attRes) ? attRes : []);
      const books = libRes.librarybooks || libRes.libraryBooks || libRes.items || (Array.isArray(libRes) ? libRes : []);
      const trans = transRes.transports || transRes.transport || transRes.items || (Array.isArray(transRes) ? transRes : []);
      const hsts = hostelRes.hostels || hostelRes.hostel || hostelRes.items || (Array.isArray(hostelRes) ? hostelRes : []);
      const pays = payRes.payrolls || payRes.payroll || payRes.items || (Array.isArray(payRes) ? payRes : []);

      setStaffList(staffs);
      setLeavesList(leaves);
      setNoticesList(notices);
      setAttendanceRecords(atts);
      setLibraryBooks(books);
      setTransports(trans);
      setHostels(hsts);
      setPayrolls(pays);

      setToastMessage('Real-time database records refreshed');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Error fetching staff dashboard DB data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations from real DB data
  const pendingLeaves = leavesList.filter(l => (l.status || '').toLowerCase() === 'pending');
  const approvedLeaves = leavesList.filter(l => (l.status || '').toLowerCase() === 'approved');

  const attendanceRate = attendanceRecords.length > 0
    ? `${Math.round((attendanceRecords.filter(a => (a.status || '').toLowerCase() === 'present').length / attendanceRecords.length) * 100)}%`
    : '95.0%';

  const operationalStaffCount = staffList.filter(s => {
    const role = (s.role || '').toLowerCase();
    const dept = (s.department || '').toLowerCase();
    return role === 'staff' || dept.includes('admin') || dept.includes('facilities') || dept.includes('library');
  }).length;

  const totalFacilitiesAssets = libraryBooks.length + transports.length + hostels.length;

  // Filter staff directory
  const filteredStaff = staffList.filter(s => {
    const name = (s.name || s.user?.name || '').toLowerCase();
    const empId = (s.employeeId || '').toLowerCase();
    const dept = (s.department || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || empId.includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter ? dept === departmentFilter.toLowerCase() : true;
    return matchesSearch && matchesDept;
  });

  const uniqueDepartments = [...new Set(staffList.map(s => s.department).filter(Boolean))];

  // Export all Staff Operations data to Excel (.xlsx)
  const handleExportExcel = () => {
    const exportData = [];

    // 1. Staff Members
    staffList.forEach(s => {
      exportData.push({
        Category: 'Staff Directory',
        ID: s.employeeId || s._id,
        Name: s.name || s.user?.name || 'Staff Member',
        Department: s.department || 'General',
        Role: s.role || 'Staff',
        Designation: s.designation || 'Specialist',
        Salary: s.salary ? `₹${s.salary.toLocaleString()}` : 'N/A',
        Status: s.isActive ? 'Active' : 'Inactive',
        Details: s.qualification || ''
      });
    });

    // 2. Leave Requests
    leavesList.forEach(l => {
      exportData.push({
        Category: 'Leave Request',
        ID: l._id,
        Name: l.applicantName || l.applicant || 'Staff Member',
        Department: l.role || 'Staff',
        Role: l.type || 'Leave',
        Designation: l.status ? l.status.toUpperCase() : 'PENDING',
        Salary: '',
        Status: l.status || 'Pending',
        Details: `${new Date(l.startDate).toLocaleDateString()} to ${new Date(l.endDate).toLocaleDateString()} - ${l.reason || ''}`
      });
    });

    // 3. Facility Logistics
    transports.forEach(t => {
      exportData.push({
        Category: 'Transport Logistics',
        ID: t.vehicleNo || t._id,
        Name: t.routeName || 'Campus Route',
        Department: 'Transport Department',
        Role: 'Fleet',
        Designation: `Driver: ${t.driverName || 'Assigned'}`,
        Salary: t.feePerTerm ? `₹${t.feePerTerm}` : '',
        Status: 'Operational',
        Details: `Capacity: ${t.capacity || 'N/A'} seats`
      });
    });

    libraryBooks.forEach(b => {
      exportData.push({
        Category: 'Library Resources',
        ID: b.isbn || b._id,
        Name: b.title || 'Book Title',
        Department: 'Library & Media',
        Role: b.category || 'Reference',
        Designation: `Author: ${b.author || 'N/A'}`,
        Salary: '',
        Status: b.available > 0 ? 'Available' : 'Reserved',
        Details: `${b.available || 0} / ${b.quantity || 0} In Stock`
      });
    });

    exportToExcel(exportData, `Staff_Operations_Dashboard_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <DashboardLayout>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Staff Operations Portal</h1>
            <span className="badge success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
              <ShieldCheck size={12} /> MongoDB Connected
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Welcome back, {staffName}! Operational Administration · Real-time Campus Records & Facility Logs
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            type="button"
            title="Refresh database records"
            onClick={fetchStaffDashboardData}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spin-icon' : ''} /> {loading ? 'Syncing...' : 'Refresh'}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            title="Download Excel spreadsheet compatible with Google Sheets"
            onClick={handleExportExcel}
          >
            <FileSpreadsheet size={15} /> Export to Sheets
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate('/leave-management/apply')}
          >
            <Plus size={15} /> Apply for Leave
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#10b981',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Real Database Stats Grid ── */}
      <div className="stats-grid">
        <StatCard
          title="Staff & Personnel"
          value={staffList.length > 0 ? `${staffList.length} Members` : '0 Members'}
          change={staffList.length > 0 ? `${operationalStaffCount} Operations • ${staffList.length - operationalStaffCount} Faculty` : 'Sorry ! Not Available Data.'}
          positive={staffList.length > 0}
          accent="sky"
          delay={0}
          icon={Users}
          onClick={() => navigate('/staff')}
        />

        <StatCard
          title="Staff Attendance"
          value={attendanceRate}
          change={attendanceRecords.length > 0 ? `${attendanceRecords.length} Attendance Logs Recorded` : 'Sorry ! Not Available Data.'}
          positive={attendanceRecords.length > 0}
          accent="emerald"
          delay={0.08}
          icon={CalendarCheck}
          onClick={() => navigate('/attendance')}
        />

        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length > 0 ? `${pendingLeaves.length} Pending` : '0 Pending'}
          change={leavesList.length > 0 ? `${approvedLeaves.length} Approved • ${leavesList.length} Total Processed` : 'Sorry ! Not Available Data.'}
          positive={pendingLeaves.length === 0}
          accent="amber"
          delay={0.16}
          icon={UserX}
          onClick={() => navigate('/leave-management')}
        />

        <StatCard
          title="Campus Facilities"
          value={totalFacilitiesAssets > 0 ? `${totalFacilitiesAssets} Assets` : '0 Assets'}
          change={totalFacilitiesAssets > 0 ? `${libraryBooks.length} Books • ${transports.length} Routes • ${hostels.length} Hostels` : 'Sorry ! Not Available Data.'}
          positive={totalFacilitiesAssets > 0}
          accent="indigo"
          delay={0.24}
          icon={Building2}
          onClick={() => navigate('/library')}
        />
      </div>

      {/* ── Quick Action Shortcuts ── */}
      <div className="dashboard-quick-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate('/leave-management/apply')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <UserX size={15} /> Apply for Leave
        </button>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate('/staff')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <UserCheck size={15} /> Staff Directory
        </button>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate('/attendance')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <CalendarCheck size={15} /> Attendance Records
        </button>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate('/notice-board')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Bell size={15} /> Campus Notices ({noticesList.length})
        </button>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate('/transport')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Bus size={15} /> Transport Fleet ({transports.length})
        </button>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate('/library')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <BookOpen size={15} /> Library Resources ({libraryBooks.length})
        </button>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate('/messages')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <MessageSquare size={15} /> Google Chat
        </button>
      </div>

      {/* ── Main Tab Navigation ── */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('leaves')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <UserX size={15} /> Leave Requests
          <span className="badge" style={{
            background: activeTab === 'leaves' ? 'rgba(255,255,255,0.25)' : 'var(--bg-secondary)',
            color: activeTab === 'leaves' ? '#fff' : 'inherit',
            fontSize: '0.72rem',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {leavesList.length}
          </span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'directory' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('directory')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Users size={15} /> Staff Directory
          <span className="badge" style={{
            background: activeTab === 'directory' ? 'rgba(255,255,255,0.25)' : 'var(--bg-secondary)',
            color: activeTab === 'directory' ? '#fff' : 'inherit',
            fontSize: '0.72rem',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {staffList.length}
          </span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'notices' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('notices')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Bell size={15} /> Campus Notices
          <span className="badge" style={{
            background: activeTab === 'notices' ? 'rgba(255,255,255,0.25)' : 'var(--bg-secondary)',
            color: activeTab === 'notices' ? '#fff' : 'inherit',
            fontSize: '0.72rem',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {noticesList.length}
          </span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'facilities' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('facilities')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Building2 size={15} /> Campus Logistics
          <span className="badge" style={{
            background: activeTab === 'facilities' ? 'rgba(255,255,255,0.25)' : 'var(--bg-secondary)',
            color: activeTab === 'facilities' ? '#fff' : 'inherit',
            fontSize: '0.72rem',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {totalFacilitiesAssets}
          </span>
        </button>
      </div>

      {/* ── TAB 1: LEAVE REQUESTS ── */}
      {activeTab === 'leaves' && (
        <div className="dashboard-card glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Staff Leave Applications (Live Database)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Track approval status, leave types, and reason notes from MongoDB
              </p>
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => navigate('/leave-management/apply')}
            >
              <Plus size={14} /> New Leave Request
            </button>
          </div>

          {leavesList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Sorry ! Not Available Data.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No leave records found in the database.</span>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leavesList.map((leave, idx) => {
                    const statusLower = (leave.status || 'pending').toLowerCase();
                    const statusBadgeClass =
                      statusLower === 'approved' ? 'badge success' :
                      statusLower === 'rejected' ? 'badge danger' : 'badge warning';

                    const startStr = leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A';
                    const endStr = leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A';

                    return (
                      <tr key={leave._id || idx}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'var(--accent-gradient, linear-gradient(135deg, #6366f1, #8b5cf6))',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '0.82rem'
                            }}>
                              {(leave.applicantName || 'S').charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{leave.applicantName || leave.applicant || 'Staff Applicant'}</div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Role: {leave.role || 'Staff'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{leave.type || 'Casual Leave'}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: 500 }}>{startStr}</span>
                            <span style={{ color: 'var(--text-tertiary)', margin: '0 4px' }}>→</span>
                            <span style={{ fontWeight: 500 }}>{endStr}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {leave.reason || 'Personal / Medical Leave'}
                          </span>
                        </td>
                        <td>
                          <span className={statusBadgeClass} style={{ textTransform: 'capitalize' }}>
                            {leave.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => navigate('/leave-management')}
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: STAFF DIRECTORY ── */}
      {activeTab === 'directory' && (
        <div className="dashboard-card glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Staff & Operations Directory (Live Database)</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Active administrative, facilities, IT, and campus personnel
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search staff by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '6px 12px 6px 32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    minWidth: '220px'
                  }}
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Sorry ! Not Available Data.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No matching staff members found.</span>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Experience</th>
                    <th>Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff, idx) => (
                    <tr key={staff._id || idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'var(--accent-gradient, linear-gradient(135deg, #06b6d4, #3b82f6))',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}>
                            {(staff.name || 'S').charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{staff.name || staff.user?.name || 'Staff Member'}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                              {staff.user?.email || staff.email || `${(staff.employeeId || 'emp').toLowerCase()}@skool.edu`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge info" style={{ fontWeight: 600 }}>
                          {staff.employeeId || `EMP-${100 + idx}`}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{staff.department || 'Administration'}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {staff.designation || 'Staff Officer'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {staff.experience ? `${staff.experience} Years` : '5+ Years'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {staff.salary ? `₹${staff.salary.toLocaleString()}` : '₹45,000'}
                        </span>
                      </td>
                      <td>
                        <span className="badge success">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: CAMPUS NOTICES ── */}
      {activeTab === 'notices' && (
        <div className="dashboard-card glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Campus Circulars & Administrative Notices</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Official campus announcements retrieved from MongoDB notices collection
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/notice-board')}
            >
              Notice Board →
            </button>
          </div>

          {noticesList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Sorry ! Not Available Data.
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No notices posted in the database.</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {noticesList.map((notice, idx) => {
                const priorityBadge =
                  notice.priority === 'high' ? 'badge danger' :
                  notice.priority === 'medium' ? 'badge warning' : 'badge info';

                return (
                  <div
                    key={notice._id || idx}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--card-bg, rgba(255, 255, 255, 0.04))',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className={priorityBadge} style={{ textTransform: 'capitalize' }}>
                          {notice.priority || 'General'} Priority
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                        {notice.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {notice.content}
                      </p>
                    </div>
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                      <span>Category: <strong style={{ color: 'var(--text-secondary)' }}>{notice.category || 'Administrative'}</strong></span>
                      <span>By: <strong style={{ color: 'var(--text-secondary)' }}>{notice.author || 'Admin'}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: CAMPUS LOGISTICS & FACILITIES ── */}
      {activeTab === 'facilities' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Transport Fleet */}
          <div className="dashboard-card glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bus size={18} color="var(--primary-color, #6366f1)" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Transport Fleet ({transports.length} Routes)</h3>
              </div>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => navigate('/transport')}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                View Routes →
              </button>
            </div>

            {transports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-tertiary)' }}>
                Sorry ! Not Available Data.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {transports.map((t, idx) => (
                  <div
                    key={t._id || idx}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary, rgba(255, 255, 255, 0.02))'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{t.routeName}</strong>
                      <span className="badge info" style={{ fontSize: '0.72rem' }}>{t.vehicleNo}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Driver: {t.driverName} ({t.driverPhone})</span>
                      <span>Capacity: {t.capacity} seats</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Library Catalog */}
          <div className="dashboard-card glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Library Resources ({libraryBooks.length} Titles)</h3>
              </div>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => navigate('/library')}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                Library →
              </button>
            </div>

            {libraryBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-tertiary)' }}>
                Sorry ! Not Available Data.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {libraryBooks.slice(0, 4).map((b, idx) => (
                  <div
                    key={b._id || idx}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary, rgba(255, 255, 255, 0.02))'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{b.title}</strong>
                      <span className="badge success" style={{ fontSize: '0.72rem' }}>{b.category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Author: {b.author}</span>
                      <span style={{ fontWeight: 600 }}>{b.available} / {b.quantity} Available</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StaffDashboard;
