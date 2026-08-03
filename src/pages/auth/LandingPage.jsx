import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-title">
        <span className="pre">PRE</span>
        <span className="skool">skool</span>
      </div>
      <button className="landing-open-btn" onClick={() => navigate('/role')}>
        Open
      </button>
    </div>
  );
};

export default LandingPage;
