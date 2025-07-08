// utils/userHelper.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const createNewUser = async ({
    name,
    email,
    password,
    gender,
    phone,
    dob,
    role,
    profilePic
}) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        phone,
        gender,
        dob,
        password: hashedPassword,
        role: role,
        loginHistory: [],
        profilePic
    });

    return user;
};
