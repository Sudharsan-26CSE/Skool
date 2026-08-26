import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState(0);
  const [loadingWidth, setLoadingWidth] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const fullText = 'PREskool';

  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setText(fullText.slice(0, charIndex));
        setLoadingWidth((charIndex / fullText.length) * 100);
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 300);

    // Phase transitions for background
    const timers = [
      setTimeout(() => setPhase(1), 1800),   // Circles phase
      setTimeout(() => setPhase(2), 2400),   // Gradient phase
      setTimeout(() => setPhase(3), 3000),   // Full gradient
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => navigate('/login'), 500);
      }, 3800),
    ];

    return () => {
      clearInterval(typingInterval);
      timers.forEach(clearTimeout);
    };
  }, [navigate]);

  const phaseClass = phase === 1 ? 'splash-phase-circles' :
                     phase === 2 ? 'splash-phase-gradient' :
                     phase === 3 ? 'splash-phase-full' : '';

  const renderText = () => {
    if (!text) return <span className="splash-cursor"></span>;
    const preLength = Math.min(text.length, 3);
    const pre = text.slice(0, preLength);
    const skool = text.slice(3);
    return (
      <>
        <span className="pre">{pre}</span>
        {skool && <span className="skool">{skool}</span>}
        <span className="splash-cursor"></span>
      </>
    );
  };

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-fade-out' : ''}`}>
      <div className={`splash-bg ${phaseClass}`}>
        <div className="splash-blob splash-blob-1"></div>
        <div className="splash-blob splash-blob-2"></div>
        <div className="splash-blob splash-blob-3"></div>
      </div>
      <div className="splash-content">
        <div className="splash-title">
          {renderText()}
        </div>
        <div className="splash-loading">
          <div className="splash-loading-bar" style={{ width: `${loadingWidth}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
