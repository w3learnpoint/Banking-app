import mongoose from "mongoose";

const { Schema } = mongoose;

const loginEntrySchema = new Schema({
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
});

const userSchema = new Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        phone: {
            type: String,
            trim: true
        },
        dob: Date,
        googleId: String,
        role: { type: Schema.Types.ObjectId, ref: "Role" },
        loginHistory: [loginEntrySchema],
        status: { type: Boolean, default: true },
        profilePic: { type: String },
        resetToken: String,
        resetTokenExpiry: Date
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
