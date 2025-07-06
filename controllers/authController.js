import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import requestIp from "request-ip";
import useragent from "useragent";
import User from "../models/User.js";
import Role from "../models/Role.js";
import crypto from "crypto";

import {
    successResponse,
    errorResponse,
    badRequestResponse,
    unauthorizedResponse
} from "../utils/response.js";
import { createNewUser } from "../utils/userhelper.js";
import { sendEmail } from "../utils/email.js";

const isEmpty = value => !value || value.trim() === "";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return badRequestResponse(res, 400, "Name, email, and password are required");
        }

        let role = await Role.findOne({ name: "Viewer" });

        if (!role) {
            const viewPermissions = await Permission.find({ method: "GET" });
            role = await Role.create({
                name: "Viewer",
                roleType: "viewer",
                permissions: viewPermissions.map(p => p._id)
            });
        }

        const user = await createNewUser({ name, email, password, roleId: role._id });

        return successResponse(res, 201, "User registered successfully", {
            name: user.name,
            email: user.email
        });
    } catch (err) {
        return errorResponse(res, 500, "Registration failed", err.message);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isEmpty(email) || isEmpty(password)) {
            return badRequestResponse(res, 400, "Email and password are required");
        }

        const user = await User.findOne({ email }).populate("role");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return unauthorizedResponse(res, 401, "Invalid email or password");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        const ip = requestIp.getClientIp(req);
        const agent = useragent.parse(req.headers["user-agent"]).toString();
        user.loginHistory.push({ ip, userAgent: agent });
        await user.save();

        return successResponse(res, 200, "Login successful", {
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role.name,
                roleType: user.role.roleType
            }
        });
    } catch (err) {
        return errorResponse(res, 500, "Login failed", err.message);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return badRequestResponse(res, 400, "Email is required");

        const user = await User.findOne({ email });
        if (!user) return notFoundResponse(res, 404, "User not found");

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 1000 * 60 * 15; // 15 minutes

        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

        await sendEmail({
            to: email,
            subject: "Reset your password",
            html: `
          <p>Hello ${user.name || ""},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="${resetLink}">Reset Password</a></p>
          <p>This link will expire in 15 minutes.</p>
          <br/>
          <p>If you did not request this, please ignore this email.</p>
        `,
        }
            // html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
        );

        return successResponse(res, 200, "Reset link sent to your email");
    } catch (err) {
        console.log(err)
        return errorResponse(res, 500, "Failed to send reset link", err.message);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword)
            return badRequestResponse(res, 400, "All fields are required");

        const user = await User.findOne({ email, resetToken: token });

        if (!user || user.resetTokenExpiry < Date.now()) {
            return badRequestResponse(res, 400, "Invalid or expired token");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        return successResponse(res, 200, "Password reset successfully");
    } catch (err) {
        console.log(err?.message)
        return errorResponse(res, 500, "Failed to reset password", err.message);
    }
};


