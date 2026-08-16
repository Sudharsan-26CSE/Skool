import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { Plus, Search, Filter, ShieldCheck, Mail } from 'lucide-react';

const StaffManagementPage = () => {
  const staffMembers = [
    { id: 'STF-301', name: 'Robert Vance', role: 'Head Librarian', department: 'Library', email: 'robert.v@preskool.edu', phone: '+1 555-0301', status: 'Active' },
    { id: 'STF-302', name: 'Martha Stewart', role: 'Chief Accountant', department: 'Finance', email: 'martha.s@preskool.edu', phone: '+1 555-0302', status: 'Active' },
    { id: 'STF-303', name: 'James Bond', role: 'Security Supervisor', department: 'Security', email: 'james.b@preskool.edu', phone: '+1 555-0303', status: 'Active' },
    { id: 'STF-304', name: 'Nancy Drew', role: 'IT Specialist', department: 'Technology', email: 'nancy.d@preskool.edu', phone: '+1 555-0304', status: 'Active' },
    { id: 'STF-305', name: 'Gary Oak', role: 'Transport Manager', department: 'Logistics', email: 'gary.o@preskool.edu', phone: '+1 555-0305', status: 'On Leave' },
  ];

  return (
    <DashboardLayout>
      <Breadcrumbs />
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Administrative, security, IT, and maintenance personnel</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div className="data-table-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search staff by name or role..."
            />
          </div>
          <div className="data-table-actions">
            <button className="btn btn-secondary">
              <Filter size={16} /> Department
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Staff Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id}>
                <td><strong>{staff.id}</strong></td>
                <td>
                  <div className="table-user">
                    <div className="table-avatar info">{staff.name.charAt(0)}</div>
                    <div className="table-user-info">
                      <span className="table-user-name">{staff.name}</span>
                      <span className="table-user-email">{staff.email}</span>
                    </div>
                  </div>
                </td>
                <td><strong>{staff.role}</strong></td>
                <td><span className="badge neutral">{staff.department}</span></td>
                <td>{staff.phone}</td>
                <td>
                  <span className={`badge ${staff.status === 'Active' ? 'success' : 'warning'}`}>
                    {staff.status}
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

export default StaffManagementPage;
