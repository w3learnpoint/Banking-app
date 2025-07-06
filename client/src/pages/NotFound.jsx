import React from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../utils/router';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="view-user-wrapper px-4 py-4 theme-bg d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card theme-card border-0 shadow p-5 text-center" style={{ maxWidth: '500px' }}>
                <h1 className="display-3 theme-text mb-3">404</h1>
                <h4 className="mb-3 text-muted">Page Not Found</h4>
                <p className="text-muted mb-4">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <button className="btn btn-md theme-btn" onClick={() => navigate(adminRoute('/dashboard'))}>
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default NotFound;
