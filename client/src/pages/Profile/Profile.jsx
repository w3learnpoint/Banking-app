import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfileByEmail, updateProfile, changePassword } from '../../api/user';
import { getUser } from '../../utils/auth';
import defaultAvatar from '../../assets/images/pic3.webp';
import PasswordStrengthBar from 'react-password-strength-bar';

const Profile = () => {
    const [tab, setTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changing, setChanging] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { email } = getUser();
            const user = await getProfileByEmail(email);
            setProfile(user);
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateProfile(profile);
            toast.success("Profile updated successfully.");
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            return toast.error("All fields are required.");
        }

        if (form.newPassword !== form.confirmPassword) {
            return toast.error("New password and confirm password do not match.");
        }

        try {
            setChanging(true);
            await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            toast.success("Password updated successfully.");
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update password.");
        } finally {
            setChanging(false);
        }
    };

    if (loading || !profile) return <div className="text-black p-4">Loading profile...</div>;

    return (
        <div className="profile-wrapper py-5 px-4">
            <div className="card profile-card shadow p-4">
                <div className="d-flex justify-content-center mb-4">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button className={`nav-link ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
                                Edit Profile
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
                                Change Password
                            </button>
                        </li>
                    </ul>
                </div>

                {/* PROFILE TAB */}
                {tab === 'profile' && (
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <img src={defaultAvatar} alt="avatar" className="avatar mb-3" />
                            <h5 className="text-black mb-1">{profile.name}</h5>
                            <p className="text-muted mb-0">{profile.role?.name || profile.role}</p>
                        </div>
                        <div className="col-md-8">
                            <form onSubmit={handleProfileSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-black">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name || ''}
                                        onChange={handleProfileChange}
                                        className="form-control input-dark"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-black">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email || ''}
                                        disabled
                                        className="form-control input-dark"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-black">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={profile.phone || ''}
                                        onChange={handleProfileChange}
                                        className="form-control input-dark"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-black">Role</label>
                                    <input
                                        type="text"
                                        value={profile.role?.name || profile.role}
                                        disabled
                                        className="form-control input-dark"
                                    />
                                </div>
                                <button type="submit" className="btn theme-btn mt-2" disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* PASSWORD TAB */}
                {tab === 'password' && (
                    <div className="col-md-8 mx-auto">
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-black">Current Password</label>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={form.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="form-control theme-input"
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-black">New Password</label>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handlePasswordChange}
                                    className="form-control theme-input"
                                    autoComplete="new-password"
                                />
                                <PasswordStrengthBar password={form.newPassword} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-black">Confirm New Password</label>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="form-control theme-input"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="showPasswords"
                                    checked={showPasswords}
                                    onChange={() => setShowPasswords(!showPasswords)}
                                />
                                <label className="form-check-label text-black" htmlFor="showPasswords">
                                    Show Passwords
                                </label>
                            </div>

                            <button type="submit" className="btn theme-btn mt-2" disabled={changing}>
                                {changing ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
