import React, { useState } from 'react';
import BasicInfoTab from './BasicInfoTab';
import AccountDetailsTab from './AccountDetailsTab';
import NomineeTab from './NomineeTab';

const EditAccount = () => {
    const [activeTab, setActiveTab] = useState('basic');
    const [userId, setUserId] = useState(null);

    const goToNextTab = () => {
        if (activeTab === 'basic') setActiveTab('account');
        else if (activeTab === 'account') setActiveTab('nominee');
    };

    return (
        <div className="main-content py-4">
            <div className="container">
                <div className="card theme-card p-4 shadow-sm">
                    <h4 className="theme-text mb-4">Account Section</h4>

                    <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                                onClick={() => setActiveTab('basic')}
                            >
                                Basic Info
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={() => setActiveTab('account')}
                            >
                                Account Details
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'nominee' ? 'active' : ''}`}
                                onClick={() => setActiveTab('nominee')}
                            >
                                Nominee
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        <div className={activeTab === 'basic' ? '' : 'd-none'}>
                            <BasicInfoTab onNext={goToNextTab} setUserId={setUserId} />
                        </div>
                        <div className={activeTab === 'account' ? '' : 'd-none'}>
                            <AccountDetailsTab userId={userId} onNext={goToNextTab} />
                        </div>
                        <div className={activeTab === 'nominee' ? '' : 'd-none'}>
                            <NomineeTab userId={userId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAccount;
