import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, GraduationCap } from 'lucide-react';

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigate('/dashboard/student');
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

      <h1>Choose Your Portal</h1>
      <p>Select your role to access your customized Skool workspace</p>

      <div className="role-grid">
        <div
          className={`role-card ${selectedRole === 'admin' ? 'selected' : ''}`}
          onClick={() => setSelectedRole('admin')}
        >
          <div className="role-icon admin">
            <Shield size={32} />
          </div>
          <h3>Administrator</h3>
          <p>Full control over school administration, staff, academics, and finances</p>
        </div>

        <div
          className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
          onClick={() => setSelectedRole('teacher')}
        >
          <div className="role-icon teacher">
            <BookOpen size={32} />
          </div>
          <h3>Teacher / Staff</h3>
          <p>Manage classes, student attendance, assignments, and exam grades</p>
        </div>

        <div
          className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
          onClick={() => setSelectedRole('student')}
        >
          <div className="role-icon student">
            <GraduationCap size={32} />
          </div>
          <h3>Student / Parent</h3>
          <p>View timetables, homework assignments, exam results, and announcements</p>
        </div>
      </div>

      <button className="auth-btn role-continue-btn" onClick={handleContinue}>
        Continue to Workspace
      </button>
    </div>
  );
};

export default RoleSelectionPage;
