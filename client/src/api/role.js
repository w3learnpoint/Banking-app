import API from './axios';

// ✅ GET all roles
export const getRoles = async () => {
    try {
        const res = await API.get('/roles');
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch roles');
    }
};

// ✅ GET role by ID
export const getRoleById = async (roleId) => {
    try {
        const res = await API.get(`/roles/${roleId}`);
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch role');
    }
};

// ✅ CREATE role
export const createRole = async (payload) => {
    try {
        const res = await API.post('/roles', payload);
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to create role');
    }
};

// ✅ UPDATE role
export const updateRole = async (roleId, payload) => {
    try {
        const res = await API.put(`/roles/${roleId}`, payload);
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to update role');
    }
};

// ✅ DELETE role
export const deleteRole = async (roleId) => {
    try {
        const res = await API.delete(`/roles/${roleId}`);
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to delete role');
    }
};

export const downloadRoleCsv = async () => {
    try {
        const response = await API.get('/roles/export', {
            responseType: 'blob', // Important!
        });
        return response.data;
    } catch (err) {
        if (err?.response?.data) {
            try {
                // If it's a blob, extract text and parse error message
                const text = await err.response.data.text();
                const json = JSON.parse(text);
                throw new Error(json?.message || 'Server error occurred while exporting roles');
            } catch (e) {
                throw new Error(e?.message || 'Failed to export roles');
            }
        }

        // Fallback for other unexpected errors
        throw new Error(err?.message || 'Failed to export roles');
    }
};
