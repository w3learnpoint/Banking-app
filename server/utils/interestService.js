import Account from '../models/Account.js';
import Ledger from '../models/Ledger.js';
import InterestRate from '../models/InterestRate.js';

export const applyInterestToAllAccounts = async () => {
    const interestRates = await InterestRate.find().lean();
    const accounts = await Account.find();

    const now = new Date();

    for (const account of accounts) {
        const rate = interestRates.find(r => r.accountType === account.accountType);
        if (!rate || !rate.monthlyRate) continue;

        const interestAmount = parseFloat(((account.balance * rate.monthlyRate) / 100).toFixed(2));
        if (interestAmount <= 0) continue;

        account.balance += interestAmount;
        await account.save();

        await Ledger.create({
            particulars: account.applicantName,
            transactionType: 'interest',
            amount: interestAmount,
            balance: account.balance,
            description: 'Monthly Interest Added',
            date: now,
            createdBy: 'Auto Interest',
        });
    }

    return { success: true, appliedTo: accounts.length };
};
