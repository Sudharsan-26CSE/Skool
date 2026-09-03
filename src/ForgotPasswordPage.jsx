import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement password reset logic
        console.log('Password reset for:', email);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-glow"></div>

            <div className="auth-logo">
                <div className="auth-logo-icon">S</div>
                <h1 className="auth-logo-text">Skool</h1>
            </div>

            <div className="auth-card">
                <div className="auth-card-header">
                    <h1>Forgot Password?</h1>
                    <p>No worries, we'll send you reset instructions.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="form-input-wrapper">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail size={16} className="form-input-icon" />
                        </div>
                    </div>
                    <button type="submit" className="auth-btn">Reset Password</button>
                </form>

                <p className="auth-footer">
                    <Link to="/login">← Back to log in</Link>
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

export default ForgotPasswordPage;