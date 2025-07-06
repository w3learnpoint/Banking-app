import mongoose from "mongoose";
const { Schema } = mongoose;

const accountDetailsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    branch: String,
    fatherOrHusbandName: String,
    guardianName: String,
    mobile: String,
    aadhar: String,
    depositAmount: Number,
    accountType: String,
    formDate: Date,
    accountNumber: { type: String, unique: true },
    ifsc: String,
    introducerName: String,
    membershipNumber: String,
    address: {
        village: { type: String },
        post: { type: String },
        block: { type: String },
        district: { type: String },
        pincode: { type: String }
    },
}, { timestamps: true });

export default mongoose.model("AccountDetails", accountDetailsSchema);
