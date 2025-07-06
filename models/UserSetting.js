import mongoose from 'mongoose';

const userSettingSchema = new mongoose.Schema({
    theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light'
    },
    font: {
        type: String,
        default: 'system-ui'
    },
    fontSize: {
        type: String,
        default: '16px'
    },
    websiteLogo: {
        type: String,
        default: ''
    },
    websiteName: {
        type: String,
        default: ''
    },
    favicon: {
        type: String,
        default: ''
    },
    websiteTitle: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default mongoose.model('UserSetting', userSettingSchema);
