import React, { useEffect, useState } from 'react';
import { getUsers } from '../../api/user';
import { getAccountDetailsByUser } from '../../api/accountDetails';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../../utils/router';
import { toast } from 'react-toastify';
import { sortByField, renderSortIcon } from '../../utils/sortUtils';
import { fetchUserPermissions, hasPermission } from '../../utils/permissionUtils';
import CommonModal from '../../components/common/CommonModal';

const Accounts = () => {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [accountDetailsMap, setAccountDetailsMap] = useState({});
    const [userPermissions, setUserPermissions] = useState([]);
    const [show403Modal, setShow403Modal] = useState(false);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const usersPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            try {
                const permissions = await fetchUserPermissions();
                setUserPermissions(permissions || []);
            } catch (err) {
                console.error('Failed to load user permissions', err);
            }
        };

        initialize();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, query]);


    const fetchUsers = async () => {
        try {
            const res = await getUsers({ page: currentPage, limit: usersPerPage, search: query });
            setUsers(res.users);
            setTotalPages(res.totalPages);
            fetchAccountDetailsForUsers(res.users);
        } catch (err) {
            toast.error(err?.message || 'Failed to fetch users');
        }
    };

    const fetchAccountDetailsForUsers = async (usersList) => {
        const map = {};
        for (const user of usersList) {
            try {
                const details = await getAccountDetailsByUser(user._id);
                map[user._id] = details;
            } catch {
                map[user._id] = null;
            }
        }
        setAccountDetailsMap(map);
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const sortedUsers = sortByField(users, sortField, sortOrder);

    return (
        <div className="px-4 py-4">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 theme-text">Account Details</h4>
                    <div className="d-flex gap-2">
                        <div>
                            <input
                                type="text"
                                className="form-control form-control-sm theme-input-sm"
                                placeholder="Search user..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = `/sample-templates/account-import-template.csv`;
                                    link.download = 'account-import-template.xlsx';
                                    link.click();
                                }}
                            >
                                📥 Download Template
                            </button>
                        </div>

                        {/* NEW BUTTON: Import Accounts */}
                        <div>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                    if (!hasPermission(userPermissions, 'POST:/accounts')) {
                                        setShow403Modal(true);
                                        return;
                                    }
                                    navigate(adminRoute('/account/import'));
                                }}
                            >
                                📤 Import
                            </button>
                        </div>
                        <div>
                            <button
                                className="btn btn-md btn-primary"
                                onClick={() => {
                                    if (!hasPermission(userPermissions, 'POST:/accounts')) {
                                        setShow403Modal(true);
                                        return;
                                    }
                                    navigate(adminRoute('/account/create'))
                                }
                                }
                            >
                                + Create Account
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table theme-table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th onClick={() => handleSort('name')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Name</span>
                                        {renderSortIcon('name', sortField, sortOrder)}
                                    </div>
                                </th>
                                <th>Email</th>
                                <th>Account Number</th>
                                <th>Branch</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user, index) => {
                                const account = accountDetailsMap[user._id];
                                return (
                                    <tr key={user._id}>
                                        <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{account?.accountNumber || '-'}</td>
                                        <td>{account?.branch || '-'}</td>
                                        <td className="text-center">
                                            {user.role?.roleType !== 'admin' && user.role?.roleType !== 'superadmin' ? (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-info me-2"
                                                        onClick={() => {
                                                            if (!hasPermission(userPermissions, `GET:/accounts/${user._id}`)) {
                                                                setShow403Modal(true);
                                                                return;
                                                            }
                                                            navigate(adminRoute(`/account/view/${user._id}`), { state: { user, account } })
                                                        }
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => {
                                                            if (!hasPermission(userPermissions, 'POST:/accounts')) {
                                                                setShow403Modal(true);
                                                                return;
                                                            }
                                                            navigate(adminRoute(`/account/edit/${user._id}`), { state: { user, account } })
                                                        }
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-muted">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                    <span className="align-self-center">Page {currentPage} of {totalPages}</span>
                    <button className="btn btn-sm btn-secondary ms-2" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
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

export default Accounts;
