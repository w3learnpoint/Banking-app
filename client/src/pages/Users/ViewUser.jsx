import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewUser = () => {
    const location = useLocation();
    const { user } = location.state || {};

    if (!user) return <div className="text-center mt-5 text-danger">No user data provided.</div>;

    const renderField = (label, value) => (
        <div className="col-md-6 mb-3">
            <div className="card shadow-sm border-0">
                <div className="card-body py-2 px-3">
                    <h6 className="mb-1 text-muted">{label}</h6>
                    <p className="mb-0 fw-semibold">{value || '-'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="view-user-wrapper px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-4">
                <h4 className="theme-text mb-4">User Details</h4>
                <div className="row">
                    {renderField('Name', user.name)}
                    {renderField('Email', user.email)}
                    {renderField('Phone', user.phone)}
                    {renderField('Date of Birth', user.dob ? new Date(user.dob).toLocaleDateString() : '-')}
                    {renderField('Role', user.role?.name)}
                    {renderField('Status', (
                        <span className={`badge ${user.status ? 'bg-success' : 'bg-secondary'}`}>
                            {user.status ? 'Active' : 'Inactive'}
                        </span>
                    ))}
                    {renderField('Created At', new Date(user.createdAt).toLocaleString())}
                    {renderField('Updated At', new Date(user.updatedAt).toLocaleString())}
                </div>
            </div>
        </div>
    );
};

export default ViewUser;
