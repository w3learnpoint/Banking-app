import React, { useEffect, useState } from 'react';
import { getRoles, deleteRole, downloadRoleCsv } from '../../api/role';
import { toast } from 'react-toastify';
import { sortByField, renderSortIcon } from '../../utils/sortUtils';
import CommonModal from '../../components/common/CommonModal';
import { fetchUserPermissions, hasPermission } from '../../utils/permissionUtils';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../../utils/router';
import { saveAs } from 'file-saver';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [userPermissions, setUserPermissions] = useState([]);
    const [show403Modal, setShow403Modal] = useState(false);
    const [deletingRole, setDeletingRole] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadUserPermissions = async () => {
            const permissions = await fetchUserPermissions();
            setUserPermissions(permissions || []);
        };
        loadUserPermissions();
        loadData();
    }, []);


    const loadData = async () => {
        try {
            const [roleRes] = await Promise.all([getRoles()]);
            setRoles(roleRes);
        } catch (err) {
            toast.error(err?.message);
        }
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredSortedRoles = sortByField(
        roles.filter(role => role.name.toLowerCase().includes(search.toLowerCase())),
        sortField,
        sortOrder
    );

    const handleDownloadCsv = async () => {
        try {
            const blob = await downloadRoleCsv();
            saveAs(blob, 'users.csv');
        } catch (err) {
            toast.error(err?.message || 'Failed to export roles');
        }
    };

    return (
        <div className="roles-wrapper px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 theme-text">Role List</h4>
                    <div className="d-flex gap-2">
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-control form-control-sm theme-input-sm"
                            />
                        </div>
                        <div>
                            {hasPermission(userPermissions, 'GET:/roles/export') && (
                                <button className='btn btn-md theme-btn-secondary' onClick={handleDownloadCsv}>Export CSV</button>
                            )}
                        </div>
                        <div>
                            <button className='btn btn-md theme-btn' onClick={() => {
                                if (!hasPermission(userPermissions, 'POST:/roles')) {
                                    setShow403Modal(true);
                                    return;
                                }
                                navigate(adminRoute(`/roles/create`))
                            }}>Create Role</button>
                        </div>


                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table theme-table table-bordered table-hover align-middle">
                        <thead className="table-light text-dark">
                            <tr>
                                <th>#</th>
                                <th onClick={() => handleSort('name')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Name</span>
                                        <span className="ms-2">{renderSortIcon('name', sortField, sortOrder)}</span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('roleType')}><div className="d-flex justify-content-between align-items-center">
                                    <span>Type</span>
                                    <span className="ms-2">{renderSortIcon('type', sortField, sortOrder)}</span>
                                </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Status</span>
                                    </div>
                                </th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSortedRoles.map((role, i) => (
                                <tr key={role._id}>
                                    <td>{i + 1}</td>
                                    <td>{role.name}</td>
                                    <td>{role.roleType}</td>
                                    <td><span className={`badge ${role.status ? 'bg-success' : 'bg-secondary'}`}>{role.status ? 'Active' : 'Inactive'}</span></td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => {
                                            if (!hasPermission(userPermissions, `GET:/roles/${role._id}`)) {
                                                setShow403Modal(true);
                                                return;
                                            }
                                            console.log(role)
                                            navigate(adminRoute(`/roles/view/${role?.roleType}`), {
                                                state: { permissions: role?.permissions, roleName: role?.name }
                                            })
                                        }}>View Permissions</button>
                                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => {
                                            if (!hasPermission(userPermissions, `PUT:/roles/${role._id}`)) {
                                                setShow403Modal(true);
                                                return;
                                            }
                                            navigate(adminRoute(`/roles/edit/${role._id}`))
                                        }}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => {
                                            if (!hasPermission(userPermissions, `DELETE:/roles/${role._id}`)) {
                                                setShow403Modal(true);
                                                return;
                                            }
                                            setDeletingRole(role);
                                        }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CommonModal
                show={show403Modal}
                onHide={() => setShow403Modal(false)}
                title="Access Denied"
                type="access-denied"
                emoji="🚫"
            />

            <CommonModal
                show={!!deletingRole}
                onHide={() => setDeletingRole(null)}
                title="Confirm Deletion"
                type="confirm-delete"
                emoji="🗑️"
                itemName={deletingRole?.name || 'this user'}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                    try {
                        toast.success('User deleted successfully.');
                        await deleteRole(deletingRole?._id);
                        await loadData();
                    } catch (err) {
                        toast.error(err?.message);
                    }
                    setDeletingRole(null);
                }}
            />
        </div>
    );
};

export default RoleManagement;

