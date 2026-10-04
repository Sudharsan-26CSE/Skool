import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import './NotFoundPage.css';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260801_001207_ec20d138-aa45-4b2b-ab8c-bdc71607f240.mp4';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="notfound-page">
      {/* Background Video — first child, lowest layer */}
      <video
        className="notfound-video"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Header Logo */}
      <Link to="/" className="notfound-logo" aria-label="Go to Home">
        <div className="notfound-logo-icon">S</div>
        <span className="notfound-logo-text">Skool</span>
      </Link>

      {/* Centered 404 Content */}
      <div className="notfound-content">
        <h1 className="notfound-heading">404</h1>
        <hr className="notfound-divider" />
        <p className="notfound-message">
          The path may be broken, but the journey isn't. Let's get you back.
        </p>

        <div className="notfound-actions">




          <button
            type="button"
            className="notfound-btn notfound-btn--ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </main>
  );
}
