import fs from "fs";
import csv from "csv-parser";
import Ledger from "../models/Ledger.js";
import {
    successResponse,
    errorResponse,
    badRequestResponse,
    notFoundResponse
} from "../utils/response.js";
import Account from "../models/Account.js";
import { generateNextAccountNumber } from "./accountController.js";

// ✅ Create or Update (Upsert) Ledger
export const upsertLedger = async (req, res) => {
    try {
        const {
            ledgerId,
            particulars,
            transactionType,
            amount,
            description,
            date,
            createdBy,
        } = req.body;

        if (!particulars || !transactionType || !amount) {
            return badRequestResponse(res, 400, "Required fields missing");
        }

        const amt = parseFloat(amount);

        // 🔍 Try to find existing account
        let account = await Account.findOne({ applicantName: particulars });

        // 🔁 If no account, create one
        if (!account) {
            const newAccountNumber = await generateNextAccountNumber();
            const initBalance = transactionType === 'debit' ? amt : 0;

            account = await Account.create({
                applicantName: particulars,
                accountNumber: newAccountNumber,
                balance: initBalance,
                accountType: 'Auto-Created',
                branch: 'Auto',
                accountOpenDate: date || new Date(),
            });
        } else {
            // ✅ Update existing account balance
            if (transactionType === 'debit') {
                account.balance += amt;
            } else if (transactionType === 'credit') {
                if (account.balance <= 0 || account.balance < amt) {
                    return badRequestResponse(res, 400, "Insufficient balance for debit transaction");
                }
                account.balance -= amt;
            }

            await account.save();
        }

        // 💾 Save ledger entry
        const payload = {
            particulars,
            transactionType,
            amount: amt,
            balance: account.balance,
            description,
            date: date || new Date(),
            createdBy: createdBy || req.user?.name || 'Manual Entry',
        };

        let entry;
        if (ledgerId) {
            entry = await Ledger.findByIdAndUpdate(ledgerId, payload, { new: true });
            if (!entry) return notFoundResponse(res, 404, "Ledger entry not found");
        } else {
            entry = await Ledger.create(payload);
        }

        return successResponse(res, 200, "Ledger entry saved and account handled", entry);
    } catch (err) {
        console.error("❌ Ledger Save Error:", err);
        return errorResponse(res, 500, "Failed to save ledger", err.message);
    }
};

// ✅ Get Ledger by ID
export const getLedger = async (req, res) => {
    try {
        const { ledgerId } = req.params;
        if (!ledgerId) return badRequestResponse(res, 400, "Ledger ID is required");

        const entry = await Ledger.findById(ledgerId);
        if (!entry) return notFoundResponse(res, 404, "Ledger entry not found");

        return successResponse(res, 200, "Ledger entry fetched successfully", entry);
    } catch (err) {
        return errorResponse(res, 500, "Failed to fetch ledger", err.message);
    }
};

// ✅ Get All Ledger Entries with Pagination, Search, Filter
export const getAllLedgers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const {
            search = '',
            applicantName = '',
            transactionType = '',
            accountType = ''
        } = req.query;

        const matchConditions = [];

        if (search) {
            matchConditions.push({
                $or: [
                    { particulars: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            });
        }

        if (applicantName) {
            matchConditions.push({ particulars: { $regex: applicantName, $options: 'i' } });
        }

        if (transactionType) {
            matchConditions.push({ transactionType });
        }

        const pipeline = [
            {
                $match: matchConditions.length ? { $and: matchConditions } : {}
            },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'particulars',
                    foreignField: 'applicantName',
                    as: 'accountInfo'
                }
            },
            { $unwind: { path: '$accountInfo', preserveNullAndEmptyArrays: true } }
        ];

        if (accountType) {
            pipeline.push({ $match: { 'accountInfo.accountType': accountType } });
        }

        const allEntries = await Ledger.aggregate([...pipeline]);

        const paginatedEntries = await Ledger.aggregate([
            ...pipeline,
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const particularSummary = {};
        let overallCredit = 0;
        let overallDebit = 0;

        for (const entry of allEntries) {
            const { particulars, transactionType, amount = 0 } = entry;

            if (!particularSummary[particulars]) {
                particularSummary[particulars] = {
                    particular: particulars,
                    totalCredit: 0,
                    totalDebit: 0,
                    balance: 0,
                };
            }

            if (transactionType === 'credit') {
                particularSummary[particulars].totalCredit += amount;
                overallCredit += amount;
                particularSummary[particulars].balance += amount;
            } else if (transactionType === 'debit') {
                if (particularSummary[particulars].balance >= amount) {
                    particularSummary[particulars].totalDebit += amount;
                    particularSummary[particulars].balance -= amount;
                    overallDebit += amount;
                } else {
                    particularSummary[particulars].invalidDebit = true;
                }
            }
        }

        const summaryArray = Object.values(particularSummary);

        const accountTotal = await Account.aggregate([
            { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
        ]);
        const totalBalance = accountTotal[0]?.totalBalance || 0;

        return successResponse(res, 200, "Ledger entries and summary", {
            summary: {
                overallCredit,
                overallDebit,
                overallBalance: overallCredit > 0 ? (overallCredit - overallDebit) : 0,
                particularSummary: summaryArray
            },
            entries: paginatedEntries,
            totalBalance,
            totalPages: Math.ceil(allEntries.length / limit),
            currentPage: page,
            totalCount: allEntries.length
        });
    } catch (err) {
        console.error("❌ Fetch error:", err);
        return errorResponse(res, 500, "Failed to fetch ledgers", err.message);
    }
};

// ✅ Delete Ledger Entry
export const deleteLedger = async (req, res) => {
    try {
        const { ledgerId } = req.params;
        if (!ledgerId) return badRequestResponse(res, 400, "Ledger ID is required");

        const deleted = await Ledger.findByIdAndDelete(ledgerId);
        if (!deleted) return notFoundResponse(res, 404, "Ledger not found");

        return successResponse(res, 200, "Ledger entry deleted successfully");
    } catch (err) {
        return errorResponse(res, 500, "Failed to delete ledger", err.message);
    }
};

// ✅ (Optional) Import Ledgers from CSV
export const importLedgerFromCSV = async (req, res) => {
    try {
        const filePath = req.file?.path;
        if (!filePath) return badRequestResponse(res, 400, "CSV file is required");

        const results = [];
        const imported = [];
        const failed = [];

        const parseCSV = () =>
            new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on("data", (row) => results.push(row))
                    .on("end", () => resolve())
                    .on("error", (err) => reject(err));
            });

        await parseCSV();

        for (let i = 0; i < results.length; i++) {
            const row = results[i];
            try {
                const payload = {
                    particulars: row.particulars,
                    transactionType: row.transactionType,
                    amount: parseFloat(row.amount),
                    balance: parseFloat(row.balance),
                    description: row.description,
                    date: row.date ? new Date(row.date) : undefined,
                    createdBy: row.createdBy,
                };
                await Ledger.create(payload);
                imported.push(payload.particulars);
            } catch (err) {
                failed.push({ row: i + 2, reason: err.message });
            }
        }

        fs.unlinkSync(filePath);

        return successResponse(res, 200, "CSV import completed", {
            importedCount: imported.length,
            failedCount: failed.length,
            failed,
        });
    } catch (err) {
        return errorResponse(res, 500, "CSV import failed", err.message);
    }
};

export const getOverallFinancialSummary = async (req, res) => {
    try {
        // 1. Aggregate total balance from Accounts
        const accountAgg = await Account.aggregate([
            { $group: { _id: null, totalAccountBalance: { $sum: "$balance" } } }
        ]);
        const totalAccountBalance = accountAgg[0]?.totalAccountBalance || 0;

        // 2. Calculate ledger totals
        const ledgers = await Ledger.find().lean();

        let totalCredit = 0;
        let totalDebit = 0;

        for (const entry of ledgers) {
            if (entry.transactionType === 'debit') {
                totalCredit += entry.amount || 0;
            } else if (entry.transactionType === 'credit') {
                totalDebit += entry.amount || 0;
            }
        }

        const totalLedgerBalance = totalCredit - totalDebit;

        return successResponse(res, 200, "Financial summary fetched successfully", {
            totalAccountBalance,
            ledger: {
                totalCredit,
                totalDebit,
                totalLedgerBalance,
            },
            grandTotal: totalAccountBalance + totalLedgerBalance
        });
    } catch (err) {
        console.error("❌ Error calculating summary:", err);
        return errorResponse(res, 500, "Failed to calculate financial summary", err.message);
    }
};
