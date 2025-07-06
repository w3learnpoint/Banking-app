import React, { useEffect, useState } from 'react';
import { getMessages, replyMessage, toggleReadMessage, deleteMessage } from '../../api/message';
import CommonModal from '../../components/common/CommonModal';
import { Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

const MessageList = () => {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [reply, setReply] = useState('');
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [deletingMsg, setDeletingMsg] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, [currentPage]);

    const fetchMessages = async () => {
        try {
            const res = await getMessages(currentPage, pageSize);
            setMessages(res.data);
            setTotalPages(res.totalPages);
        } catch (err) {
            toast.error('Failed to fetch messages');
        }
    };

    const toggleRead = async (id) => {
        try {
            await toggleReadMessage(id);
            fetchMessages();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const sendReply = async () => {
        try {
            await replyMessage(selectedMsg._id, reply);
            toast.success('Reply sent');
            setReply('');
            setShowReplyModal(false);
        } catch (err) {
            toast.error('Failed to send reply');
        }
    };

    return (
        <div className="px-4 py-4 theme-bg">
            <div className="card theme-card border-0 shadow p-3">
                <h4 className="theme-text mb-3">Messages</h4>
                <div className="table-responsive">
                    <table className="table theme-table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Sender</th>
                                <th>Text</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((m, i) => (
                                <tr key={m._id}>
                                    <td>{(currentPage - 1) * pageSize + i + 1}</td>
                                    <td>{m.fromUser?.name || 'Unknown'}</td>
                                    <td>{m.content}</td>
                                    <td>
                                        <Badge bg={m.isRead ? 'secondary' : 'success'}>
                                            {m.isRead ? 'Read' : 'Unread'}
                                        </Badge>
                                    </td>
                                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-success me-2"
                                            onClick={() => {
                                                setSelectedMsg(m);
                                                setShowReplyModal(true);
                                            }}
                                        >
                                            Reply
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => toggleRead(m._id)}
                                        >
                                            {m.isRead ? 'Mark Unread' : 'Mark Read'}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger me-2"
                                            onClick={() => {
                                                setDeletingMsg(m);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-end gap-2">
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

            {/* Reply Modal */}
            <CommonModal
                show={showReplyModal}
                onHide={() => {
                    setShowReplyModal(false);
                    setReply('');
                }}
                title={`Reply to ${selectedMsg?.fromUser?.name || 'User'}`}
                confirmText="Send Reply"
                confirmVariant="success"
                onConfirm={sendReply}
            >
                <div>
                    <label className="form-label">Reply Message</label>
                    <textarea
                        className="form-control"
                        rows={4}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your reply..."
                    />
                </div>
            </CommonModal>

            {/* Delete Confirmation */}
            <CommonModal
                show={!!deletingMsg}
                onHide={() => setDeletingMsg(null)}
                title="Confirm Deletion"
                type="confirm-delete"
                emoji="🗑️"
                itemName={deletingMsg?.content || 'this message'}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                    try {
                        toast.success('Message deleted successfully.');
                        await deleteMessage(deletingMsg?._id);
                        await fetchMessages();
                    } catch (err) {
                        toast.error(err?.message || 'Failed to delete message');
                    }
                    setDeletingMsg(null);
                }}
            />

        </div>
    );
};

export default MessageList;
