import Message from '../models/Message.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, unreadOnly } = req.query;
        const skip = (page - 1) * limit;

        const filter = { toUser: req.user._id };
        if (unreadOnly === 'true') filter.isRead = false;

        const [data, count] = await Promise.all([
            Message.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate('fromUser', 'name')
                .lean(),
            Message.countDocuments(filter),
        ]);

        return successResponse(res, 200, 'Messages fetched', {
            data,
            currentPage: Number(page),
            totalPages: Math.ceil(count / limit),
        });
    } catch (err) {
        return errorResponse(res, 500, 'Failed to fetch messages', err.message);
    }
};

export const toggleReadStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findById(id);
        if (!message) {
            return errorResponse(res, 404, "Message not found");
        }

        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { isRead: !message.isRead },
            { new: true }
        );

        return successResponse(res, 200, "Message read status toggled", updatedMessage);
    } catch (err) {
        return errorResponse(res, 500, "Failed to toggle read status", err.message);
    }
};

export const replyToMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const original = await Message.findById(id);
        if (!original) return errorResponse(res, 404, "Original message not found");

        const reply = new Message({
            fromUser: req.user._id,
            toUser: original.fromUser,
            content: req.body.reply,
        });

        await reply.save();
        return successResponse(res, 201, "Reply sent", reply);
    } catch (err) {
        return errorResponse(res, 500, "Failed to send reply", err.message);
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);

        if (!message) {
            return errorResponse(res, 404, "Message not found");
        }

        // Optional: Ensure only the sender or receiver can delete
        if (!message.toUser.equals(req.user._id) && !message.fromUser.equals(req.user._id)) {
            return errorResponse(res, 403, "You are not authorized to delete this message");
        }

        await Message.findByIdAndDelete(id);
        return successResponse(res, 200, "Message deleted successfully");
    } catch (err) {
        return errorResponse(res, 500, "Failed to delete message", err.message);
    }
};
