import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const particleCanvasRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const introTimer = window.setTimeout(() => setShowIntro(false), 2800);
    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const pointer = { x: -1000, y: -1000 };
    let particles = [];
    let animationFrame;

    const resizeCanvas = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const count = Math.min(90, Math.max(38, Math.floor(window.innerWidth / 15)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 0.6,
      }));
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const handlePointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.012;
          particle.vy += (dy / distance) * force * 0.012;
        }
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(153, 246, 228, 0.55)';
        context.fill();
      });

      particles.forEach((particle, index) => {
        particles.slice(index + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 105) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(125, 211, 252, ${0.12 * (1 - distance / 105)})`;
            context.stroke();
          }
        });
      });
      animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Logging in with:', formData);
    if (formData.email && formData.password) {
      const loginInput = formData.email.trim();
      const email = loginInput.toLowerCase();
      const localPart = email.split('@')[0];
      const role = email === 'admin@mail.com'
        ? 'admin'
        : email === 'teacher@mail.com'
          ? 'teacher'
        : localPart.includes('staff')
          ? 'staff'
          : 'student';

      localStorage.setItem('preskool-email', email);
      localStorage.setItem('preskool-user-name', loginInput);
      localStorage.setItem('preskool-email', email.includes('@') ? email : '');
      navigate('/role', { state: { role, email, loginName: loginInput } });
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
      <div className="auth-world-bg" aria-hidden="true">
        <canvas ref={particleCanvasRef} className="particle-canvas" />
      </div>
      <div className="auth-bg-glow"></div>

      {showIntro && (
        <div className="brand-intro" aria-label="Loading Skool">
          <div className="brand-intro-word">Skool<span className="typing-cursor">|</span></div>
          <p>Connected learning, everywhere</p>
        </div>
      )}
      
      {/* PreSkool Brand Logo at top */}
      <div className={`auth-logo ${showIntro ? 'intro-hidden' : ''}`}>
        <div className="auth-logo-icon">S</div>
        <h1 className="auth-logo-text">Skool</h1>
      </div>

      {/* Main Auth Card */}
      <div className={`auth-card login-auth-card ${showIntro ? 'intro-hidden' : ''}`}>
        <div className="auth-card-header">
          <h1>Welcome Back!</h1>
          <p>Please enter your details to sign in</p>
        </div>

        {/* Social Logins */}
        <div className="social-login-group">
          <button className="social-btn facebook" type="button" title="Sign in with Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button className="social-btn google" type="button" title="Sign in with Google">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          </button>
          <button className="social-btn apple" type="button" title="Sign in with Apple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.95.99-3.09-1 .04-2.2.67-2.91 1.5-.63.74-1.18 1.91-1.03 3.03 1.12.09 2.27-.61 2.95-1.44z"/></svg>
          </button>
        </div>

        <div className="auth-divider">OR</div>

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

          <button type="submit" className="auth-btn">Sign In</button>
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