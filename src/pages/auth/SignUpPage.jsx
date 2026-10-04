import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { registerUser, signInWithGoogle, signInWithFacebook } from '../../services/api';
import './AuthSplitLayout.css';
import AuthShowcasePanel from './AuthShowcasePanel';

const isAdminEmail = (email) => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean === 'admin@skool.edu.in' || clean === 'admin@mail.com' || clean.startsWith('admin') || clean.includes('admin');
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = (formData.email || '').trim().toLowerCase();

    // Enforce: Admin mail cannot register through this student signup page
    if (isAdminEmail(cleanEmail)) {
      setError("Administrator accounts cannot be registered through this sign-up page. Please use the official Sign In page.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: formData.name.trim(),
        email: cleanEmail,
        password: formData.password,
        role: 'student'
      });
      navigate('/email-verification', { state: { email: cleanEmail, role: 'student' } });
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user } = await signInWithGoogle();
      const email = (user.email || '').toLowerCase();
      localStorage.setItem('preskool-role', 'student');
      localStorage.setItem('preskool-email', email);
      localStorage.setItem('preskool-user-name', user.displayName || email.split('@')[0]);
      navigate('/dashboard/student');
    } catch (err) {
      setError(err.message || "Google sign-up failed. Please sign up using email & password.");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user, role: resRole } = await signInWithFacebook();
      const email = (user.email || '').toLowerCase();
      const role = resRole || (email.includes('teacher') ? 'teacher' : email.includes('staff') ? 'staff' : 'student');
      navigate(role === 'admin' ? '/dashboard' : role === 'teacher' ? '/dashboard/teacher' : role === 'staff' ? '/dashboard/staff' : '/dashboard/student');
    } catch (err) {
      console.error("Facebook Sign-Up error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("Domain needs to be authorized in Firebase Console. You can also sign up using email & password.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-up popup was closed before completion.");
      } else {
        setError(err.message || "Facebook Sign-Up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* ─── LEFT COLUMN: FORM PANEL ─── */}
      <div className="auth-split-form-col">
        {/* Brand Pill (Matches "Crextio" in user reference image) */}
        <Link to="/" className="auth-brand-pill" title="Return to home">
          <span className="auth-brand-pill-dot" />
          Skool
        </Link>

        {/* Central Form Content */}
        <div className="auth-split-form-inner">
          <h1 className="auth-split-title">Create an account</h1>
          <p className="auth-split-subtitle">Sign up and get 30 day free trial</p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              padding: '10px 18px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              marginBottom: '18px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name Pill Input */}
            <div className="auth-pill-group">
              <label className="auth-pill-label" htmlFor="signup-name">Full name</label>
              <div className="auth-pill-input-wrapper">
                <input
                  type="text"
                  id="signup-name"
                  name="name"
                  className="auth-pill-input"
                  placeholder="Amélie Laurent"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Pill Input */}
            <div className="auth-pill-group">
              <label className="auth-pill-label" htmlFor="signup-email">Email</label>
              <div className="auth-pill-input-wrapper">
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  className="auth-pill-input"
                  placeholder="amelielaurent7622@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Pill Input with Eye Icon */}
            <div className="auth-pill-group">
              <label className="auth-pill-label" htmlFor="signup-password">Password</label>
              <div className="auth-pill-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="signup-password"
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

            {/* Sky Blue Submit Button (Matching User Request) */}
            <button
              type="submit"
              className="auth-btn-skyblue-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Submit'}
            </button>

            {/* Social Logins: Facebook & Google Pill Buttons */}
            <div className="auth-social-pills-row">
              <button
                type="button"
                className="auth-social-pill"
                onClick={handleFacebookSignUp}
                title="Sign up with Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>

              <button
                type="button"
                className="auth-social-pill"
                onClick={handleGoogleSignUp}
                title="Sign up with Google"
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
            Have any account? <Link to="/login">Sign in</Link>
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

export default SignUpPage;
