import { applyInterestToAllAccounts } from "../utils/interestService.js";
import {
    successResponse,
    errorResponse,
} from "../utils/response.js";

// ✅ Apply Interest to All Accounts
export const applyMonthlyInterest = async (req, res) => {
    try {
        const result = await applyInterestToAllAccounts();
        return successResponse(res, 200, "Monthly interest applied", result);
    } catch (err) {
        return errorResponse(res, 500, "Interest application failed", err.message);
    }
};