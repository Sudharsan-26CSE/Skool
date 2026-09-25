import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserX, Plus, Check, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getLeaveRequests, updateLeaveRequest } from '../../services/api';

const LeaveManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await getLeaveRequests();
      const list = res.leaves || res.leaveRequests || (Array.isArray(res) ? res : []);
      setLeaveRequests(list);
    } catch (err) {
      console.error('Failed to load leave requests:', err);
      showToast('Failed to load leave requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveRequest(id, { status: newStatus });
      showToast(`Leave application marked as ${newStatus}!`, 'success');
      fetchLeaves();
    } catch (err) {
      showToast('Failed to update leave status.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Review and approve staff and student leave applications</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/leave-management/apply')}>
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      <div className="data-table-container glass-card hover-lift">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading leave records...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role / Department</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No leave applications found.
                  </td>
                </tr>
              ) : (
                leaveRequests.map((req) => {
                  const applicant = req.applicant;
                  const from = req.fromDate ? new Date(req.fromDate).toLocaleDateString() : '';
                  const to = req.toDate ? new Date(req.toDate).toLocaleDateString() : '';
                  const duration = from && to ? `${from} - ${to}` : `${req.totalDays || 1} day(s)`;
                  const status = req.status || 'pending';

                  return (
                    <tr key={req._id}>
                      <td><strong>{applicant?.name || 'Staff / Student'}</strong></td>
                      <td>{applicant?.role || 'Applicant'}</td>
                      <td><span className="badge neutral" style={{ textTransform: 'capitalize' }}>{req.leaveType || 'General'}</span></td>
                      <td>{duration}</td>
                      <td>{req.reason}</td>
                      <td>
                        <span className={`badge ${status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}`} style={{ textTransform: 'capitalize' }}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--success)' }}
                            title="Approve"
                            onClick={() => handleStatusChange(req._id, 'approved')}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--error)' }}
                            title="Reject"
                            onClick={() => handleStatusChange(req._id, 'rejected')}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaveManagementPage;
