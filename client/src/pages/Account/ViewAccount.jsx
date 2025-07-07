import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserById } from '../../api/user';
import { getAccountDetailsByUser } from '../../api/accountDetails';
import { getNomineeByUser } from '../../api/nominee';

const ViewAccount = () => {
    const location = useLocation();
    const { user } = location.state || {};
    const [activeTab, setActiveTab] = useState('basic');
    const [userData, setUserData] = useState(null);
    const [account, setAccount] = useState(null);
    const [nominee, setNominee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            Promise.all([
                getUserById(user._id),
                getAccountDetailsByUser(user._id),
                getNomineeByUser(user._id)
            ])
                .then(([u, acc, nom]) => {
                    setUserData(u);
                    setAccount(acc);
                    setNominee(nom);
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user) return <div className="text-center text-danger mt-5">No user data provided.</div>;
    if (loading) return <div className="text-center mt-5">Loading account...</div>;

    const renderCard = (label, value) => (
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
        <div className="main-content py-4">
            <div className="container">
                <div className="card shadow-sm border-0 p-4">
                    <h4 className="theme-text mb-4">Account View</h4>

                    <ul className="nav nav-tabs mb-4">
                        {['basic', 'account', 'nominee'].map(tab => (
                            <li className="nav-item" key={tab}>
                                <button
                                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'basic' ? 'Basic Info' : tab === 'account' ? 'Account Details' : 'Nominee'}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="tab-content">
                        {activeTab === 'basic' && (
                            <div className="row">
                                {renderCard('Name', userData?.name)}
                                {renderCard('Email', userData?.email)}
                                {renderCard('Phone', userData?.phone)}
                                {renderCard('Date of Birth', userData?.dob ? new Date(userData?.dob).toLocaleDateString() : '-')}
                            </div>
                        )}
                        {activeTab === 'account' && (
                            account ? (
                                <div className="row">
                                    {renderCard('Account Number', account.accountNumber)}
                                    {renderCard('Branch', account.branch)}
                                    {renderCard('IFSC', account.ifsc)}
                                    {renderCard('Aadhar', account.aadhar)}
                                    {renderCard('Father/Husband Name', account.fatherOrHusbandName)}
                                    {renderCard('Guardian Name', account.guardianName)}
                                    {renderCard('Mobile', account.mobile)}
                                    {renderCard('Membership Number', account.membershipNumber)}
                                    {renderCard('Introducer Name', account.introducerName)}
                                    {renderCard('Deposit Amount', `₹${account.depositAmount}`)}
                                    {renderCard('Account Type', account.accountType)}
                                    {renderCard('Form Date', account.formDate ? new Date(account.formDate).toLocaleDateString() : '-')}

                                    {/* Address Fields */}
                                    {renderCard('Village', account.address?.village)}
                                    {renderCard('Post', account.address?.post)}
                                    {renderCard('Block', account.address?.block)}
                                    {renderCard('District', account.address?.district)}
                                    {renderCard('Pincode', account.address?.pincode)}
                                </div>
                            ) : (
                                <div className="text-muted">No account details available.</div>
                            )
                        )}
                        {activeTab === 'nominee' && (
                            nominee ? (
                                <div className="row">
                                    {renderCard('Name', nominee.name)}
                                    {renderCard('Relation', nominee.relation)}
                                    {renderCard('Age', nominee.age)}
                                    {renderCard('Mobile', nominee.mobile)}
                                </div>
                            ) : (
                                <div className="text-muted">No nominee available.</div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAccount;
