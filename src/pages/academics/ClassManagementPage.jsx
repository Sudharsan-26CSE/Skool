import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Users, UserRoundMinus } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getClasses, getStudents } from '../../services/api';

const ClassManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classData, studentData] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getStudents().catch(() => ({ students: [] }))
      ]);

      const classList = classData.classes || (Array.isArray(classData) ? classData : []);
      const studentList = studentData.students || (Array.isArray(studentData) ? studentData : []);
      setStudents(studentList);

      const grouped = {};
      classList.forEach(cls => {
        if (!grouped[cls.name]) {
          const enrolledCount = studentList.filter(s => (s.class?.name === cls.name || s.grade === cls.name)).length;
          grouped[cls.name] = {
            grade: cls.name,
            sections: [],
            headTeacher: cls.classTeacher?.name || 'Assigned Faculty',
            totalStudents: enrolledCount || cls.capacity || 0
          };
        }
        if (cls.section && !grouped[cls.name].sections.includes(cls.section)) {
          grouped[cls.name].sections.push(cls.section);
        }
      });
      setClasses(Object.values(grouped));
    } catch (err) {
      showToast('Failed to load classes.', 'error');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const classStudents = selectedClass
    ? students.filter(s => s.class?.name === selectedClass || s.grade === selectedClass)
    : [];

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
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>Sorry ! Not Available Data.</div>
            ) : (
              classes.map((cls, idx) => (
                <button key={idx} type="button" className="detail-card teacher-grid-card glass-card hover-lift" onClick={() => setSelectedClass(cls.grade)}>
                  <div className="detail-card-header">
                    <h3 className="detail-card-title">{cls.grade}</h3>
                    <span className="badge info">{cls.totalStudents} Enrolled</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sections</span>
                    <span className="detail-value">{cls.sections.length > 0 ? cls.sections.join(', ') : 'A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Grade Supervisor</span>
                    <span className="detail-value">{cls.headTeacher}</span>
                  </div>
                  <div className="detail-card-actions">
                    <span className="btn btn-secondary btn-sm">View Students</span>
                    <span className="btn btn-ghost btn-sm">Manage Section</span>
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
              <p className="page-subtitle">Enrolled students ({classStudents.length} total)</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedClass(null)}>Back to Classes</button>
          </div>
          <div className="student-grid">
            {classStudents.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>
                Sorry ! Not Available Data.
              </div>
            ) : (
              classStudents.map((stu) => (
                <div key={stu._id} className="student-grid-card hover-lift">
                  <div>
                    <strong>{stu.name}</strong>
                    <span>{stu.rollNumber || stu.admissionNumber || `ID: ${stu._id.slice(-5).toUpperCase()}`}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};

export default ClassManagementPage;
