import React, { useEffect, useState } from 'react';
import { getNomineeByUser, createNominee, updateNominee } from '../../api/nominee';
import { toast } from 'react-toastify';

const NomineeTab = ({ userId, onFinish }) => {
    const [existingId, setExistingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const initialForm = {
        name: '',
        relation: '',
        age: '',
        phone: ''
    };

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (userId && !hasFetched) {
            fetchNominee();
        }
    }, [userId]);

    const fetchNominee = async () => {
        try {
            setLoading(true);
            const res = await getNomineeByUser(userId);
            if (res) {
                setForm({
                    name: res.name || '',
                    relation: res.relation || '',
                    age: res.age || '',
                    phone: res.phone || ''
                });
                setExistingId(res._id);
            } else {
                toast.info('No nominee found. Please fill the form.');
            }
        } catch (err) {
            if (err?.response?.status !== 404) {
                toast.error(err?.message || 'Failed to fetch nominee details');
            }
        } finally {
            setHasFetched(true);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: typeof value === 'string' ? value.trimStart() : value
        }));
    };

    const handleReset = () => {
        setForm(initialForm);
        setExistingId(null);
    };

    const validateForm = () => {
        if (!form.name || !form.relation || form.age === '' || !form.phone) {
            toast.error('Please fill all fields');
            return false;
        }

        if (isNaN(form.age) || Number(form.age) <= 0) {
            toast.error('Age must be a positive number');
            return false;
        }

        const cleanPhone = form.phone.replace(/\D/g, '');
        if (!/^\d{10}$/.test(cleanPhone)) {
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
                mobile: form.phone.replace(/\D/g, '')
            };

            if (existingId) {
                await updateNominee(existingId, payload);
                toast.success('Nominee updated');
            } else {
                await createNominee(userId, payload);
                toast.success('Nominee created');
            }

            if (onFinish) onFinish();
        } catch (err) {
            toast.error(err?.message || 'Failed to save nominee');
        } finally {
            setLoading(false);
        }
    };

    const relationOptions = [
        'Father',
        'Mother',
        'Brother',
        'Sister',
        'Spouse',
        'Son',
        'Daughter',
        'Other'
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Nominee Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Relation to Account Holder</label>
                    <select
                        name="relation"
                        value={form.relation}
                        onChange={handleChange}
                        className="form-select"
                        required
                        disabled={loading}
                    >
                        <option value="">-- Select Relation --</option>
                        {relationOptions.map((rel) => (
                            <option key={rel} value={rel}>{rel}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Nominee Age</label>
                    <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Nominee Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="text-end">
                <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={handleReset}
                    disabled={loading}
                >
                    Reset
                </button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading
                        ? 'Saving...'
                        : existingId
                            ? 'Update & Finish'
                            : 'Create & Finish'}
                </button>
            </div>
        </form>
    );
};

export default NomineeTab;
