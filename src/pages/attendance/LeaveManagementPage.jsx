import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, CheckCircle, XCircle, Search, Clock, FileText } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';

const LeaveManagementPage = () => {
  const { showToast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      // Simulate API call to fetch leave requests
      setTimeout(() => {
        setLeaveRequests([
          { _id: '1', user: { name: 'Dr. Sarah Connor', role: 'teacher' }, leaveType: 'sick', fromDate: '2024-05-20', toDate: '2024-05-22', totalDays: 3, reason: 'Flu', status: 'pending' },
          { _id: '2', user: { name: 'Prof. Albert Vance', role: 'teacher' }, leaveType: 'casual', fromDate: '2024-06-01', toDate: '2024-06-02', totalDays: 2, reason: 'Family Function', status: 'approved' },
          { _id: '3', user: { name: 'Robert Vance', role: 'staff' }, leaveType: 'other', fromDate: '2024-05-15', toDate: '2024-05-15', totalDays: 1, reason: 'Personal work', status: 'rejected' },
        ]);
        setLoading(false);
      }, 500);
    } catch (err) {
      showToast('Failed to load leave requests.', 'error');
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setLeaveRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
    showToast(`Leave request ${newStatus}`, 'success');
  };

  const filteredLeaves = filterStatus === 'all' ? leaveRequests : leaveRequests.filter(req => req.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Track and approve staff and teacher leave requests</p>
        </div>
        {!isAdmin && (
          <button className="btn btn-primary">
            <FileText size={16} /> Apply for Leave
          </button>
        )}
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div className="data-table-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by name..." className="data-table-search-input" />
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
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
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
                <tr><td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center' }}>No leave requests found</td></tr>
              ) : filteredLeaves.map((req) => (
                <tr key={req._id}>
                  <td>
                    <strong>{req.user.name}</strong>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                      {req.user.role}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{req.leaveType}</td>
                  <td>
                    {req.fromDate} <br/>to {req.toDate}
                  </td>
                  <td>{req.totalDays}</td>
                  <td>{req.reason}</td>
                  <td>
                    <span className={`badge ${req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}`} style={{ textTransform: 'capitalize' }}>
                      {req.status}
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaveManagementPage;
