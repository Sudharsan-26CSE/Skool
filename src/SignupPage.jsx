import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase } from 'lucide-react';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement signup logic
        console.log('Signing up with:', { name, email, password });
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
                    <h1>Create an Account</h1>
                    <p>Get started with your free account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="form-input-wrapper">
                            <User size={16} className="form-input-icon" style={{ left: 'var(--space-3)', right: 'auto' }} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="form-input-wrapper">
                            <Lock size={16} className="form-input-icon" style={{ left: 'var(--space-3)', right: 'auto' }} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-btn">Sign Up</button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/">Log in</Link>
                </p>
            </div>
            <p className="auth-copyright">
                Copyright © 2024 PreSkool.
            </p>
        </div>
    );
};

export default SignupPage;