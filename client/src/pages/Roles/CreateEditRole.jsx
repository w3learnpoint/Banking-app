import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { getRoleById, createRole, updateRole } from '../../api/role';
import { getPermissions } from '../../api/permission';
import { toast } from 'react-toastify';
import { formatPermissionLabel } from '../../utils/permissionUtils';
import { adminRoute } from '../../utils/router';

const CreateEditRole = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        roleType: '',
        status: true,
        permissions: []
    });

    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {
        try {
            const [permList, roleData] = await Promise.all([
                getPermissions(),
                isEditMode ? getRoleById(id) : Promise.resolve(null)
            ]);

            setPermissions(permList || []);

            if (isEditMode && roleData) {
                const assigned = roleData.permissions.map(p => (typeof p === 'string' ? p : p._id));
                setForm({
                    name: roleData.name || '',
                    roleType: roleData.roleType || '',
                    status: roleData.status ?? true,
                    permissions: assigned
                });
            }
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleStatusChange = (e) => {
        setForm({ ...form, status: e.target.value === 'true' });
    };

    const handlePermissionToggle = (id) => {
        setForm(prev => ({
            ...prev,
            permissions: prev.permissions.includes(id)
                ? prev.permissions.filter(p => p !== id)
                : [...prev.permissions, id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.roleType) {
            toast.error('Name and Role Type are required.');
            return;
        }

        try {
            setSaving(true);
            if (isEditMode) {
                await updateRole(id, form);
                toast.success('Role updated successfully');
            } else {
                await createRole(form);
                toast.success('Role created successfully');
            }
            navigate(adminRoute('/roles'));
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save role');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-white">Loading role data...</p>
            </div>
        );
    }

    return (
        <div className="main-content py-4">
            <div className="container">
                <div className="card theme-card p-4 shadow-sm">
                    <h4 className="theme-text mb-4">{isEditMode ? 'Edit Role' : 'Create Role'}</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="theme-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="Enter role name"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Role Type</label>
                            <input
                                type="text"
                                name="roleType"
                                value={form.roleType}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="e.g., superadmin / admin / viewer"
                                required
                            />
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

                        <div className="mb-3">
                            <label className="theme-label">Permissions</label>
                            <div className="table-responsive">
                                <Table bordered hover variant="dark" className="text-white">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Permission</th>
                                            <th>Method</th>
                                            <th>Route</th>
                                            <th className="text-center">Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.map((perm, idx) => (
                                            <tr key={perm._id}>
                                                <td>{idx + 1}</td>
                                                <td>{formatPermissionLabel(perm)}</td>
                                                <td><Badge bg={getMethodColor(perm.method)}>{perm.method}</Badge></td>
                                                <td className="text-warning">{perm.route}</td>
                                                <td className="text-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={form.permissions.includes(perm._id)}
                                                        onChange={() => handlePermissionToggle(perm._id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <Button type="submit" className="btn theme-btn" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Spinner size="sm" animation="border" className="me-2" />
                                        Saving...
                                    </>
                                ) : (
                                    isEditMode ? 'Update Role' : 'Create Role'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const getMethodColor = (method) => {
    switch (method) {
        case 'GET': return 'info';
        case 'POST': return 'success';
        case 'PUT': return 'warning';
        case 'PATCH': return 'secondary';
        case 'DELETE': return 'danger';
        default: return 'light';
    }
};

export default CreateEditRole;
