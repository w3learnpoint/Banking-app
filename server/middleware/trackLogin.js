import requestIp from "request-ip";
import useragent from "useragent";
import { errorResponse } from "../utils/response.js";

export const trackLogin = async (req, res, next) => {
    if (!req.user) return next();

    try {
        const ip = requestIp.getClientIp(req);
        const agent = useragent.parse(req.headers["user-agent"]).toString();

        req.user.loginHistory.push({ ip, userAgent: agent });
        await req.user.save();

        next();
    } catch (err) {
        console.error("Login tracking failed:", err);
        return errorResponse(res, 500, "Failed to track login", err.message);
    }
};
