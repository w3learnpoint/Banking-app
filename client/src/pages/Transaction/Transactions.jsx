// Modified AllTransactions.jsx - similar in structure and style to Accounts.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { adminRoute } from '../../utils/router';
import { getAllTransactions, exportTransactions } from '../../api/transaction';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({ type: '', accountType: '' });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, [page, JSON.stringify(filters), query]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await getAllTransactions({ page, limit: 10, applicantName: query, ...filters });
            setTransactions(res.transactions || []);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
    };

    const handleExport = async (format) => {
        try {
            await exportTransactions(format);
        } catch (err) {
            toast.error('Export failed');
        }
    };

    return (
        <div className="px-4 py-4">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                    <h4 className="theme-text">All Transactions</h4>
                    <div className="d-flex flex-wrap gap-2 align-items-end">
                        <div>
                            <label className="form-label mb-1 text-black">Search</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Name or Account No."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label mb-1 text-black">Transaction Type</label>
                            <select
                                className="form-select form-select-sm"
                                value={filters.type}
                                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            >
                                <option value="">All</option>
                                <option value="deposit">Deposit</option>
                                <option value="withdrawal">Withdrawal</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label mb-1 text-black">Account Type</label>
                            <select
                                className="form-select form-select-sm"
                                value={filters.accountType}
                                onChange={(e) => setFilters(prev => ({ ...prev, accountType: e.target.value }))}
                            >
                                <option value="">All</option>
                                <option value="Recurring">RD / आवर्ती जमा</option>
                                <option value="Savings">Saving / बचत</option>
                                <option value="Fixed">Fixed / सावधि जमा</option>
                                <option value="Mis">MIS / मासिक आय योजना</option>
                                <option value="Loan">Loan / ऋण</option>
                            </select>
                        </div>
                        <div className="align-self-end">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                    setQuery('');
                                    setFilters({ type: '', accountType: '' });
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-2 flex-wrap mt-3 mb-3 justify-content-end">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleExport('excel')}>
                        📥 Export Excel
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleExport('pdf')}>
                        📄 Export PDF
                    </button>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(adminRoute('/transaction/create'))}
                    >
                        + Create Transaction
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table theme-table table-bordered table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Account No.</th>
                                    <th>Applicant Name</th>
                                    <th>Account Type</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">No transactions found.</td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx._id}>
                                            <td>{format(new Date(tx.date), 'dd MMM yyyy')}</td>
                                            <td>{tx.accountId?.accountNumber || '-'}</td>
                                            <td>{tx.accountId?.applicantName || '-'}</td>
                                            <td>{tx.accountId?.accountType || '-'}</td>
                                            <td className={tx.type === 'deposit' ? 'text-success' : 'text-danger'}>
                                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                            </td>
                                            <td>{tx.amount?.toFixed(2)}</td>
                                            <td>{tx.description || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className="btn btn-sm btn-secondary me-2"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Prev
                        </button>
                        <span className="align-self-center">Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-sm btn-secondary ms-2"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
