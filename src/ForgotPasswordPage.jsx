import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import './pages/auth/AuthSplitLayout.css';
import AuthShowcasePanel from './pages/auth/AuthShowcasePanel';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="auth-split-wrapper">
      {/* ─── LEFT COLUMN: FORM PANEL ─── */}
      <div className="auth-split-form-col">
        {/* Brand Pill */}
        <Link to="/" className="auth-brand-pill" title="Return to home">
          <span className="auth-brand-pill-dot" />
          Skool
        </Link>

        {/* Central Form Content */}
        <div className="auth-split-form-inner">
          <h1 className="auth-split-title">Forgot Password</h1>
          <p className="auth-split-subtitle">No worries, we'll send you recovery instructions.</p>

          {sent ? (
            <div style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '16px 20px',
              borderRadius: '16px',
              fontSize: '0.9rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: 'inherit' }}>Reset Link Sent!</strong>
                <span>Check your inbox at <strong>{email}</strong> for instructions.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="auth-pill-group">
                <label className="auth-pill-label" htmlFor="forgot-email">Email Address</label>
                <div className="auth-pill-input-wrapper">
                  <input
                    type="email"
                    id="forgot-email"
                    name="email"
                    className="auth-pill-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-skyblue-submit">
                Send Reset Link
              </button>
            </form>
          )}

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link to="/login" className="auth-link-forgot" style={{ fontSize: '0.92rem' }}>
              ← Back to Sign in
            </Link>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="auth-split-footer">
          <span>
            Remembered your password? <Link to="/login">Sign in</Link>
          </span>
          <a href="#terms" onClick={(e) => e.preventDefault()}>
            Terms & Conditions
          </a>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: VISUAL SHOWCASE PANEL ─── */}
      <AuthShowcasePanel />
    </div>
  );
};

export default ForgotPasswordPage;