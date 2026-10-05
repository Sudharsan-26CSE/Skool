import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, BookOpen, GraduationCap, Users } from 'lucide-react';

const RoleSelectionPage = () => {
  const location = useLocation();
  const initialRole = location.state?.role || localStorage.getItem('preskool-role') || 'admin';
  const roleLocked = Boolean(location.state?.role);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('preskool-role', selectedRole);
    const existingEmail = location.state?.email || localStorage.getItem('preskool-email') || '';
    const existingName = location.state?.name || localStorage.getItem('preskool-user-name') || localStorage.getItem('preskool-active-student') || '';

    if (existingEmail) localStorage.setItem('preskool-email', existingEmail);
    if (existingName) localStorage.setItem('preskool-user-name', existingName);

    if (selectedRole === 'student') {
      if (existingName && !existingName.toLowerCase().includes('admin') && !existingName.toLowerCase().includes('teacher') && !existingName.toLowerCase().includes('staff')) {
        localStorage.setItem('preskool-active-student', existingName);
      } else if (existingEmail) {
        const studentDisplayName = existingEmail.split('@')[0];
        localStorage.setItem('preskool-active-student', studentDisplayName);
        if (!existingName) localStorage.setItem('preskool-user-name', studentDisplayName);
      }
      navigate('/dashboard/student');
    } else if (selectedRole === 'staff') {
      navigate('/dashboard/staff');
    } else if (selectedRole === 'teacher') {
      navigate('/dashboard/teacher');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="role-selection">
      <div className="auth-bg-glow"></div>

      <div className="auth-logo">
        <div className="auth-logo-icon">S</div>
        <h1 className="auth-logo-text">Skool</h1>
      </div>

      <h1>Welcome to Skool</h1>
      <p>Select your role to access your customized Skool workspace</p>

      <div className="role-grid">
        <div
          className={`role-card admin-role hover-lift ${selectedRole === 'admin' ? 'selected' : ''}`}
          onClick={() => !roleLocked && setSelectedRole('admin')}
          aria-disabled={roleLocked && selectedRole !== 'admin'}
        >
          <div className="role-icon admin">
            <Shield size={32} />
          </div>
          <span className="badge neutral" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>
            Executive Suite
          </span>
          <h3>Administrator</h3>
          <p>Full control over school administration, staff, academics, and finances</p>
        </div>

        <div
          className={`role-card teacher-role hover-lift ${selectedRole === 'teacher' ? 'selected' : ''}`}
          onClick={() => !roleLocked && setSelectedRole('teacher')}
          aria-disabled={roleLocked && selectedRole !== 'teacher'}
        >
          <div className="role-icon teacher">
            <BookOpen size={32} />
          </div>
          <span className="badge neutral" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>
            Faculty & Teaching
          </span>
          <h3>Teacher</h3>
          <p>Manage classes, student attendance, assignments, and exam grades</p>
        </div>

        <div
          className={`role-card staff-role hover-lift ${selectedRole === 'staff' ? 'selected' : ''}`}
          onClick={() => !roleLocked && setSelectedRole('staff')}
          aria-disabled={roleLocked && selectedRole !== 'staff'}
        >
          <div className="role-icon staff" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
            <Users size={32} />
          </div>
          <span className="badge neutral" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>
            Operations & Admin
          </span>
          <h3>Staff Member</h3>
          <p>Campus logistics, leave requests, payroll, facilities & personnel directory</p>
        </div>

        <div
          className={`role-card student-role hover-lift ${selectedRole === 'student' ? 'selected' : ''}`}
          onClick={() => !roleLocked && setSelectedRole('student')}
          aria-disabled={roleLocked && selectedRole !== 'student'}
        >
          <div className="role-icon student">
            <GraduationCap size={32} />
          </div>
          <span className="badge neutral" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>
            Learner Portal
          </span>
          <h3>Student / Parent</h3>
          <p>View timetables, homework assignments, exam results, and announcements</p>
        </div>
      </div>

      <button
        className="auth-btn role-continue-btn"
        onClick={handleContinue}
        style={{
          width: 'auto',
          paddingLeft: '2.5rem',
          paddingRight: '2.5rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 auto',
          fontSize: '0.95rem',
        }}
      >
        Continue to Workspace →
      </button>
    </div>
  );
};

export default RoleSelectionPage;
