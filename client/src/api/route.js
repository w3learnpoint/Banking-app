import API from './axios';

export const getAllRoutes = async () => {
    try {
        const res = await API.get('/routes');
        return res.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch role');
    }
};