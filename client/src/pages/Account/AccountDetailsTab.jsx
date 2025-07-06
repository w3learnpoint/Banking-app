import React, { useEffect, useState } from 'react';
import {
    getAccountDetailsByUser,
    upsertAccountDetails
} from '../../api/accountDetails';
import { toast } from 'react-toastify';

const AccountDetailsTab = ({ userId, onNext }) => {
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const initialForm = {
        branch: '',
        fatherOrHusbandName: '',
        guardianName: '',
        mobile: '',
        aadhar: '',
        depositAmount: '',
        accountType: '',
        formDate: '',
        accountNumber: '',
        introducerName: '',
        membershipNumber: '',
        tenure: '',
        address: {
            village: '',
            post: '',
            block: '',
            district: '',
            pincode: ''
        }
    };

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (userId && !hasFetched) {
            fetchAccount();
        }
    }, [userId]);

    const fetchAccount = async () => {
        try {
            setLoading(true);
            const res = await getAccountDetailsByUser(userId);
            if (res) {
                setForm({
                    ...res,
                    mobile: formatMobile(res.mobile || ''),
                    formDate: res.formDate
                        ? new Date(res.formDate).toISOString().split('T')[0]
                        : ''
                });
            } else {
                toast.info('No account details found. Please fill the form.');
            }
        } catch (err) {
            if (err?.response?.status !== 404) {
                toast.error(err?.message || 'Failed to fetch account details');
            }
        } finally {
            setHasFetched(true);
            setLoading(false);
        }
    };

    const formatMobile = (num) => {
        const cleaned = num.replace(/\D/g, '').slice(0, 10);
        if (cleaned.length > 5) return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        return cleaned;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let val = value;

        if (name === 'mobile') {
            val = formatMobile(val);
        } else if (type === 'number') {
            val = Number(val);
        } else {
            val = val.trimStart();
        }

        // Handle nested fields like address.village
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setForm((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: val
                }
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: val
            }));
        }
    };

    const handleReset = () => {
        setForm(initialForm);
    };

    const validateForm = () => {
        const alwaysRequired = [
            'branch',
            'fatherOrHusbandName',
            'mobile',
            'aadhar',
            'depositAmount',
            'accountType',
            'formDate',
            'membershipNumber'
        ];

        for (let field of alwaysRequired) {
            if (!form[field]) {
                toast.error(`Please fill out the ${field} field.`);
                return false;
            }
        }

        if (form.accountType === 'RD' && !form.tenure) {
            toast.error('Please enter tenure for RD account');
            return false;
        }

        const cleanMobile = form.mobile.replace(/\D/g, '');
        const cleanAadhar = form.aadhar.replace(/\D/g, '');

        if (!/^\d{10}$/.test(cleanMobile)) {
            toast.error('Mobile number must be 10 digits.');
            return false;
        }

        if (!/^\d{12}$/.test(cleanAadhar)) {
            toast.error('Aadhar number must be 12 digits.');
            return false;
        }

        if (form.depositAmount <= 0) {
            toast.error('Deposit amount must be greater than 0.');
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
                mobile: form.mobile.replace(/\D/g, ''),
                user: userId
            };

            const res = await upsertAccountDetails(payload);

            if (res?.accountNumber) {
                setForm(prev => ({
                    ...prev,
                    accountNumber: res.accountNumber
                }));
            }

            toast.success('Account details saved');
            if (onNext) onNext();
        } catch (err) {
            toast.error(err?.message || 'Failed to save account details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Readonly Account Number */}
                {form.accountNumber && (
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Account Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.accountNumber}
                            readOnly
                            disabled
                        />
                    </div>
                )}

                {/* Account Type Dropdown */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Account Type</label>
                    <select
                        name="accountType"
                        value={form.accountType}
                        onChange={handleChange}
                        className="form-select"
                        required
                        disabled={loading}
                    >
                        <option value="">-- Select Account Type --</option>
                        <option value="Saving">Saving</option>
                        <option value="RD">Recurring Deposit (RD)</option>
                        <option value="Fixed">Fixed Deposit (FD)</option>
                    </select>
                </div>

                {/* Dynamic Form Fields */}
                {[
                    { name: 'branch', label: 'Branch' },
                    { name: 'fatherOrHusbandName', label: 'Father/Husband Name' },
                    { name: 'guardianName', label: 'Guardian Name' },
                    { name: 'address.village', label: 'Village' },
                    { name: 'address.post', label: 'Post' },
                    { name: 'address.block', label: 'Block' },
                    { name: 'address.district', label: 'District' },
                    { name: 'address.pincode', label: 'Pincode' },
                    { name: 'mobile', label: 'Mobile', type: 'tel' },
                    { name: 'aadhar', label: 'Aadhar' },
                    { name: 'depositAmount', label: 'Deposit Amount', type: 'number' },
                    { name: 'formDate', label: 'Form Date', type: 'date' },
                    { name: 'introducerName', label: 'Introducer Name' },
                    { name: 'membershipNumber', label: 'Membership Number' },
                ].map(({ name, label, type = 'text' }) => (
                    <div className="col-md-6 mb-3" key={name}>
                        <label className="form-label">{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={name.includes('.') ? form?.[name.split('.')[0]]?.[name.split('.')[1]] || '' : form[name] || ''}
                            onChange={handleChange}
                            className="form-control"
                            disabled={loading}
                            required={
                                !['guardianName', 'introducerName'].includes(name)
                            }
                        />
                    </div>
                ))}

                {/* Tenure only if RD selected */}
                {form.accountType === 'RD' && (
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Tenure (months)</label>
                        <input
                            type="number"
                            name="tenure"
                            value={form.tenure}
                            onChange={handleChange}
                            className="form-control"
                            disabled={loading}
                            required
                        />
                    </div>
                )}
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save & Next'}
                </button>
            </div>
        </form>
    );
};

export default AccountDetailsTab;
