import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllLedgers } from '../../api/ledger';
import { adminRoute } from '../../utils/router';

const LedgerSummary = () => {
    const { particular } = useParams();
    const originalParticular = particular.replace(/-/g, ' ');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await getAllLedgers({ search: originalParticular });
                const filtered = res.entries.filter(e => e.particulars === originalParticular);
                setEntries(filtered);
            } catch (err) {
                toast.error('Failed to fetch entries');
            } finally {
                setLoading(false);
            }
        })();
    }, [particular]);

    return (
        <div className="px-4 py-4">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Ledger Details - {particular}</h4>
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate(adminRoute('/ledger'))}>
                        ← Back to Summary
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table theme-table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Transaction Type</th>
                                <th>Amount (₹)</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                            ) : entries.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">No entries found.</td></tr>
                            ) : (
                                <>
                                    {entries.map((entry, idx) => (
                                        <tr key={entry._id}>
                                            <td>{idx + 1}</td>
                                            <td>{new Date(entry.date).toLocaleDateString('en-IN')}</td>
                                            <td>{entry.transactionType}</td>
                                            <td>₹ {entry.amount.toFixed(2)}</td>
                                            <td>{entry.description || '-'}</td>
                                        </tr>
                                    ))}
                                    <tr className="fw-bold bg-light">
                                        <td colSpan="3" className="text-end">Total</td>
                                        <td>
                                            ₹ {entries.filter(e => e.transactionType === 'debit').reduce((a, b) => a + b.amount, 0).toFixed(2)}
                                        </td>
                                        <td>
                                            ₹ {entries.filter(e => e.transactionType === 'credit').reduce((a, b) => a + b.amount, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LedgerSummary;
