import React, { useState, useEffect } from 'react';
import { createTransaction } from '../../api/transaction';
import { getAllAccounts } from '../../api/account'; // ✅ Fetch account list
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminRoute } from '../../utils/router';

const transactionTypes = ['deposit', 'withdrawal', 'transfer'];

const CreateTransaction = () => {
    const navigate = useNavigate();
    const { accountId } = useParams(); // Optional if passed in URL
    const { state } = useLocation();
    const { transactionData } = state || {};

    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        accountId: accountId || transactionData?.accountId || '',
        type: transactionData?.type || '',
        amount: transactionData?.amount || '',
        description: transactionData?.description || '',
        date: transactionData?.date?.slice(0, 10) || '',
    });

    useEffect(() => {
        if (!formData.date) {
            const today = new Date();
            const formatted = today.toISOString().split('T')[0];
            setFormData((prev) => ({ ...prev, date: formatted }));
        }
    }, [formData.date]);

    useEffect(() => {
        if (!accountId) {
            loadAccounts();
        }
    }, [accountId]);

    const loadAccounts = async () => {
        try {
            const res = await getAllAccounts({ page: 1, limit: 1000 }); // adjust as needed
            setAccounts(res.accounts || []);
        } catch (err) {
            toast.error('Failed to load accounts');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { accountId, type, amount } = formData;
        if (!accountId || !type || !amount) {
            toast.error('All required fields must be filled');
            return;
        }

        try {
            await createTransaction(formData);
            toast.success('Transaction created successfully');
            navigate(adminRoute(`/accounts/${accountId}/transactions`));
        } catch (err) {
            console.error('❌ Transaction failed:', err);
            toast.error(err?.message || 'Failed to create transaction');
        }
    };

    return (
        <div className="px-4 py-4">
            <div className="card p-3">
                <h4>{transactionData ? 'Edit' : 'Create'} Transaction</h4>
                <form onSubmit={handleSubmit}>
                    <div className="row">

                        {!accountId && (
                            <div className="col-md-6 mb-3">
                                <label className="theme-label text-black">Select Account <span className="text-danger">*</span></label>
                                <select
                                    name="accountId"
                                    value={formData.accountId}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">-- Select Account --</option>
                                    {accounts.map(acc => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.applicantName} ({acc.accountNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="col-md-4 mb-3">
                            <label className="theme-label text-black">Transaction Type <span className="text-danger">*</span></label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Select</option>
                                {transactionTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="theme-label text-black">Amount <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="form-control"
                                min="1"
                                required
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="theme-label text-black">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="theme-label text-black">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-control"
                                rows={2}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="text-end">
                        <button className="btn btn-primary" type="submit">
                            {transactionData ? 'Update Transaction' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTransaction;
