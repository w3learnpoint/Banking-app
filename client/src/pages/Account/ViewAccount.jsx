// ... (existing imports)
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAccountDetailsByUser } from '../../api/account';

const ViewAccount = () => {
    const location = useLocation();
    const { accountData } = location.state || {};
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (accountData?._id) {
            getAccountDetailsByUser(accountData._id)
                .then((result) => setAccount(result))
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading) return <div className="text-center mt-5">Loading account details...</div>;

    const renderCard = (label, value) => (
        <div className="col-md-6 mb-3" key={label}>
            <div className="card shadow-sm border-0">
                <div className="card-body py-2 px-3">
                    <h6 className="mb-1 text-muted">{label}</h6>
                    <p className="mb-0 fw-semibold">{value || '-'}</p>
                </div>
            </div>
        </div>
    );

    const renderImage = (label, path) => (
        <div className="col-md-6 mb-3" key={label}>
            <div className="card shadow-sm border-0">
                <div className="card-body py-3 px-3 text-center">
                    <h6 className="text-muted mb-2">{label}</h6>
                    <img
                        src={path ? path : ''}
                        alt={label}
                        style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain', border: '1px solid #ddd', padding: '5px' }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="main-content py-4">
            <div className="container">
                <div className="card shadow-sm border-0 p-4">
                    <h4 className="theme-text mb-4">Account Details</h4>

                    {account ? (
                        <div className="row">
                            {renderCard('Account Number', account.accountNumber)}
                            {renderCard('Branch', account.branch)}
                            {renderCard('Aadhar', account.aadhar)}
                            {renderCard('Father/Husband Name', account.fatherOrHusbandName)}
                            {renderCard('Guardian Name', account.relation)}
                            {renderCard('Mobile', account.phone)}
                            {renderCard('Membership Number', account.membershipNumber)}
                            {renderCard('Introducer Name', account.introducerName)}
                            {renderCard('Deposit Amount', `₹${account.depositAmount}`)}
                            {renderCard('Account Type', account.accountType)}
                            {renderCard('Form Date', account.formDate ? new Date(account.formDate).toLocaleDateString() : '-')}
                            {renderCard('Account Open Date', account.accountOpenDate ? new Date(account.accountOpenDate).toLocaleDateString() : '-')}
                            {renderCard('Occupation', account.occupation)}
                            {renderCard('Manager Name', account.managerName)}
                            {renderCard('Lekhpal/Rokapal', account.lekhpalOrRokapal)}
                            {renderCard('Village', account.address?.village)}
                            {renderCard('Post', account.address?.post)}
                            {renderCard('Block', account.address?.block)}
                            {renderCard('District', account.address?.district)}
                            {renderCard('State', account.address?.state)}
                            {renderCard('Pincode', account.address?.pincode)}

                            {/* Image fields */}
                            {renderImage('profile Image', account.profileImage)}
                            {renderImage('Signature', account.signaturePath)}
                            {renderImage('Verifier Signature', account.verifierSignaturePath)}
                        </div>
                    ) : (
                        <div className="text-muted">No account details available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewAccount;
