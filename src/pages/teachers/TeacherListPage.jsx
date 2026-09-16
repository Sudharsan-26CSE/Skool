import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Search, Filter, Mail, Phone, BookOpen, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getStaff, deleteStaff } from '../../services/api';

const TeacherListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Backend staff endpoint supports ?role=teacher
      const data = await getStaff('teacher');
      setTeachers(data.staff || []);
    } catch (err) {
      showToast('Failed to load teachers. Using offline mode.', 'warning');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this teacher?')) return;
    try {
      await deleteStaff(id);
      showToast('Teacher removed successfully', 'success');
      fetchTeachers();
    } catch (err) {
      showToast(err.message || 'Failed to remove teacher', 'error');
    }
  };

  const filteredTeachers = teachers.filter((tch) => {
    const matchesSearch = (tch.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tch.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment ? tch.department === filterDepartment : true;
    return matchesSearch && matchesDept;
  });

  const uniqueDepartments = [...new Set(teachers.map(t => t.department).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Directory</h1>
          <p className="page-subtitle">Manage teaching faculty and department allocations</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/teachers/add')}>
            <Plus size={16} /> Add Teacher
          </button>
        )}
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div className="data-table-search">
            <Search size={16} className="data-table-search-icon" />
            <input
              type="text"
              placeholder="Search by teacher name or ID..."
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
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading teachers...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Teacher Name</th>
                <th>Subject / Dept</th>
                <th>Contact Phone</th>
                <th>Experience</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center' }}>No teachers found</td></tr>
              ) : filteredTeachers.map((tch) => (
                <tr key={tch._id}>
                  <td><strong>{tch.employeeId}</strong></td>
                  <td>
                    <div className="table-user">
                      <div className="table-avatar" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                        {(tch.user?.name || 'T').charAt(0)}
                      </div>
                      <div className="table-user-info">
                        <span className="table-user-name">{tch.user?.name || 'Unnamed Teacher'}</span>
                        <span className="table-user-email">{tch.user?.email || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge info">{tch.designation || tch.department}</span>
                  </td>
                  <td>{tch.user?.phone || 'N/A'}</td>
                  <td>{tch.experience} Years</td>
                  <td>
                    <span className={`badge ${tch.isActive ? 'success' : 'warning'}`}>
                      {tch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="icon-btn danger" onClick={() => handleDelete(tch._id)} title="Remove Teacher">
                        <Trash2 size={16} />
                      </button>
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

export default TeacherListPage;
