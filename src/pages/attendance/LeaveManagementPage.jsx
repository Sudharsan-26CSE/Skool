import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, CheckCircle, XCircle, Search, Clock, FileText } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getLeaveRequests, updateLeaveRequest } from '../../services/api';

const LeaveManagementPage = () => {
  const { showToast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getLeaveRequests();
      const list = res.leaves || res.leaveRequests || (Array.isArray(res) ? res : []);
      setLeaveRequests(list);
    } catch (err) {
      showToast('Failed to load leave requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveRequest(id, { status: newStatus });
      setLeaveRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
      showToast(`Leave request ${newStatus} successfully!`, 'success');
    } catch (err) {
      showToast('Failed to update leave status.', 'error');
    }
  };

  const filteredLeaves = leaveRequests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const applicantName = req.applicant?.name || req.user?.name || '';
    const matchesSearch = applicantName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Track and approve staff and teacher leave requests</p>
        </div>
      </div>

      <div className="data-table-container glass-card hover-lift">
        <div className="data-table-header">
          <div className="data-table-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name..."
              className="data-table-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="data-table-actions">
            <select className="form-input" style={{ width: 'auto' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading leave requests...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No leave records found</td></tr>
              ) : filteredLeaves.map((req) => {
                const user = req.applicant || req.user;
                const fromStr = req.fromDate ? new Date(req.fromDate).toLocaleDateString() : '';
                const toStr = req.toDate ? new Date(req.toDate).toLocaleDateString() : '';
                return (
                  <tr key={req._id}>
                    <td>
                      <strong>{user?.name || 'Applicant'}</strong>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                        {user?.role || req.role || 'Staff'}
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{req.leaveType}</td>
                    <td>
                      {fromStr} <br/>to {toStr}
                    </td>
                    <td>{req.totalDays || 1}</td>
                    <td>{req.reason}</td>
                    <td>
                      <span className={`badge ${req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}`} style={{ textTransform: 'capitalize' }}>
                        {req.status || 'pending'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        {req.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="icon-btn success" title="Approve" onClick={() => handleStatusChange(req._id, 'approved')}>
                              <CheckCircle size={16} />
                            </button>
                            <button className="icon-btn danger" title="Reject" onClick={() => handleStatusChange(req._id, 'rejected')}>
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaveManagementPage;
