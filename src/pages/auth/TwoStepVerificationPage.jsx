import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TwoStepVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon">P</div>
        <h1 className="auth-logo-text">Pre<span>Skool</span></h1>
      </div>

      <div className="auth-card">
        <div className="auth-card-header" style={{ textAlign: 'center' }}>
          <h1>2-Step Verification</h1>
          <p>Please enter the code sent to your registered email or phone</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-input"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button type="submit" className="auth-btn">Verify & Continue</button>
        </form>

        <p className="auth-footer">
          Didn't receive code? <Link to="#" onClick={(e) => { e.preventDefault(); alert('Code resent!'); }}>Resend Code</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: 'var(--space-2)' }}>
          <Link to="/">Return to Log in</Link>
        </p>
      </div>

      <p className="auth-copyright">
        Copyright © 2024 - Preskool
      </p>
    </div>
  );
};

export default TwoStepVerificationPage;
