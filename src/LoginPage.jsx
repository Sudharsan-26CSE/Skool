import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { loginUser, signInWithGoogle, signInWithFacebook, getMe } from './services/api';

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
    event.preventDefault();
    if (!formData.email || !formData.password) return;
    
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await loginUser(formData.email, formData.password);
      
      const loginInput = formData.email.trim();
      const email = loginInput.toLowerCase();
      
      const profileRes = await getMe(email);
      const dbUser = profileRes.user || {};
      const role = dbUser.role || 'student';
      
      localStorage.setItem('preskool-email', email);
      localStorage.setItem('preskool-user-name', dbUser.name || user.displayName || loginInput);
      
      navigate('/role', { state: { role, email, loginName: dbUser.name || user.displayName || loginInput } });
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const { user, token } = await signInWithGoogle();
      
      const profileRes = await getMe(user.email);
      const dbUser = profileRes.user || {};
      const role = dbUser.role || 'student';
      
      localStorage.setItem('preskool-email', user.email);
      localStorage.setItem('preskool-user-name', dbUser.name || user.displayName);
      
      navigate('/role', { state: { role, email: user.email, loginName: dbUser.name || user.displayName } });
    } catch (err) {
      setError(err.message || "Google Sign-In failed");
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    try {
      const { user, token } = await signInWithFacebook();
      
      const profileRes = await getMe(user.email);
      const dbUser = profileRes.user || {};
      const role = dbUser.role || 'student';
      
      localStorage.setItem('preskool-email', user.email);
      localStorage.setItem('preskool-user-name', dbUser.name || user.displayName);
      
      navigate('/role', { state: { role, email: user.email, loginName: dbUser.name || user.displayName } });
    } catch (err) {
      setError(err.message || "Facebook Sign-In failed");
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
    <div className="auth-page">
      {/* PreSkool Brand Logo at top */}
      <div className="auth-logo">
        <img src="/favicon.png" alt="Logo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
        <h1 className="auth-logo-text">Skool</h1>
      </div>

      {/* Main Auth Card */}
      <div className="auth-card login-auth-card">
        <div className="auth-card-header">
          <h1>Welcome Back!</h1>
          <p>Please enter your details to sign in</p>
        </div>

        {/* Social Logins */}
        <div className="social-login-group">
          <button className="social-btn google" type="button" title="Sign in with Google" onClick={handleGoogleSignIn}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          </button>
          <button className="social-btn facebook" type="button" title="Sign in with Facebook" onClick={handleFacebookSignIn}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
        </div>

        <div className="auth-divider">OR</div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        {/* Form Inputs */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Username or Email</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your name or email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail size={16} className="form-input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="form-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="form-input-icon right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </div>

          <div className="form-checkbox-row">
            <label className="form-checkbox">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="form-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>

      <p className="auth-copyright">
        Copyright © 2026 - Skool · Powered By{' '}
        <a
          href="https://sudhan.website"
          target="_blank"
          rel="noopener noreferrer"
        >
          SD
        </a>
      </p>
    </div>
  );
};

export default LoginPage;