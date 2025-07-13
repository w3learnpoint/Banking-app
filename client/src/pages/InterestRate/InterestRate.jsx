import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createInterest } from '../../api/interestRate';
import CommonModal from '../../components/common/CommonModal';

const InterestTrigger = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleApplyInterest = async () => {
        setLoading(true);
        try {
            const res = await createInterest(); // ✅ invoke function
            toast.success(`Interest applied: ${res?.updatedCount} accounts`);
        } catch (err) {
            toast.error('Failed to apply interest');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <button
                className="btn btn-lg btn-success"
                onClick={() => setShowModal(true)}
                disabled={loading}
            >
                {loading ? 'Applying...' : 'Apply Monthly Interest'}
            </button>

            <CommonModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title="Confirm Interest Application"
                body="Are you sure you want to apply monthly interest to all eligible accounts?"
                onConfirm={handleApplyInterest}
                confirmText="Yes, Apply"
                cancelText="Cancel"
                loading={loading}
            />
        </div>
    );
};

export default InterestTrigger;
