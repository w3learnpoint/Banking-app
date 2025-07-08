import React, { useEffect, useState } from 'react';
import { getUserById, createUser, updateUser } from '../../api/user';
import { getRoles } from '../../api/role';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const BasicInfoTab = ({ onNext, setUserId }) => {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        dob: '',
        role: '',
        status: true
    });

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRoles();
        if (isEditMode) fetchUser();
    }, [id]);

    const fetchRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
            if (!isEditMode) {
                const userRole = data.find((role) => role.roleType.toLowerCase() === 'user');
                if (userRole) {
                    setForm((prev) => ({ ...prev, role: userRole._id }));
                }
            }
        } catch {
            toast.error('Failed to fetch roles');
        }
    };

    const fetchUser = async () => {
        setLoading(true);
        try {
            const user = await getUserById(id);
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || '',
                dob: user.dob ? new Date(user.dob).toISOString().substr(0, 10) : '',
                status: user.status !== false,
                password: '',
                role: user.role?._id || ''
            });
            if (setUserId) setUserId(user._id);
        } catch {
            toast.error('Failed to fetch user');
        } finally {
            setLoading(false);
        }
    };

    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'phone') {
            const formatted = formatPhone(value);
            setForm((prev) => ({ ...prev, [name]: formatted }));
        } else {
            setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value.trimStart() }));
        }
    };

    const validateForm = () => {
        const digitsOnly = form.phone.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
            toast.error('Phone number must be 10 digits');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...form,
                phone: form.phone.replace(/\s/g, '') // save without space
            };

            let userRes;
            if (isEditMode) {
                await updateUser(id, payload);
                toast.success('User updated successfully');
                userRes = { _id: id };
            } else {
                userRes = await createUser(payload);
                toast.success('User created successfully');
            }

            if (setUserId) setUserId(userRes._id);
            if (onNext) onNext();
        } catch (err) {
            toast.error(err?.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    const generatePassword = () => {
        if (form.name && form.email && form.dob) {
            const [year, month, day] = form.dob.split('-');
            const namePart = form.name.split(' ')[0]?.toUpperCase() || '';
            const password = `${namePart}@${day}${month}`;
            setForm({ ...form, password });
        } else {
            const randomPass = Math.random().toString(36).slice(-10);
            setForm({ ...form, password: randomPass });
        }
    };

    if (loading) return <div className="text-center py-5">Loading user...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={isEditMode}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 98765 43210"
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <select
                        className="form-select"
                        name="gender"
                        value={form.gender}
                        onChange={(e) =>
                            setForm({ ...form, gender: e.target.value })
                        }
                        required
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter or generate password"
                            readOnly={isEditMode}
                            disabled={isEditMode}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={generatePassword}
                            disabled={isEditMode}
                        >
                            Generate
                        </button>
                        {form.password && (
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => setForm({ ...form, password: '' })}
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        name="status"
                        value={form.status ? 'true' : 'false'}
                        onChange={(e) =>
                            setForm({ ...form, status: e.target.value === 'true' })
                        }
                        required
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Role</label>
                    <select
                        className="form-select"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        disabled={!isEditMode}
                        required
                    >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                            <option key={role._id} value={role._id}>{role.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="text-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save & Next'}
                </button>
            </div>
        </form>
    );
};

export default BasicInfoTab;
