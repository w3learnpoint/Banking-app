import React, { useEffect, useState } from 'react';
import { getPermissions } from '../../api/permission';
import { Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { sortByField, renderSortIcon } from '../../utils/sortUtils';
import CommonModal from '../../components/common/CommonModal';
import { fetchUserPermissions, formatPermissionLabel, hasPermission } from '../../utils/permissionUtils';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../../utils/router';

const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [userPermissions, setUserPermissions] = useState([]);
    const [show403Modal, setShow403Modal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => { loadPermissions(); }, []);
    useEffect(() => {
        const loadUserPermissions = async () => {
            const permissions = await fetchUserPermissions();
            setUserPermissions(permissions || []);
        };
        loadUserPermissions();
    }, []);

    const loadPermissions = async () => {
        try {
            const res = await getPermissions();
            setPermissions(res);
        } catch (err) {
            toast.error(err?.message);
        }
    };

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const getMethodColor = (method) => {
        switch (method) {
            case 'GET': return 'info';
            case 'POST': return 'success';
            case 'PUT': return 'warning';
            case 'PATCH': return 'secondary';
            case 'DELETE': return 'danger';
            default: return 'light';
        }
    };

    const filteredSortedPermissions = sortByField(
        permissions.filter(p => formatPermissionLabel(p).toLowerCase().includes(search.toLowerCase())),
        sortField,
        sortOrder
    );

    return (
        <div className="permission-wrapper px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 theme-text">Permissions</h4>
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
                            <button className='btn btn-md theme-btn' onClick={() => {
                                if (!hasPermission(userPermissions, 'POST:/permissions')) {
                                    setShow403Modal(true);
                                    return;
                                }
                                navigate(adminRoute('/permissions/create'))
                            }} size="sm">Create</button>
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
                                <th onClick={() => handleSort('method')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Method</span>
                                        <span className="ms-2">{renderSortIcon('method', sortField, sortOrder)}</span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort('route')}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Route</span>
                                        <span className="ms-2">{renderSortIcon('route', sortField, sortOrder)}</span>
                                    </div>
                                </th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSortedPermissions.map((perm, i) => (
                                <tr key={perm._id}>
                                    <td>{i + 1}</td>
                                    <td>{formatPermissionLabel(perm)}</td>
                                    <td><Badge bg={getMethodColor(perm.method)}>{perm.method}</Badge></td>
                                    <td>{perm.route}</td>
                                    <td><span className={`badge ${perm.status ? 'bg-success' : 'bg-secondary'}`}>{perm.status ? 'Active' : 'Inactive'}</span></td>
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
        </div>
    );
};

export default PermissionManagement;