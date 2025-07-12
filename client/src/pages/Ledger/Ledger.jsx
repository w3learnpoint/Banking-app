import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllLedgers } from '../../api/ledger';
import { fetchUserPermissions, hasPermission } from '../../utils/permissionUtils';
import { adminRoute } from '../../utils/router';
import CommonModal from '../../components/common/CommonModal';

const Ledger = () => {
    const [particularSummary, setParticularSummary] = useState([]);
    const [summaryTotals, setSummaryTotals] = useState({});
    const [userPermissions, setUserPermissions] = useState([]);
    const [query, setQuery] = useState('');
    const [show403Modal, setShow403Modal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const perms = await fetchUserPermissions();
            setUserPermissions(perms);
        })();
    }, []);

    useEffect(() => {
        loadSummary();
    }, [query, currentPage]);

    const loadSummary = async () => {
        try {
            const res = await getAllLedgers({ search: query, page: currentPage, limit });
            setParticularSummary(res.summary?.particularSummary || []);
            setSummaryTotals({
                overallCredit: res.summary?.overallCredit || 0,
                overallDebit: res.summary?.overallDebit || 0,
                overallBalance: res.summary?.overallBalance || 0,
            });
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            toast.error('Failed to load ledger summary');
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN');

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="px-4 py-4">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 theme-text">Ledger List</h4>
                    <div className="d-flex gap-2">
                        <div>
                            <input
                                type="text"
                                placeholder="Search Particular..."
                                className="form-control form-control-sm"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-md btn-primary"
                                onClick={() => {
                                    navigate(adminRoute('/ledger/create'));
                                }}
                            >
                                + Create Ledger
                            </button>
                        </div>
                    </div>
                </div>

                {/* 🔸 Summary Table */}
                <div className="table-responsive mb-4">
                    <table className="table table-bordered theme-table">
                        <thead>
                            <tr>
                                <th>Particular</th>
                                <th>Total Credit (₹)</th>
                                <th>Total Debit (₹)</th>
                                <th>Balance (₹)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {particularSummary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.particular}</td>
                                    <td>{item.totalCredit.toFixed(2)}</td>
                                    <td>{item.totalDebit.toFixed(2)}</td>
                                    <td>{item.balance.toFixed(2)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                navigate(adminRoute(`/ledger/particular/${item.particular.replace(/\s+/g, '-')}`))
                                            }
                                        >
                                            View Summary
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="fw-bold bg-light">
                                <td>Total</td>
                                <td>{summaryTotals.overallCredit?.toFixed(2)}</td>
                                <td>{summaryTotals.overallDebit?.toFixed(2)}</td>
                                <td>{summaryTotals.overallBalance?.toFixed(2)}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 🔸 Pagination */}
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="align-self-center">Page {currentPage} of {totalPages}</span>
                    <button
                        className="btn btn-sm btn-secondary ms-2"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            <CommonModal
                show={show403Modal}
                onHide={() => setShow403Modal(false)}
                title="Access Denied"
                type="access-denied"
                emoji="🚫"
            />
        </div>
    );
};

export default Ledger;
