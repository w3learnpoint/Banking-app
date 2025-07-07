import API from './axios';

/**
 * Create a new user
 */
export const createUser = async (userData) => {
    try {
        const response = await API.post('/users', userData);
        return response.data.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

/**
 * Delete Profile Picture
 */
export const deleteProfilePic = async (userId) => {
    try {
        const response = await API.delete(`/users/${userId}/profile-pic`);
        return response.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

/**
 * Get paginated user list with optional filters
 */
export const getUsers = async ({ page = 1, limit = 10, search = '', role = '' }) => {
    try {
        const response = await API.get('/users', {
            params: { page, limit, search, role },
        });
        return {
            users: response.data.data.users,
            totalPages: response.data.data.totalPages,
            currentPage: response.data.data.currentPage,
            totalUsers: response.data.data.totalUsers,
        };
    } catch (error) {
        throw error?.response?.data || error;
    }
};

/**
 * Update a user by ID
 */
export const updateUser = async (userId, userData) => {
    try {
        const formData = new FormData();
        for (const key in userData) {
            if (key === 'profilePic' && userData[key] instanceof File) {
                formData.append('profilePic', userData[key]);
            } else {
                formData.append(key, userData[key]);
            }
        }
        const response = await API.put(`/users/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

/**
 * Get the profile of the logged-in user
 */
export const getProfile = async () => {
    try {
        const res = await API.get('/users/profile');
        return res.data.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

/**
 * Get a user by email ID
 */
export const getProfileByEmail = async (emailId) => {
    try {
        const res = await API.get(`/users/email/${emailId}`);
        return res.data.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

/**
 * Get a user by user ID
 */
export const getUserById = async (userId) => {
    try {
        const res = await API.get(`/users/id/${userId}`);
        return res.data.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

/**
 * Update the profile of the logged-in user
 */
export const updateProfile = async (userId, profileData) => {
    try {
        const formData = new FormData();
        // Clone to avoid mutating original profileData
        const clonedData = { ...profileData };

        // Ensure role is a plain ID (string)
        if (typeof clonedData.role === 'object' && clonedData.role?._id) {
            clonedData.role = clonedData.role._id;
        }

        for (const key in clonedData) {
            const value = clonedData[key];

            if (key === 'profilePic' && value instanceof File) {
                formData.append('profilePic', value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        }

        const res = await API.put(`/users/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};


/**
 * Change password for the logged-in user
 */
export const changePassword = async (data) => {
    try {
        const res = await API.patch('/users/change-password', data, {
            withCredentials: true,
        });
        return res.data?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// ✅ Delete a User
export const deleteUser = async (userId) => {
    try {
        const res = await API.delete(`/users/${userId}`);
        return res.data.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// ✅ Admin Change Password
export const adminChangeUserPassword = async (userId, newPassword) => {
    try {
        const res = await API.post(`/users/${userId}/change-password`, { newPassword });
        return res.data;
    } catch (err) {
        throw err?.response?.data || err;
    }
};

// ✅ Export users to CSV
export const downloadUserCsv = async () => {
    try {
        const response = await API.get('/users/export', {
            responseType: 'blob',
        });
        return response.data;
    } catch (err) {
        if (err?.response?.data) {
            try {
                const text = await err.response.data.text();
                const json = JSON.parse(text);
                throw new Error(json?.message || 'Server error occurred while exporting users');
            } catch (e) {
                throw new Error(e?.message || 'Failed to export user');
            }
        }

        throw new Error(err?.message || 'Failed to export user');
    }
};
