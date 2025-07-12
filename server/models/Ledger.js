// models/Ledger.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const ledgerSchema = new Schema({
    particulars: { type: String, required: true }, // e.g. "Account Deposit", "Withdrawal"
    transactionType: { type: String, enum: ["debit", "credit", "balance"], required: true },
    amount: { type: Number, required: true },
    balance: { type: Number }, // Optional: balance after transaction
    description: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { type: String }, // admin/manager name or ID
}, { timestamps: true });

export default mongoose.model("Ledger", ledgerSchema);
