import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, BookOpen, Search, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getSubjects, deleteSubject } from '../../services/api';

const SubjectManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isStudent = role === 'student';
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getSubjects();
      setSubjects(data.subjects || []);
    } catch (err) {
      showToast('Failed to load subjects. Using offline mode.', 'warning');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await deleteSubject(id);
      showToast('Subject deleted successfully', 'success');
      fetchSubjects();
    } catch (err) {
      showToast(err.message || 'Failed to delete subject', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isStudent ? 'My Subjects' : 'Subject Management'}</h1>
          <p className="page-subtitle">{isStudent ? 'View academic curriculum and course allocation' : 'Academic curriculum and course code allocation'}</p>
        </div>
        {!isStudent && isAdmin && (
          <button className="btn btn-primary" type="button" onClick={() => navigate('/subjects/add')}>
            <Plus size={16} /> Add New Subject
          </button>
        )}
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading subjects...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Category</th>
                <th>Academic Credits</th>
                <th>Target Grade</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sorry ! Not Available Data.</td></tr>
              ) : subjects.map((sub) => (
                <tr key={sub._id}>
                  <td><strong>{sub.code}</strong></td>
                  <td>
                    <div className="cell-with-icon">
                      <BookOpen size={16} color="var(--primary)" />
                      <strong>{sub.name}</strong>
                    </div>
                  </td>
                  <td><span className="badge neutral">{sub.category}</span></td>
                  <td>{sub.credits} Credits</td>
                  <td>{sub.description || 'N/A'}</td>
                  {isAdmin && (
                    <td>
                      <button className="icon-btn danger" onClick={() => handleDelete(sub._id)} title="Delete Subject">
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

export default SubjectManagementPage;
