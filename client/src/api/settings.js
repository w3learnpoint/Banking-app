import API from './axios';

export const fetchUserSettings = async () => {
    try {
        const res = await API.get('/settings');
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to user settings');
    }
};

export const updateUserSettings = async (payload) => {
    try {
        const res = await API.post('/settings', payload);
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to user settings');
    }
};
