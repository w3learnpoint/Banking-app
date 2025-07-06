import React, { useEffect, useState } from 'react';
import { getNotifications, markAsRead, deleteNotification } from '../../api/notification';
import { Badge } from 'react-bootstrap';
import CommonModal from '../../components/common/CommonModal';
import { toast } from 'react-toastify';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, [currentPage]);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications(currentPage, pageSize);
            setNotifications(res.data);
            setTotalPages(res.totalPages);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const toggleRead = async (id) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteNotification(selected._id);
            toast.success('Notification deleted');
            setSelected(null);
            fetchNotifications();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-3">
                <h4 className="theme-text mb-3">Notifications</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle theme-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((n, i) => (
                                <tr key={n._id}>
                                    <td>{(currentPage - 1) * pageSize + i + 1}</td>
                                    <td>{n.title}</td>
                                    <td>{n.body}</td>
                                    <td>
                                        <Badge bg={n.isRead ? 'secondary' : 'success'}>
                                            {n.isRead ? 'Read' : 'Unread'}
                                        </Badge>
                                    </td>
                                    <td>{new Date(n.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => toggleRead(n._id)}>
                                            {n.isRead ? 'Mark Unread' : 'Mark Read'}
                                        </button>{' '}
                                        <button className="btn btn-sm btn-outline-danger me-2" onClick={() => setSelected(n)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className="btn btn-sm btn-secondary me-2"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="align-self-center theme-text">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-sm btn-secondary ms-2"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <CommonModal
                show={!!selected}
                onHide={() => setSelected(null)}
                title="Confirm Deletion"
                type="confirm-delete"
                emoji="🗑️"
                itemName={selected?.title}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default NotificationList;