import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserX, Plus, Check, X } from 'lucide-react';

const LeaveManagementPage = () => {
  const leaveRequests = [
    { applicant: 'Mr. Alan Turing', role: 'Teacher', type: 'Medical Leave', dates: 'May 14 - May 16', reason: 'Fever & recovery', status: 'Pending' },
    { applicant: 'Marcus Chen', role: 'Student (9-B)', type: 'Casual Leave', dates: 'May 18 - May 19', reason: 'Family event', status: 'Approved' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Review and approve staff and student leave applications</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Role</th>
              <th>Leave Type</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req, idx) => (
              <tr key={idx}>
                <td><strong>{req.applicant}</strong></td>
                <td>{req.role}</td>
                <td><span className="badge neutral">{req.type}</span></td>
                <td>{req.dates}</td>
                <td>{req.reason}</td>
                <td>
                  <span className={`badge ${req.status === 'Approved' ? 'success' : 'warning'}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--success)' }}><Check size={16} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}><X size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default LeaveManagementPage;
