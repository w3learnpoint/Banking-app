import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { formatPermissionLabel } from '../../utils/permissionUtils';

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

const ViewPermissions = () => {
    const { roleType } = useParams();
    const location = useLocation();
    const { permissions = [], roleName = roleType } = location.state || {};
    if (!roleName) return <div className="text-center mt-5 text-danger">No role data provided.</div>;

    return (
        <div className="roles-wrapper px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 theme-text">Permissions for Role: {roleName}</h4>
                </div>

                {permissions?.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table theme-table table-bordered table-hover align-middle">
                            <thead className="table-light text-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Method</th>
                                    <th>Route</th>
                                    <th>Complete Path</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map((perm, index) => (
                                    <tr key={perm._id}>
                                        <td>{index + 1}</td>
                                        <td>{formatPermissionLabel(perm)}</td>
                                        <td>
                                            <span className={`badge bg-${getMethodColor(perm.method)}`}>
                                                {perm.method}
                                            </span>
                                        </td>
                                        <td>{perm.route}</td>
                                        <td>{perm.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-muted">No permissions assigned to this role.</p>
                )}
            </div>
        </div>
    );
};

export default ViewPermissions;
