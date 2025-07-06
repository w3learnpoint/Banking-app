import React, { useState } from 'react';
import CommonModal from '../../components/common/CommonModal';

const PermissionList = ({ permissions = [], role }) => {
    const [showModal, setShowModal] = useState(false);
    const previewCount = 3;
    const hasMore = permissions.length > previewCount;

    return (
        <>
            <ul className="mb-0 ps-2">
                {permissions.slice(0, previewCount).map((p, idx) => (
                    <li key={idx}>
                        <code className="small">{p}</code>
                    </li>
                ))}
                {hasMore && (
                    <li className="small">
                        <button
                            className="btn btn-link p-0 small"
                            onClick={() => setShowModal(true)}
                        >
                            +{permissions.length - previewCount} more
                        </button>
                    </li>
                )}
            </ul>

            <CommonModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={`${role} Permissions`}
                body={
                    <ul className="ps-3 mb-0">
                        {permissions.map((perm, idx) => (
                            <li key={idx}><code>{perm}</code></li>
                        ))}
                    </ul>
                }
                footer={false}
            />
        </>
    );
};

export default PermissionList;
