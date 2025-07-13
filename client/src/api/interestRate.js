import API from './axios';

export const createInterest = async () => {
    try {
        const res = await API.post('/interest/apply-monthly-interest');
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch messages');
    }
};