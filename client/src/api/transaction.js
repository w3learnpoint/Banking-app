import { saveAs } from 'file-saver';
import API from './axios'; // Your axios instance

// ✅ Create a new transaction
export const createTransaction = async (data) => {
    try {
        const res = await API.post('/transactions', data);
        return res?.data?.data;
    } catch (err) {
        console.error('❌ Transaction creation failed:', err?.response?.data?.message);
        throw new Error(err?.response?.data?.message || 'Failed to create transaction');
    }
};

// ✅ Get all transactions for an account
export const getAllTransactions = async ({ page = 1, limit = 10, applicantName, type, accountType }) => {
    try {
        const res = await API.get('/transactions', {
            params: { page, limit, applicantName, type, accountType }
        });
        return res.data?.data;
    } catch (err) {
        throw new Error(err?.response?.data?.message || 'Failed to fetch transactions');
    }
};

// ✅ Export transactions to PDF or Excel
export const exportTransactions = async (format = 'excel', accountId = '') => {
    try {
        const res = await API.get('/transactions/export', {
            responseType: 'blob',
            params: {
                format,
                accountId
            }
        });

        const contentType = format === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        const blob = new Blob([res.data], { type: contentType });
        const filename = `transactions.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        saveAs(blob, filename);
    } catch (err) {
        console.error(`❌ Failed to export ${format}:`, err);
        throw new Error(`Failed to export ${format}`);
    }
};
