import React, { useState, useEffect } from 'react';
import './ResetPassword.css';
import logo from '../../assets/images/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminRoute } from '../../utils/router';
import { resetPassword } from '../../api/auth';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError("Invalid or missing reset token.");
        }
    }, [token, email]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword } = form;

        if (!newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await resetPassword({ email, token, newPassword });
            setSuccess(res?.message || "Password has been reset. Redirecting...");
            setTimeout(() => navigate(adminRoute('/login')), 2000);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to reset password.");
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
                        <h3 className="welcome-text mb-2">Reset Password</h3>
                        <p className="subtext mb-4">Enter your new password below.</p>

                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        {success && <div className="alert alert-success py-2">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    className="form-control custom-input"
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="form-control custom-input"
                                />
                            </div>
                            <button type="submit" className="btn btn-login w-100 mb-3">
                                Reset Password
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

export default ResetPassword;
