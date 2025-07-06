import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { notFoundResponse, unauthorizedResponse } from "../utils/response.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate({
            path: "role",
            populate: {
                path: "permissions",
                model: "Permission",
                route: "Permission"
            }
        });

        if (!user) return notFoundResponse(res, 401, "User not found");

        req.user = user;
        next();
    } catch (err) {
        return unauthorizedResponse(res, 401, "Invalid token");
    }
};
