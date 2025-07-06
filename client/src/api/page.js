import API from './axios';

// ✅ Create a new page
export const createPage = async (data) => {
    try {
        const res = await API.post('/pages', data);
        return res.data?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// ✅ Get all pages
export const getPages = async () => {
    try {
        const res = await API.get('/pages');
        return res.data?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// ✅ Get a page by its MongoDB ID
export const getPageById = async (id) => {
    try {
        const res = await API.get(`/pages/${id}`);
        return res.data?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// ✅ Get a page by its slug (for public view)
export const getPageBySlug = async (slug) => {
    try {
        const res = await API.get(`/pages/slug/${slug}`);
        return res.data?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// ✅ Update a page by ID
export const updatePage = async (id, data) => {
    try {
        const res = await API.put(`/pages/${id}`, data);
        return res.data?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// ✅ Delete a page by ID
export const deletePage = async (id) => {
    try {
        const res = await API.delete(`/pages/${id}`);
        return res.data?.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};
