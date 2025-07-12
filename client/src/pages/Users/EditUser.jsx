import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getUserById, updateUser, createUser, deleteProfilePic } from '../../api/user.js';
import { getRoles } from '../../api/role';
import { toast } from 'react-toastify';
import { adminRoute } from '../../utils/router';
import CommonModal from '../../components/common/CommonModal.jsx';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        gender̀: '',
        role: '',
        status: true,
        password: '',
        dob: '',
    });

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showDeletePicModal, setShowDeletePicModal] = useState(false);

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
                gender: user.gender || '',
                role: user.role?._id || user.role || '',
                status: user.status !== undefined ? user.status : true,
                dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                profilePic: user?.profilePic
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
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (selectedFile) {
                formData.append('profilePic', selectedFile);
            }

            if (isEditMode) {
                await updateUser(id, formData);
                toast.success('User updated successfully');
            } else {
                if (!form.password) {
                    toast.error('Password is required for new user');
                    setSaving(false);
                    return;
                }
                await createUser(formData);
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
                        <div className="mb-4 text-center">
                            <img
                                src={
                                    selectedFile
                                        ? URL.createObjectURL(selectedFile)
                                        : form.profilePic
                                            ? (form.profilePic.startsWith('http') || form.profilePic.startsWith('blob:')
                                                ? form.profilePic
                                                : `${process.env.REACT_APP_API_URL}${form.profilePic}`)
                                            : require('../../assets/images/pic3.webp')
                                }
                                alt="Profile Preview"
                                className="rounded-circle shadow"
                                style={{ width: 120, height: 120, objectFit: 'cover' }}
                            />
                            <div className="mt-2">
                                <label className="btn btn-sm btn-outline-primary me-2">
                                    Upload Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setSelectedFile(file);
                                        }}
                                    />
                                </label>
                                {form.profilePic && (
                                    <button
                                        type="button" // ✅ prevent form submit
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => setShowDeletePicModal(true)}
                                        disabled={uploading}
                                    >
                                        {uploading ? "Removing..." : "Remove"}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="theme-label text-black">Name</label>
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
                            <label className="theme-label text-black">Email</label>
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
                                <label className="theme-label text-black">Password</label>
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
                            <label className="theme-label text-black">Phone</label>
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
                            <label className="theme-label text-black">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={form.dob}
                                onChange={handleChange}
                                className="form-control theme-input"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-black">Gender</label>
                            <select
                                className="form-select"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="theme-label text-black">Role</label>
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
                            <label className="theme-label text-black">Status</label>
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
            <CommonModal
                show={showDeletePicModal}
                onHide={() => setShowDeletePicModal(false)}
                title="Confirm Deletion"
                type="confirm-delete"
                emoji="🗑️"
                itemName="profile picture"
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                    try {
                        setUploading(true);
                        await deleteProfilePic(id); // ✅ use the `id` from useParams
                        toast.success('Profile picture deleted.');
                        setForm(prev => ({ ...prev, profilePic: null })); // ✅ clear locally
                    } catch (err) {
                        toast.error(err?.message || 'Failed to delete image.');
                    } finally {
                        setUploading(false);
                        setShowDeletePicModal(false);
                    }
                }}
            />

        </div>
    );
};

export default EditUser;
