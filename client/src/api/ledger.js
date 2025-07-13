import API from './axios';

// 🔹 Create or Update a Ledger Entry
export const upsertLedgerEntry = async (entry) => {
    try {
        const res = await API.post('/ledger', entry); // Updated to match correct route
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to save ledger entry');
    }
};

// 🔹 Get ledger entry by ID (for editing or viewing a single entry)
export const getLedgerById = async (ledgerId) => {
    try {
        const res = await API.get(`/ledger/${ledgerId}`);
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch ledger entry');
    }
};

// 🔹 Admin: Get all ledger entries (paginated + optional filters)
export const getAllLedgers = async (params) => {
    try {
        const res = await API.get('/ledger', { params });
        return res.data.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch ledger entries');
    }
};

// 🔹 Delete a ledger entry by ID
export const deleteLedgerEntry = async (ledgerId) => {
    try {
        const res = await API.delete(`/ledger/${ledgerId}`);
        return res?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to delete ledger entry');
    }
};

// 🔹 Import CSV (optional, for admin panel bulk uploads)
export const importLedgerCSV = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await API.post('/ledger/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res?.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to import ledger CSV');
    }
};
