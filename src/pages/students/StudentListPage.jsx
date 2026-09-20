import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getStudents, deleteStudent } from '../../services/api';

const StudentListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data.students || []);
    } catch (err) {
      showToast('Failed to load students. Using offline mode.', 'warning');
      setStudents([]); // fallback to empty if offline
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    try {
      await deleteStudent(id);
      showToast('Student removed successfully', 'success');
      fetchStudents();
    } catch (err) {
      showToast(err.message || 'Failed to remove student', 'error');
    }
  };

  const filteredStudents = students.filter(s =>
    (s.user?.name || s.parentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.admissionNo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Manage all registered students and their academic profiles</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/students/add')}>
            <Plus size={16} /> Add New Student
          </button>
        )}
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div className="data-table-search">
            <Search size={16} className="data-table-search-icon" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="data-table-search-input"
            />
          </div>
          <div className="data-table-actions">
            <button className="btn btn-secondary">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {loading ? (
           <div style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Parent Name</th>
                <th>Parent Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No students found</td></tr>
              ) : filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td><strong>{student.admissionNo}</strong></td>
                  <td>
                    <div className="table-user">
                      <div className="table-avatar">{(student.user?.name || 'S').charAt(0)}</div>
                      <div className="table-user-info">
                        <span className="table-user-name">{student.user?.name || 'Unnamed Student'}</span>
                      </div>
                    </div>
                  </td>
                  <td>{student.class?.className || student.section || 'N/A'}</td>
                  <td>{student.parentName || 'N/A'}</td>
                  <td>{student.parentPhone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${student.isActive ? 'success' : 'error'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-ghost btn-sm" title="View Profile" onClick={() => navigate(`/students/${student._id}`)}>
                        <Eye size={16} />
                      </button>
                      {isAdmin && (
                        <>
                          <button className="btn btn-ghost btn-sm" title="Edit Student">
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-ghost btn-sm" title="Remove" style={{ color: 'var(--error)' }} onClick={() => handleDelete(student._id)}>
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentListPage;
