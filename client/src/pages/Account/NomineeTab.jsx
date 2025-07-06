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
        age: ''
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
                    age: res.age || ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.relation || form.age === '') {
            toast.error('Please fill all fields');
            return;
        }

        if (isNaN(form.age) || Number(form.age) <= 0) {
            toast.error('Age must be a positive number');
            return;
        }

        setLoading(true);

        try {
            if (existingId) {
                await updateNominee(existingId, form);
                toast.success('Nominee updated');
            } else {
                await createNominee(userId, form);
                toast.success('Nominee created');
            }
            if (onFinish) onFinish(); // Final step
        } catch (err) {
            toast.error(err?.message || 'Failed to save nominee');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'name', label: 'Nominee Name' },
        { name: 'relation', label: 'Relation to Account Holder' },
        { name: 'age', label: 'Nominee Age', type: 'number' }
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {fields.map(({ name, label, type = 'text' }) => (
                    <div className="col-md-6 mb-3" key={name}>
                        <label className="form-label">{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            className="form-control"
                            required
                            disabled={loading}
                        />
                    </div>
                ))}
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
