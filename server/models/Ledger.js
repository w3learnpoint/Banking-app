// models/Ledger.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const ledgerSchema = new Schema({
    particulars: { type: String, required: true },
    transactionType: { type: String, enum: ['deposit', 'withdrawal', 'interest'], required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    balance: { type: Number, default: 0 }, // Running balance after this transaction
    createdBy: { type: String }, // admin/manager name or ID
}, { timestamps: true });

export default mongoose.model("Ledger", ledgerSchema);
