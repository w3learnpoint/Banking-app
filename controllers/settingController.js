import UserSetting from '../models/UserSetting.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getUserSetting = async (req, res) => {
    try {
        const setting = await UserSetting.findOne();

        if (!setting) {
            return successResponse(res, 200, "No settings found. Using defaults.", {
                theme: 'light',
                font: 'system-ui',
                fontSize: '16px',
                websiteLogo: '',
                websiteName: '',
                favicon: '',
                websiteTitle: ''
            });
        }

        return successResponse(res, 200, "Settings fetched successfully", setting);
    } catch (err) {
        console.log(err)
        return errorResponse(res, 500, "Failed to fetch settings", err.message);
    }
};

export const saveUserSetting = async (req, res) => {
    try {
        const {
            theme,
            font,
            fontSize,
            websiteLogo,
            websiteName,
            favicon,
            websiteTitle
        } = req.body;

        const updated = await UserSetting.findOneAndUpdate(
            {}, // match any (the only one)
            {
                theme,
                font,
                fontSize,
                websiteLogo,
                websiteName,
                favicon,
                websiteTitle
            },
            {
                upsert: true, // insert if none exists
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return successResponse(res, 200, "Settings saved successfully", updated);
    } catch (err) {
        return errorResponse(res, 500, "Failed to save settings", err.message);
    }
};
