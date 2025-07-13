import Transaction from "../models/Transaction.js";
import Ledger from "../models/Ledger.js";

export const createTransactionAndLedger = async ({ account, type, amount, description, date, createdBy }) => {
    const parsedAmount = parseFloat(amount);

    // ✅ Create transaction
    const tx = await Transaction.create({
        accountId: account._id,
        type,
        amount: parsedAmount,
        description,
        date,
    });

    // 🧮 Update account balance
    account.balance = type === 'deposit'
        ? account.balance + parsedAmount
        : account.balance - parsedAmount;

    await account.save();

    // 🧾 Create corresponding ledger entry
    await Ledger.create({
        particulars: account.applicantName,
        transactionType: type, // reverse
        amount: parsedAmount,
        balance: account.balance,
        description,
        date,
        createdBy,
    });

    return tx;
};
