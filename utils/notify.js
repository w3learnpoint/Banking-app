import Notification from '../models/Notification.js';

export const notify = async (userId, title, body) => {
    try {
        await Notification.create({ userId, title, body });
    } catch (err) {
        console.error("Notification Error:", err.message);
    }
};