import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getUserById, updateUser, createUser } from '../../api/user.js';
import { getRoles } from '../../api/role';
import { toast } from 'react-toastify';
import { adminRoute } from '../../utils/router';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        status: true,
        password: ''
    });

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadData();
        } else {
            loadRoles();
            setLoading(false);
        }
    }, [id]);

    const loadData = async () => {
        try {
            const [user, roleList] = await Promise.all([
                getUserById(id),
                getRoles(),
            ]);

            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role?._id || user.role || '',
                status: user.status !== undefined ? user.status : true,
            });
            setRoles(roleList || []);
        } catch (err) {
            toast.error('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const roleList = await getRoles();
            setRoles(roleList || []);
        } catch (err) {
            toast.error('Failed to load roles');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleStatusChange = (e) => {
        setForm({ ...form, status: e.target.value === 'true' });
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.role) {
            toast.error('All fields are required.');
            return;
        }

        if (!validateEmail(form.email)) {
            toast.error('Invalid email format.');
            return;
        }

        try {
            setSaving(true);
            if (isEditMode) {
                await updateUser(id, form);
                toast.success('User updated successfully');
            } else {
                if (!form.password) {
                    toast.error('Password is required for new user');
                    setSaving(false);
                    return;
                }
                await createUser(form);
                toast.success('User created successfully');
            }
            navigate(adminRoute('/users'));
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-white">Loading...</p>
            </div>
        );
    }

    return (
        <div className="main-content py-4">
            <div className="container">
                <div className="card theme-card p-4 shadow-sm">
                    <h4 className="theme-text mb-4">
                        {isEditMode ? 'Edit User' : 'Create User'}
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="theme-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        {!isEditMode && (
                            <div className="mb-3">
                                <label className="theme-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="form-control theme-input"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="theme-label">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Role</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="form-select theme-input"
                                required
                            >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                    <option key={role._id} value={role._id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Status</label>
                            <select
                                name="status"
                                value={form.status ? 'true' : 'false'}
                                onChange={handleStatusChange}
                                className="form-select theme-input"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                className="btn theme-btn"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Spinner size="sm" animation="border" className="me-2" />
                                        Saving...
                                    </>
                                ) : (
                                    isEditMode ? 'Update User' : 'Create User'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
