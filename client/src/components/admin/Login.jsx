import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [view, setView] = useState('login'); // login | forgot | reset

    // Reset Flow States
    const [resetUser, setResetUser] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/login', { username, password });
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!resetUser) {
            setError('Please enter username');
            return;
        }
        try {
            await api.post('/auth/forgot-password', { username: resetUser });
            setMessage('OTP sent to your email (check server console if testing)');
            setView('reset');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await api.post('/auth/reset-password', {
                username: resetUser,
                otp,
                newPassword
            });
            setMessage('Password reset successful! Please login.');
            setView('login');
            setUsername(resetUser);
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        }
    };

    return (
        <div className="admin-login-container admin-scope">
            <div className="admin-login-card">
                <h2>
                    {view === 'login' && 'Admin Login'}
                    {view === 'forgot' && 'Recovery'}
                    {view === 'reset' && 'Reset Password'}
                </h2>

                {error && <p className="error-msg">{error}</p>}
                {message && <p className="success-msg" style={{ color: '#4ade80', marginBottom: '1rem' }}>{message}</p>}

                {view === 'login' && (
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                        <p className="forgot-link" onClick={() => {
                            setView('forgot');
                            setError('');
                            setMessage('');
                        }}>
                            Forgot Password?
                        </p>
                    </form>
                )}

                {view === 'forgot' && (
                    <form onSubmit={handleForgot}>
                        <p style={{ marginBottom: '1rem', color: '#888', fontSize: '0.9rem' }}>
                            Enter your admin username. We will send an OTP to the linked email.
                        </p>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            value={resetUser}
                            onChange={(e) => setResetUser(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-btn">Send OTP</button>
                        <p className="forgot-link" onClick={() => setView('login')}>Back to Login</p>
                    </form>
                )}

                {view === 'reset' && (
                    <form onSubmit={handleReset}>
                        <p style={{ marginBottom: '1rem', color: '#888', fontSize: '0.9rem' }}>
                            Enter the OTP sent to your email and your new password.
                        </p>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button type="submit" className="login-btn">Reset Password</button>
                        <p className="forgot-link" onClick={() => setView('login')}>Back to Login</p>
                    </form>
                )}
            </div>
            {/* Simple CSS Injection for link */}
            <style>{`
                .forgot-link {
                    margin-top: 1rem;
                    text-align: center;
                    color: #fbbf24;
                    cursor: pointer;
                    font-size: 0.9rem;
                    text-decoration: underline;
                }
                .forgot-link:hover {
                    color: #f59e0b;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
