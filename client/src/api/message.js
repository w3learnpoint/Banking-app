import API from './axios';

export const getMessages = async (page = 1, limit = 10) => {
    try {
        const res = await API.get(`/messages?page=${page}&limit=${limit}`);
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch messages');
    }
};

export const getUnreadMessages = async () => {
    try {
        const res = await API.get('/messages?unreadOnly=true');
        return res.data?.data || [];
    } catch (err) {
        console.error("Failed to fetch unread messages:", err);
        return [];
    }
};

export const toggleReadMessage = async (id) => {
    try {
        return await API.patch(`/messages/${id}/read`);
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to toggle read status');
    }
};

export const replyMessage = async (id, reply) => {
    try {
        return await API.post(`/messages/${id}/reply`, { reply });
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to send reply');
    }
};

export const deleteMessage = async (id) => {
    try {
        return await API.delete(`/messages/${id}`);
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to delete message');
    }
};
