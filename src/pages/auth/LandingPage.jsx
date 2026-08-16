import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-title">
        Skool
      </div>
      <button className="landing-open-btn" onClick={() => navigate('/role')}>
        Open
      </button>
    </div>
  );
};

export default LandingPage;
