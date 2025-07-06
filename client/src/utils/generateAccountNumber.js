import AccountDetails from '../models/AccountDetails.js';

export const getNextAccountNumber = async () => {
    const latest = await AccountDetails.findOne().sort({ accountNumber: -1 });
    if (latest && latest.accountNumber) {
        return String(Number(latest.accountNumber) + 1);
    } else {
        return '10500801'; // starting account number
    }
};