import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllRoutes } from '../../api/route';
import { createPermission, updatePermission, getPermissionById } from '../../api/permission';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminRoute } from '../../utils/router';

const CreateEditPermission = () => {
    const { id } = useParams();
    const isEditMode = !!id;

    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', method: '', route: '' });
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {
        try {
            const [routeList, permissionData] = await Promise.all([
                getAllRoutes(),
                isEditMode ? getPermissionById(id) : Promise.resolve(null)
            ]);

            // Remove duplicate method:route combinations
            const uniqueRoutes = [];
            const seen = new Set();

            for (const route of routeList) {
                const key = `${route.method}:${route.route}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueRoutes.push(route);
                }
            }

            setRoutes(routeList || []);

            if (isEditMode && permissionData) {
                setForm({
                    name: permissionData.name || '',
                    method: permissionData.method || '',
                    route: permissionData.route || ''
                });
            }
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };

        if (!isEditMode && ((name === 'method' && updatedForm.route) || (name === 'route' && updatedForm.method))) {
            updatedForm.name = `${updatedForm.method}:${updatedForm.route}`;
        }

        setForm(updatedForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.method || !form.route) {
            toast.error('All fields are required.');
            return;
        }

        try {
            setSaving(true);
            if (isEditMode) {
                await updatePermission(id, form);
                toast.success('Permission updated successfully.');
            } else {
                await createPermission(form);
                toast.success('Permission created successfully.');
            }
            navigate(adminRoute('/permissions'));
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save permission.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2 text-white">Loading...</p>
            </div>
        );
    }

    return (
        <div className="main-content py-4">
            <div className="container">
                <div className="card theme-card p-4 shadow-sm">
                    <h4 className="theme-text mb-4">{isEditMode ? 'Edit Permission' : 'Create Permission'}</h4>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="theme-label">Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control theme-input"
                                placeholder="Enter permission name"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Method</label>
                            <Form.Select name="method" value={form.method} onChange={handleChange}>
                                <option value="">Select Method</option>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="PATCH">PATCH</option>
                                <option value="DELETE">DELETE</option>
                            </Form.Select>
                        </div>

                        <div className="mb-3">
                            <label className="theme-label">Route</label>
                            <Form.Select name="route" value={form.route} onChange={handleChange}>
                                <option value="">Select Route</option>
                                {routes.map((r, i) => (
                                    <option key={i} value={r.route}>{r.route}</option>
                                ))}
                            </Form.Select>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <Button type="submit" className="theme-btn" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Saving...
                                    </>
                                ) : (
                                    isEditMode ? 'Update Permission' : 'Create Permission'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEditPermission;
