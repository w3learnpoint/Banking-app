import API from './axios';
import { toast } from 'react-toastify';

export const getPermissions = async () => {
    try {
        const res = await API.get('/permissions');
        return res.data.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to fetch permissions');
        return [];
    }
};

export const createPermission = async (data) => {
    try {
        const res = await API.post('/permissions', data);
        return res.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to create permission');
        throw err;
    }
};

export const getPermissionsByRole = async (roleType) => {
    try {
        const res = await API.get(`/permissions/${roleType}`);
        return res.data.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to get permissions by role');
        return [];
    }
};

export const getPermissionById = async (id) => {
    try {
        const res = await API.get(`/permissions/id/${id}`);
        return res.data.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to fetch permission');
        return null;
    }
};

export const updatePermission = async (id, data) => {
    try {
        const res = await API.put(`/permissions/${id}`, data);
        return res.data.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to update permission');
        throw err;
    }
};
