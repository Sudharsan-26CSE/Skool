import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

const EmailVerificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon">P</div>
        <h1 className="auth-logo-text">Pre<span>Skool</span></h1>
      </div>

      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-email-icon">
          <MailCheck size={40} />
        </div>

        <div className="auth-card-header">
          <h1>Check Your Email</h1>
          <p>We've sent a verification link to your registered email address.</p>
        </div>

        <button className="auth-btn" onClick={() => navigate('/2step')}>
          Verify Email
        </button>

        <p className="auth-footer">
          Didn't receive email? <Link to="#" onClick={(e) => { e.preventDefault(); alert('Resent link'); }}>Resend Link</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: 'var(--space-2)' }}>
          <Link to="/">Back to Log in</Link>
        </p>
      </div>

      <p className="auth-copyright">
        Copyright © 2024 - Preskool
      </p>
    </div>
  );
};

export default EmailVerificationPage;
