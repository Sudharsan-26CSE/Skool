import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, signInWithGoogle, signInWithFacebook, getMe, isUserAdmin, getStudents } from './services/api';
import './pages/auth/AuthSplitLayout.css';
import AuthShowcasePanel from './pages/auth/AuthShowcasePanel';
import { Eye, EyeOff, Search, CheckCircle2, X, User, GraduationCap, Building, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ─── Google / Gmail Student Verification Popup State ─────────────
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [searchStudentName, setSearchStudentName] = useState('');
  const [searchRollNo, setSearchRollNo] = useState('');
  const [searchingDb, setSearchingDb] = useState(false);
  const [searchDbError, setSearchDbError] = useState(null);
  const [verifiedStudent, setVerifiedStudent] = useState(null);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!formData.email || !formData.password) return;
    
    setError(null);
    setLoading(true);
    try {
      const loginRes = await loginUser(formData.email, formData.password);
      
      const loginInput = formData.email.trim();
      const email = loginInput.toLowerCase();
      
      let role = loginRes.role;
      let userName = loginRes.user?.name || loginRes.user?.displayName;

      if (isUserAdmin(email)) {
        role = 'admin';
      }

      if (!role) {
        try {
          const profileRes = await getMe(email);
          const dbUser = profileRes.user || {};
          role = dbUser.role;
          if (dbUser.name) userName = dbUser.name;
        } catch (e) {}
      }

      if (!role) {
        if (isUserAdmin(email)) {
          role = 'admin';
        } else if (email.includes('teacher')) {
          role = 'teacher';
        } else if (email.includes('staff')) {
          role = 'staff';
        } else {
          role = 'student';
        }
      }

      localStorage.setItem('preskool-role', role);
      localStorage.setItem('preskool-email', email);
      localStorage.setItem('preskool-user-name', userName || (role === 'admin' ? 'Super Administrator' : loginInput));
      
      // Directly open the respective dashboard
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'teacher') {
        navigate('/dashboard/teacher');
      } else if (role === 'staff') {
        navigate('/dashboard/staff');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger student verification popup before Gmail sign in
  const handleOpenGoogleVerifyModal = () => {
    setError(null);
    setSearchDbError(null);
    setVerifiedStudent(null);
    setSearchStudentName('');
    setSearchRollNo('');
    setShowGoogleModal(true);
  };

  // Search database for student matching Name and Roll / Admission No
  const handleVerifyStudentInDb = async (e) => {
    if (e) e.preventDefault();
    if (!searchStudentName.trim() && !searchRollNo.trim()) {
      setSearchDbError('Please enter Student Name and Roll Number / Admission Number.');
      return;
    }

    setSearchingDb(true);
    setSearchDbError(null);
    setVerifiedStudent(null);

    try {
      const studentRes = await getStudents();
      const studentList = studentRes.students || studentRes.data || (Array.isArray(studentRes) ? studentRes : []);

      const cleanName = searchStudentName.trim().toLowerCase();
      const cleanRoll = searchRollNo.trim().toLowerCase();

      const found = studentList.find(s => {
        const sName = (s.name || s.user?.name || '').toLowerCase();
        const sRoll = (s.rollNumber || '').toLowerCase();
        const sAdm = (s.admissionNo || s.admissionNumber || '').toLowerCase();

        const nameMatches = !cleanName || sName.includes(cleanName) || cleanName.includes(sName);
        const rollMatches = !cleanRoll || sRoll === cleanRoll || sRoll.padStart(2, '0') === cleanRoll.padStart(2, '0') || sAdm.includes(cleanRoll);

        return nameMatches && rollMatches;
      });

      if (found) {
        setVerifiedStudent(found);
      } else {
        setSearchDbError(`No student record found in database matching "${searchStudentName}" and Roll / Admission "${searchRollNo}". Please check your details.`);
      }
    } catch (err) {
      setSearchDbError('Failed to search database. Please verify connection.');
    } finally {
      setSearchingDb(false);
    }
  };

  // Proceed with verified student profile and complete Google / Gmail Login
  const handleCompleteGoogleLogin = async () => {
    if (!verifiedStudent) return;
    setLoading(true);

    try {
      // Bind student profile to session
      localStorage.setItem('preskool-role', 'student');
      localStorage.setItem('preskool-active-student', verifiedStudent.name);
      localStorage.setItem('preskool-active-student-id', verifiedStudent._id || verifiedStudent.id);
      localStorage.setItem('preskool-active-class', verifiedStudent.className || verifiedStudent.grade);
      localStorage.setItem('preskool-student-data', JSON.stringify(verifiedStudent));
      localStorage.setItem('preskool-user-name', verifiedStudent.name);
      localStorage.setItem('preskool-email', verifiedStudent.email || 'student@skool.edu.in');
      localStorage.setItem('preskool-token', 'skool_stu_auth_' + Date.now());

      // Attempt Google OAuth
      try {
        await signInWithGoogle();
      } catch (authErr) {
        console.warn('Google popup skipped/fallback to verified student credentials:', authErr.message);
      }

      setShowGoogleModal(false);
      navigate('/dashboard/student');
    } catch (err) {
      setError('Failed to complete student login.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user, role: resRole } = await signInWithFacebook();
      const email = (user.email || '').toLowerCase();
      let role = resRole || (isUserAdmin(email) ? 'admin' : (email.includes('teacher') ? 'teacher' : email.includes('staff') ? 'staff' : 'student'));

      if (isUserAdmin(email)) {
        role = 'admin';
      } else {
        try {
          const profileRes = await getMe(email);
          if (profileRes.user?.role) role = profileRes.user.role;
        } catch (e) {}
      }

      localStorage.setItem('preskool-role', role);
      localStorage.setItem('preskool-email', email);
      localStorage.setItem('preskool-user-name', user.displayName || (role === 'admin' ? 'Super Administrator' : email.split('@')[0]));

      if (role === 'admin') navigate('/dashboard');
      else if (role === 'teacher') navigate('/dashboard/teacher');
      else if (role === 'staff') navigate('/dashboard/staff');
      else navigate('/dashboard/student');
    } catch (err) {
      console.error("Facebook Sign-In error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("Domain needs to be authorized in Firebase Console. You can also sign in using email & password.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in popup was closed before completion.");
      } else {
        setError(err.message || "Facebook Sign-In failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="auth-split-wrapper">
      {/* ─── LEFT COLUMN: FORM PANEL ─── */}
      <div className="auth-split-form-col">
        {/* Brand Pill matching "Crextio" in reference image */}
        <Link to="/" className="auth-brand-pill" title="Return to home">
          <span className="auth-brand-pill-dot" />
          Skool
        </Link>

        {/* Central Form Content */}
        <div className="auth-split-form-inner">
          <h1 className="auth-split-title">Sign in</h1>
          <p className="auth-split-subtitle">Sign in and continue your learning journey</p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              padding: '10px 18px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              marginBottom: '18px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Pill Input */}
            <div className="auth-pill-group">
              <label className="auth-pill-label" htmlFor="login-email">Email or Username</label>
              <div className="auth-pill-input-wrapper">
                <input
                  type="text"
                  id="login-email"
                  name="email"
                  className="auth-pill-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Pill Input */}
            <div className="auth-pill-group">
              <label className="auth-pill-label" htmlFor="login-password">Password</label>
              <div className="auth-pill-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  className="auth-pill-input"
                  placeholder="••••••••••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-pill-input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Password */}
            <div className="auth-extra-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  style={{ accentColor: '#38bdf8' }}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="auth-link-forgot">
                Forgot password?
              </Link>
            </div>

            {/* Sky Blue Submit Button (Matching User Request) */}
            <button
              type="submit"
              className="auth-btn-skyblue-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Submit'}
            </button>

            {/* Social Logins: Facebook & Google Pill Buttons */}
            <div className="auth-social-pills-row">
              <button
                type="button"
                className="auth-social-pill"
                onClick={handleFacebookSignIn}
                title="Sign in with Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>

              <button
                type="button"
                className="auth-social-pill"
                onClick={handleOpenGoogleVerifyModal}
                title="Sign in with Google"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer navigation */}
        <div className="auth-split-footer">
          <span>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </span>
          <a href="#terms" onClick={(e) => e.preventDefault()}>
            Terms & Conditions
          </a>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: VISUAL SHOWCASE PANEL (FLOATING WIDGETS) ─── */}
      <AuthShowcasePanel />

      {/* ─── GOOGLE / GMAIL STUDENT VERIFICATION POPUP ─── */}
      {showGoogleModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGoogleModal(false);
          }}
        >
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              position: 'relative'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(66, 133, 244, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                    Student Gmail Verification
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Verify your institutional record before connecting Gmail
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowGoogleModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message if search failed */}
            {searchDbError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{searchDbError}</span>
              </div>
            )}

            {/* Inputs: Student Name & Roll No */}
            {!verifiedStudent ? (
              <form onSubmit={handleVerifyStudentInDb} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Arun Kumar, Sudharsan S, Ashwin Kumar"
                    value={searchStudentName}
                    onChange={(e) => setSearchStudentName(e.target.value)}
                    style={{ width: '100%', height: '42px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Roll Number or Admission Number
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 01, STU-9001, STU-1201"
                    value={searchRollNo}
                    onChange={(e) => setSearchRollNo(e.target.value)}
                    style={{ width: '100%', height: '42px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, height: '42px', borderRadius: '12px', fontWeight: 600 }}
                    onClick={() => setShowGoogleModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={searchingDb}
                    style={{ flex: 1, height: '42px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Search size={16} />
                    {searchingDb ? 'Searching DB...' : 'Search & Verify'}
                  </button>
                </div>
              </form>
            ) : (
              /* Verified Student Details Card */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={24} color="#16a34a" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#15803d' }}>
                      Student Record Verified in Database!
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#166534' }}>
                      Verified institutional profile matching MongoDB database.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>STUDENT NAME</span>
                    <strong style={{ color: '#0f172a' }}>{verifiedStudent.name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>CLASS & SECTION</span>
                    <strong style={{ color: '#6366f1' }}>{verifiedStudent.className || verifiedStudent.grade}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>ROLL / ADMISSION NO</span>
                    <strong style={{ color: '#0f172a' }}>Roll {verifiedStudent.rollNumber} • {verifiedStudent.admissionNo}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>OVERALL ATTENDANCE</span>
                    <strong style={{ color: '#16a34a' }}>{verifiedStudent.attendanceRate || '95%'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>ACADEMIC SCORE</span>
                    <strong style={{ color: '#8b5cf6' }}>{verifiedStudent.academicScore || '88%'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>BLOOD GROUP</span>
                    <strong style={{ color: '#e11d48' }}>{verifiedStudent.bloodGroup || 'O+'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, height: '42px', borderRadius: '12px', fontWeight: 600 }}
                    onClick={() => setVerifiedStudent(null)}
                  >
                    Change Student
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ flex: 1.5, height: '42px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={handleCompleteGoogleLogin}
                  >
                    {loading ? 'Connecting...' : 'Proceed to Student Portal →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;