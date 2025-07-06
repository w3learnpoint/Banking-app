import API from './axios';

// ✅ GET /nominees/:userId — fetch nominee(s) by user ID
export const getNomineeByUser = async (userId) => {
    try {
        const res = await API.get(`/nominees/${userId}`);
        const data = res?.data?.data;

        // Return the first nominee if multiple are returned (as per your current UI use case)
        return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch nominee');
    }
};

// ✅ POST /nominees — create nominee
export const createNominee = async (userId, nominee) => {
    try {
        const payload = { ...nominee, user: userId };
        const res = await API.post(`/nominees`, payload);
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to create nominee');
    }
};

// ✅ PUT /nominees/:id — update nominee
export const updateNominee = async (id, nominee) => {
    try {
        const res = await API.put(`/nominees/${id}`, nominee);
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to update nominee');
    }
};

// ✅ DELETE /nominees/:id — delete nominee
export const deleteNominee = async (id) => {
    try {
        const res = await API.delete(`/nominees/${id}`);
        return res?.data?.message;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to delete nominee');
    }
};
