import mongoose from 'mongoose';

const interestRateSchema = new mongoose.Schema({
    accountType: {
        type: String,
        required: true,
        enum: ['Savings', 'Recurring', 'Fixed', 'Mis', 'Loan'], // Extend as needed
        unique: true
    },
    rate: {
        type: Number,
        required: true
    },
    effectiveFrom: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        default: 'System'
    }
}, { timestamps: true });

export default mongoose.model('InterestRate', interestRateSchema);
