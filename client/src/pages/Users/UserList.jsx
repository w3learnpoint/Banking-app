import React, { useEffect, useState } from 'react';
import { adminChangeUserPassword, deleteUser, downloadUserCsv, getUsers } from '../../api/user';
import { getRoles } from '../../api/role';
import { toast } from 'react-toastify';
import { sortByField, renderSortIcon } from '../../utils/sortUtils';
import CommonModal from '../../components/common/CommonModal';
import { fetchUserPermissions, hasPermission } from '../../utils/permissionUtils';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../../utils/router';
import { saveAs } from 'file-saver';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [roles, setRoles] = useState([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deletingUser, setDeletingUser] = useState(null);
    const usersPerPage = 5;
    const currentUserEmail = JSON.parse(localStorage.getItem('user'))?.email;
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [userPermissions, setUserPermissions] = useState([]);
    const [show403Modal, setShow403Modal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => { fetchUsers(); }, [currentPage, query, roleFilter]);
    useEffect(() => {
        const initialize = async () => {
            try {
                const roles = await getRoles();
                setRoles(roles);
            } catch (err) {
                console.error('Failed to load roles', err);
            }

            try {
                const permissions = await fetchUserPermissions();
                setUserPermissions(permissions || []);
            } catch (err) {
                console.error('Failed to load user permissions', err);
            }
        };

        initialize();
    }, []);


    const fetchUsers = async () => {
        try {
            const res = await getUsers({ page: currentPage, limit: usersPerPage, search: query, role: roleFilter });
            setUsers(res.users);
            setTotalPages(res.totalPages);
        } catch (err) {
            toast.error(err?.message);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleDownloadCsv = async () => {
        try {
            const blob = await downloadUserCsv();
            saveAs(blob, 'users.csv');
        } catch (err) {
            toast.error('Failed to export CSV');
        }
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedUsers = sortByField(users, sortField, sortOrder);

    return (
        <div className="user-list-wrapper px-4 py-4">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 theme-text">User List</h4>
                    <div className="d-flex gap-2">
                        <div>
                            <input
                                type="text"
                                className="form-control form-control-md theme-input-sm"
                                placeholder="Search users..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className="form-select select2 form-control-md theme-input-sm"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                {roles.map((role) => (
                                    <option key={role._id} value={role._id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            {hasPermission(userPermissions, 'GET:/users/export') && (
                                <button className='btn btn-md theme-btn-secondary'
                                    onClick={handleDownloadCsv}
                                >
                                    Export CSV
                                </button>
                            )}
                        </div>
                        <div>
                            <button
                                className="btn btn-md theme-btn"
                                onClick={() => {
                                    if (!hasPermission(userPermissions, 'POST:/users')) {
                                        setShow403Modal(true);
                                        return;
                                    }
                                    navigate(adminRoute('/users/create'));
                                }}
                            >
                                Create User
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table theme-table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>#</span>
                                        <span className="ms-2">{renderSortIcon('#', sortField, sortOrder)}</span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('name')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Name</span>
                                        <span className="ms-2">{renderSortIcon('name', sortField, sortOrder)}</span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('email')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Email</span>
                                        <span className="ms-2">{renderSortIcon('email', sortField, sortOrder)}</span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('role')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Role</span>
                                        <span className="ms-2">{renderSortIcon('role', sortField, sortOrder)}</span>
                                    </div>
                                </th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user, index) => (
                                <tr key={user?._id}>
                                    <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                    <td>{user?.name}</td>
                                    <td>{user?.email}</td>
                                    <td>{user?.role?.name}</td>
                                    <td>
                                        <span className={`badge ${user.status ? 'bg-success' : 'bg-secondary'}`}>
                                            {user.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {user.email !== currentUserEmail ? (
                                            <>
                                                <button className="btn btn-sm btn-outline-info me-2"
                                                    onClick={() => navigate(adminRoute(`/users/view/${user.name}`), {
                                                        state: { user }
                                                    })}>
                                                    View
                                                </button>
                                                <button className="btn btn-sm btn-outline-secondary me-2"
                                                    onClick={() => {
                                                        if (!hasPermission(userPermissions, `PUT:/users/${user?._id}`)) {
                                                            setShow403Modal(true);
                                                            return;
                                                        }
                                                        navigate(adminRoute(`/users/edit/${user._id}`))
                                                    }}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger me-2"
                                                    onClick={() => {
                                                        if (!hasPermission(userPermissions, `DELETE:/users/${user?._id}`)) {
                                                            setShow403Modal(true);
                                                            return;
                                                        }
                                                        setDeletingUser(user);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-warning me-2"
                                                    onClick={() => {
                                                        if (!hasPermission(userPermissions, `POST:/users/${user._id}/change-password`)) {
                                                            setShow403Modal(true);
                                                            return;
                                                        }
                                                        setSelectedUser(user);
                                                        setShowChangePasswordModal(true);
                                                    }}
                                                >
                                                    Change Password
                                                </button>
                                            </>
                                        ) : (
                                            <span className="theme-text-muted small fst-italic">Self</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center theme-text-muted">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span className="align-self-center theme-text">
                        Page {currentPage} of {totalPages}
                    </span>
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
                show={!!deletingUser}
                onHide={() => setDeletingUser(null)}
                title="Confirm Deletion"
                type="confirm-delete"
                emoji="🗑️"
                itemName={deletingUser?.name || 'this user'}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                    try {
                        toast.success('User deleted successfully.');
                        await deleteUser(deletingUser?._id);
                        await fetchUsers();
                    } catch (err) {
                        toast.error(err?.message);
                    }
                    setDeletingUser(null);
                }}
            />

            <CommonModal
                show={showChangePasswordModal}
                onHide={() => {
                    setShowChangePasswordModal(false);
                    setNewPassword('');
                    setSelectedUser(null);
                }}
                title={`Change Password for ${selectedUser?.name}`}
                confirmText="Update"
                confirmVariant="warning"
                onConfirm={async () => {
                    try {
                        if (!newPassword || newPassword.length < 6) {
                            toast.error('Password must be at least 6 characters');
                            return;
                        }
                        await adminChangeUserPassword(selectedUser._id, newPassword);
                        toast.success('Password updated');
                    } catch (err) {
                        toast.error(err.message || 'Failed to update password');
                    } finally {
                        setShowChangePasswordModal(false);
                        setNewPassword('');
                    }
                }}
            >
                <div>
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                </div>
            </CommonModal>


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

export default UserList;