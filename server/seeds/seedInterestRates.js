import mongoose from 'mongoose';
import dotenv from 'dotenv';
import InterestRate from '../models/InterestRate.js';

dotenv.config(); // Load MONGO_URI from .env

const INTEREST_RATES = {
    Savings: 4.0,
    Recurring: 6.5,
    Fixed: 7.0,
    Mis: 7.25
};

const seedInterestRates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔗 Connected to MongoDB');

        const now = new Date();

        const promises = Object.entries(INTEREST_RATES).map(async ([accountType, rate]) => {
            const existing = await InterestRate.findOne({ accountType });

            if (existing) {
                existing.rate = rate;
                existing.updatedBy = 'Admin';
                existing.effectiveFrom = now;
                await existing.save();
                console.log(`✅ Updated: ${accountType} = ${rate}%`);
            } else {
                await InterestRate.create({
                    accountType,
                    rate,
                    updatedBy: 'Admin',
                    effectiveFrom: now
                });
                console.log(`✅ Created: ${accountType} = ${rate}%`);
            }
        });

        await Promise.all(promises);
        console.log('🌱 Interest rates seeded successfully');
    } catch (err) {
        console.error('❌ Seed error:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedInterestRates();
