import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Users, UserRoundMinus } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getClasses } from '../../services/api';

const ClassManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getClasses();
      // Group classes by name (e.g. Grade 9) if multiple sections exist
      const classList = data.classes || [];
      const grouped = {};
      classList.forEach(cls => {
        if (!grouped[cls.name]) {
          grouped[cls.name] = {
            grade: cls.name,
            sections: [],
            headTeacher: cls.classTeacher?.name || 'N/A',
            totalStudents: cls.capacity || 0 // Should ideally aggregate students in that class
          };
        }
        grouped[cls.name].sections.push(cls.section);
      });
      setClasses(Object.values(grouped));
    } catch (err) {
      showToast('Failed to load classes. Using offline mode.', 'warning');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Management</h1>
          <p className="page-subtitle">Configure classes, sections, and class teacher assignments</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" type="button" onClick={() => navigate('/classes/add')}>
            <Plus size={16} /> Create New Class
          </button>
        )}
      </div>

      {!selectedClass ? (
        loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading classes...</div>
        ) : (
          <div className="detail-grid teacher-card-grid">
            {classes.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No classes found</div>
            ) : (
              classes.map((cls, idx) => (
                <button key={idx} type="button" className="detail-card teacher-grid-card" onClick={() => setSelectedClass(cls.grade)}>
                  <div className="detail-card-header">
                    <h3 className="detail-card-title">{cls.grade}</h3>
                    <span className="badge info">Capacity ~{cls.totalStudents}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sections</span>
                    <span className="detail-value">{cls.sections.join(', ')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Grade Supervisor</span>
                    <span className="detail-value">{cls.headTeacher}</span>
                  </div>
                  <div className="detail-card-actions">
                    <span className="btn btn-secondary btn-sm">View Students</span>
                    <span className="btn btn-ghost btn-sm">View Schedule</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )
      ) : (
        <section className="student-grid-panel">
          <div className="page-header">
            <div>
              <h2 className="page-title">{selectedClass} Students</h2>
              <p className="page-subtitle">Student names and roll numbers (Dummy data for view)</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedClass(null)}>Back to Classes</button>
          </div>
          <div className="student-grid">
            {/* Using some dummy students for the view since we didn't wire getStudents for a specific class here yet */}
            <div className="student-grid-card">
              <div><strong>John Doe</strong><span>STU-1001</span></div>
            </div>
            <div className="student-grid-card">
              <div><strong>Jane Smith</strong><span>STU-1002</span></div>
            </div>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};

export default ClassManagementPage;
