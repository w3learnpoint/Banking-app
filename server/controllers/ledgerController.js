import fs from "fs";
import csv from "csv-parser";
import Ledger from "../models/Ledger.js";
import {
    successResponse,
    errorResponse,
    badRequestResponse,
    notFoundResponse
} from "../utils/response.js";

// ✅ Create or Update (Upsert) Ledger
export const upsertLedger = async (req, res) => {
    try {
        const {
            ledgerId,
            particulars,
            transactionType,
            amount,
            balance,
            description,
            date,
            createdBy,
        } = req.body;

        if (!particulars || !transactionType || !amount) {
            return badRequestResponse(res, 400, "Required fields missing");
        }

        const payload = {
            particulars,
            transactionType,
            amount,
            balance,
            description,
            date,
            createdBy,
        };

        let entry;

        if (ledgerId) {
            entry = await Ledger.findByIdAndUpdate(ledgerId, payload, { new: true });
            if (!entry) return notFoundResponse(res, 404, "Ledger entry not found");
        } else {
            entry = await Ledger.create(payload);
        }

        return successResponse(res, 200, "Ledger entry saved successfully", entry);
    } catch (err) {
        console.error(err);
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
        const search = req.query.search || '';
        const transactionType = req.query.transactionType || '';

        const query = {
            $or: [
                { particulars: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]
        };

        if (transactionType) {
            query.transactionType = transactionType;
        }

        const allEntries = await Ledger.find(query).sort({ date: 1 });

        const particularSummary = {};

        let overallCredit = 0;
        let overallDebit = 0;
        let overallBalance = 0;

        for (const entry of allEntries) {
            const { date, particulars, transactionType, amount = 0 } = entry;
            if (!particularSummary[particulars]) {
                particularSummary[particulars] = {
                    date: date,
                    particular: particulars,
                    totalCredit: 0,
                    totalDebit: 0,
                    balance: 0
                };
            }

            if (transactionType === 'debit') {
                particularSummary[particulars].totalCredit += amount;
                overallCredit += amount;
                particularSummary[particulars].balance += amount;
                overallBalance += amount;
            } else if (transactionType === 'credit') {
                particularSummary[particulars].totalDebit += amount;
                overallDebit += amount;
                particularSummary[particulars].balance -= amount;
                overallBalance -= amount;
            }
        }

        const summaryArray = Object.values(particularSummary);

        const total = allEntries.length;
        const paginatedEntries = await Ledger.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return successResponse(res, 200, "Ledger entries and particular-wise summary", {
            summary: {
                overallCredit,
                overallDebit,
                overallBalance,
                particularSummary: summaryArray,
            },
            entries: paginatedEntries,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalCount: total
        });
    } catch (err) {
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
