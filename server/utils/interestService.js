import Account from '../models/Account.js';
import Ledger from '../models/Ledger.js';
import InterestRate from '../models/InterestRate.js';

export const applyInterestToAllAccounts = async () => {
    try {
        const interestRates = await InterestRate.find().lean();
        const accounts = await Account.find();

        const now = new Date();

        for (const account of accounts) {
            // ⛔ Skip auto-created accounts
            if (account.accountType === 'Auto-Created') {
                console.log(`⚠️ Skipped Auto-Created account: ${account.accountNumber}`);
                continue;
            }

            const rate = interestRates.find(r => r.accountType === account.accountType);
            const monthlyRate = rate?.rate || 0;

            if (!rate || !monthlyRate) continue;

            const interestAmount = parseFloat(((account.balance * monthlyRate) / 100).toFixed(2));
            if (interestAmount <= 0) continue;

            account.balance += interestAmount;
            const upd = await account.save();

            await Ledger.create({
                accountId: account._id,
                particulars: account.applicantName || 'Unnamed',
                transactionType: 'interest',
                amount: interestAmount,
                balance: account.balance,
                description: 'Monthly Interest Added',
                date: now,
                createdBy: 'Auto Interest',
            });
        }

        return { success: true, appliedTo: accounts.length };
    }
    catch (err) {
        console.error("❌ Error applying interest:", err);
        throw new Error("Failed to apply interest");
    }

};
