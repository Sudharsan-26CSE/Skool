import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser, signInWithGoogle, signInWithFacebook, getMe, isUserAdmin } from './services/api';
import './pages/auth/AuthSplitLayout.css';
import AuthShowcasePanel from './pages/auth/AuthShowcasePanel';

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

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user, role: resRole } = await signInWithGoogle();
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
      console.error("Google Sign-In error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("Domain needs to be authorized in Firebase Console. You can also sign in using email & password.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in popup was closed before completion.");
      } else {
        setError(err.message || "Google Sign-In failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    // Demo fallback / trigger Google
    handleGoogleSignIn();
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

            {/* Social Logins: Apple & Google Pill Buttons */}
            <div className="auth-social-pills-row">
              <button
                type="button"
                className="auth-social-pill"
                onClick={handleAppleSignIn}
                title="Sign in with Apple"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.95.99-3.09-1 .04-2.2.67-2.91 1.5-.63.74-1.18 1.91-1.03 3.03 1.12.09 2.27-.61 2.95-1.44z"/>
                </svg>
                <span>Apple</span>
              </button>

              <button
                type="button"
                className="auth-social-pill"
                onClick={handleGoogleSignIn}
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
    </div>
  );
};

export default LoginPage;