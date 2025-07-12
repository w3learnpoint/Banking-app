import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRoute } from '../../utils/router';


const Dashboard = () => {
    const navigate = useNavigate();


    useEffect(() => {
    }, []);

    return (
        <div className="dashboard-wrapper px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-3">
                <h4 className="theme-text mb-3">Dashboard</h4>
                <div className="row p-2">
                    <div className="col-md-4 mb-3">
                        <div className="card theme-card border-0 shadow p-3 p-5">
                            <h2 className="theme-text">Account Openings</h2>
                            <button
                                className="btn btn-sm theme-btn mt-4"
                                onClick={() => navigate(adminRoute('/accounts'))}
                            >
                                View More
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row p-2">
                    <div className="col-md-4 mb-3">
                        <div className="card theme-card border-0 shadow p-3 p-5">
                            <h2 className="theme-text">Opening Balance</h2>
                            <button
                                className="btn btn-sm theme-btn mt-4"
                                onClick={() => navigate(adminRoute('/opening-balance'))}
                            >
                                View More
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card theme-card border-0 shadow p-3 p-5">
                            <h2 className="theme-text">Closing Balance</h2>
                            {/* <h3>{totalUsers}</h3> */}
                            <button
                                className="btn btn-sm theme-btn mt-4"
                                onClick={() => navigate(adminRoute('/closing-balance'))}
                            >
                                View More
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card theme-card border-0 shadow p-3 p-5">
                            <h2 className="theme-text">Ledger</h2>
                            <button
                                className="btn btn-sm theme-btn mt-4"
                                onClick={() => navigate(adminRoute('/ledger'))}
                            >
                                View More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
