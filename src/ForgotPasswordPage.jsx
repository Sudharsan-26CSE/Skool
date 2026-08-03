import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Briefcase } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement password reset logic
        console.log('Password reset for:', email);
    };

    return (
        <div className="auth-page">
            <div className="auth-logo">
                <div className="auth-logo-icon">
                    <Briefcase size={20} />
                </div>
                <h1 className="auth-logo-text">Pre<span>Skool</span></h1>
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
                            <Mail size={16} className="form-input-icon" style={{ left: 'var(--space-3)', right: 'auto' }} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-btn">Reset Password</button>
                </form>

                <p className="auth-footer">
                    <Link to="/">← Back to log in</Link>
                </p>
            </div>
            <p className="auth-copyright">
                Copyright © 2024 PreSkool.
            </p>
        </div>
    );
};

export default ForgotPasswordPage;