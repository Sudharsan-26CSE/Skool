import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const ResetPasswordSentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon">P</div>
        <h1 className="auth-logo-text">Pre<span>Skool</span></h1>
      </div>

      <div className="auth-card">
        <div className="auth-success">
          <div className="auth-success-icon">
            <Check size={32} />
          </div>
          <h2>Success</h2>
          <p>Your Password Reset Successfully</p>
          <button className="auth-btn" onClick={() => navigate('/')}>
            Back to Log in
          </button>
        </div>
      </div>

      <p className="auth-copyright">
        Copyright © 2024 - Preskool
      </p>
    </div>
  );
};

export default ResetPasswordSentPage;
