import Nominee from "../models/Nominee.js";
import {
    successResponse,
    errorResponse,
    notFoundResponse,
    badRequestResponse
} from "../utils/response.js";

// ✅ POST /nominees
export const createNominee = async (req, res) => {
    try {
        const { user, name, relation, age, mobile } = req.body;

        if (!user || !name || !relation || !age) {
            return badRequestResponse(res, 400, "User, name, relation, and age are required");
        }

        const nominee = await Nominee.create({ user, name, relation, age, mobile });

        return successResponse(res, 201, "Nominee created successfully", nominee);
    } catch (err) {
        return errorResponse(res, 500, "Failed to create nominee", err.message);
    }
};

// ✅ PUT /nominees/:id
export const updateNominee = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Nominee.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return notFoundResponse(res, 404, "Nominee not found");

        return successResponse(res, 200, "Nominee updated successfully", updated);
    } catch (err) {
        return errorResponse(res, 500, "Failed to update nominee", err.message);
    }
};

// ✅ GET /nominees/:userId
export const getNomineesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return badRequestResponse(res, 400, "User ID is required");

        const nominees = await Nominee.find({ user: userId });

        return successResponse(res, 200, "Nominees fetched successfully", nominees);
    } catch (err) {
        return errorResponse(res, 500, "Failed to fetch nominees", err.message);
    }
};

// ✅ DELETE /nominees/:id
export const deleteNominee = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Nominee.findByIdAndDelete(id);
        if (!deleted) return notFoundResponse(res, 404, "Nominee not found");

        return successResponse(res, 200, "Nominee deleted successfully");
    } catch (err) {
        return errorResponse(res, 500, "Failed to delete nominee", err.message);
    }
};
