import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Search, Filter, ShieldCheck, Mail, Trash2, Edit } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getStaff, deleteStaff } from '../../services/api';

const StaffManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      // Fetch staff but exclude teachers if possible, or fetch all staff
      const data = await getStaff('staff');
      setStaffMembers(data.staff || []);
    } catch (err) {
      showToast('Failed to load staff. Using offline mode.', 'warning');
      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await deleteStaff(id);
      showToast('Staff removed successfully', 'success');
      fetchStaff();
    } catch (err) {
      showToast(err.message || 'Failed to remove staff', 'error');
    }
  };

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = (staff.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (staff.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment ? staff.department === filterDepartment : true;
    return matchesSearch && matchesDept;
  });

  const uniqueDepartments = [...new Set(staffMembers.map(s => s.department).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Administrative, security, IT, and maintenance personnel</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/staff/add')}>
            <Plus size={16} /> Add Staff Member
          </button>
        )}
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div className="data-table-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search staff by name or ID..."
              className="data-table-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="data-table-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={16} />
            <select 
              className="form-input" 
              style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem', minHeight: '36px' }}
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading staff...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center' }}>No staff found</td></tr>
              ) : filteredStaff.map((staff) => (
                <tr key={staff._id}>
                  <td><strong>{staff.employeeId}</strong></td>
                  <td>
                    <div className="table-user">
                      <div className="table-avatar info">{(staff.user?.name || 'S').charAt(0)}</div>
                      <div className="table-user-info">
                        <span className="table-user-name">{staff.user?.name || 'Unnamed Staff'}</span>
                        <span className="table-user-email">{staff.user?.email || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td><strong>{staff.designation}</strong></td>
                  <td><span className="badge neutral">{staff.department}</span></td>
                  <td>{staff.user?.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${staff.isActive ? 'success' : 'warning'}`}>
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="icon-btn" onClick={() => navigate(`/staff/edit/${staff._id}`)} title="Edit Staff" style={{ color: 'var(--primary)' }}>
                          <Edit size={16} />
                        </button>
                        <button className="icon-btn danger" onClick={() => handleDelete(staff._id)} title="Remove Staff">
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default StaffManagementPage;
