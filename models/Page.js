import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String },
}, { timestamps: true });

export default mongoose.model('Page', pageSchema);
