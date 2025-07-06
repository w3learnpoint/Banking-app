import React, { useState } from 'react';
import './ResetPassword.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { adminRoute } from '../../utils/router';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email is required');
            return;
        }

        try {
            setLoading(true);
            const res = await forgotPassword({ email });
            setSuccess(res?.message || 'Reset link sent successfully.');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="login-box d-flex">
                {/* Left Side */}
                <div className="left-side d-flex align-items-center justify-content-center flex-column text-center">
                    <img src={logo} alt="Bailey and Co." className="logo mb-3" />
                    <h2 className="brand-text">Bailey and Co.</h2>
                </div>

                {/* Vertical Divider Line */}
                <div className="vertical-line"></div>

                {/* Right Side */}
                <div className="right-side d-flex align-items-center justify-content-center">
                    <div className="form-box">
                        <h3 className="welcome-text mb-2">Forgot Password</h3>
                        <p className="subtext mb-4">Enter your email to get the reset link.</p>

                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        {success && <div className="alert alert-success py-2">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control custom-input"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-login w-100 mb-3" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <div className="text-center">
                                <Link to={adminRoute('/login')} className="forgot-link">Back to login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;