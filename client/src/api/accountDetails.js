import API from './axios';

export const getAccountDetailsByUser = async (userId) => {
    try {
        const res = await API.get(`/accounts/${userId}`);
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch account details');
    }
};

export const upsertAccountDetails = async (details) => {
    try {
        const res = await API.post(`/accounts`, details);
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to save account details');
    }
};