import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const AuthShowcasePanel = ({ onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const days = [
    { name: 'Sun', num: 22 },
    { name: 'Mon', num: 23 },
    { name: 'Tue', num: 24 },
    { name: 'Wed', num: 25 },
    { name: 'Thu', num: 26 },
    { name: 'Fri', num: 27 },
    { name: 'Sat', num: 28 },
  ];

  return (
    <div className="auth-split-visual-col">
      {/* Background Hero Image */}
      <img
        src="/auth_showcase.jpg"
        alt="Skool Collaborative Education & Learning"
        className="auth-visual-image"
      />

      {/* Circular Close Button (X) at Top Right */}
      <button
        type="button"
        className="auth-close-btn"
        onClick={handleClose}
        title="Return to Home"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Widget 1: Top Floating Task Card */}
      <div className="auth-float-task">
        <div className="auth-float-task-badge">
          <span>Task Review With Team</span>
          <span className="auth-float-task-dot" />
        </div>
        <div className="auth-float-task-shadow-pill">
          09:30am-10:00am
        </div>
      </div>

      {/* Widget 2: Floating Avatars Stack */}
      <div className="auth-float-avatars">
        <div className="auth-float-avatar-item">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Team member" />
        </div>
        <div className="auth-float-avatar-item" style={{ transform: 'translateX(-12px)' }}>
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Team member" />
        </div>
        <div className="auth-float-avatar-item" style={{ transform: 'translateX(-6px)' }}>
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80" alt="Team member" />
        </div>
      </div>

      {/* Widget 3: Frosted Calendar Strip with Diagonal Hatch */}
      <div className="auth-float-calendar">
        <div className="auth-calendar-days-row">
          {days.map((d) => (
            <div key={d.name} className="auth-calendar-day-col">
              <span className="auth-calendar-day-name">{d.name}</span>
              <span className="auth-calendar-day-num">{d.num}</span>
            </div>
          ))}
        </div>
        <div className="auth-calendar-hatch" />
      </div>

      {/* Widget 4: Bottom Floating Meeting Card */}
      <div className="auth-float-meeting">
        <div className="auth-float-meeting-header">
          <div>
            <span className="auth-float-meeting-title">Daily Meeting</span>
            <span className="auth-float-meeting-time">12:00pm-01:00pm</span>
          </div>
          <span className="auth-float-meeting-dot" />
        </div>
        <div className="auth-float-meeting-avatars">
          <div className="auth-meeting-avatar-small">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="Avatar" />
          </div>
          <div className="auth-meeting-avatar-small">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="Avatar" />
          </div>
          <div className="auth-meeting-avatar-small">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" alt="Avatar" />
          </div>
          <div className="auth-meeting-avatar-small">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=60&q=80" alt="Avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShowcasePanel;
