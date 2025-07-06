import AccountDetails from "../models/AccountDetails.js";
import { notify } from "../utils/notify.js";
import {
    successResponse,
    errorResponse,
    badRequestResponse,
    notFoundResponse
} from "../utils/response.js";

// Utility to auto-generate account number starting from 10500801
const generateNextAccountNumber = async () => {
    const lastAccount = await AccountDetails.findOne().sort({ accountNumber: -1 }).lean();
    if (lastAccount && lastAccount.accountNumber) {
        const next = String(Number(lastAccount.accountNumber) + 1);
        return next;
    }
    return '10500801'; // default starting account number
};

// ✅ POST or PUT /account-details
export const upsertAccountDetails = async (req, res) => {
    try {
        let {
            user,
            branch,
            fatherOrHusbandName,
            guardianName,
            mobile,
            aadhar,
            depositAmount,
            accountType,
            formDate,
            ifsc,
            introducerName,
            membershipNumber,
            address
        } = req.body;

        if (!user) return badRequestResponse(res, 400, "User ID is required");

        // ✅ Format mobile number (clean and format as 12345 67890)
        if (mobile) {
            const cleaned = mobile.replace(/\D/g, '').slice(0, 10);
            mobile = cleaned.replace(/(\d{5})(\d{0,5})/, '$1 $2').trim();
        }

        const payload = {
            user,
            branch,
            fatherOrHusbandName,
            guardianName,
            mobile,
            aadhar,
            depositAmount,
            accountType,
            formDate,
            ifsc,
            introducerName,
            membershipNumber,
            address
        };

        let details = await AccountDetails.findOne({ user });

        if (details) {
            // ✅ Update existing
            details = await AccountDetails.findOneAndUpdate({ user }, payload, { new: true });
        } else {
            // ✅ Generate accountNumber only for new insert
            const newAccountNumber = await generateNextAccountNumber();
            payload.accountNumber = newAccountNumber;

            details = await AccountDetails.create(payload);
            await notify(details?.user, "Account Created", `Account for user ID ${details?.user} created.`);
        }

        return successResponse(res, 200, "Account details saved successfully", details);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 500, "Failed to save account details", err.message);
    }
};

// ✅ GET /account-details/:userId
export const getAccountDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return badRequestResponse(res, 400, "User ID is required");

        const details = await AccountDetails.findOne({ user: userId }).populate("user");

        if (!details) return notFoundResponse(res, 404, "Account details not found");

        return successResponse(res, 200, "Account details fetched successfully", details);
    } catch (err) {
        return errorResponse(res, 500, "Failed to fetch account details", err.message);
    }
};
