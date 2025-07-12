import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema({
    village: String,
    post: String,
    block: String,
    district: String,
    state: String,
    pincode: String
}, { _id: false });

const accountsSchema = new Schema({
    accountType: { type: String, required: true },
    tenure: Number,
    branch: { type: String, required: true },
    applicantName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    occupation: String,
    phone: String,
    fatherOrHusbandName: { type: String, required: true },
    relation: { type: String, required: true },
    address: addressSchema,
    aadhar: { type: String, required: true },
    depositAmount: { type: Number, required: true },
    introducerName: { type: String, required: true },
    membershipNumber: { type: String, required: true },
    introducerKnownSince: String,
    accountNumber: { type: String, unique: true },
    nomineeName: { type: String, required: true },
    nomineeRelation: { type: String, required: true },
    nomineeAge: { type: Number, required: true },
    managerName: String,
    lekhpalOrRokapal: String,
    formDate: Date,
    accountOpenDate: Date,
    signaturePath: { type: String },
    verifierSignaturePath: { type: String },
    profileImage: { type: String },
}, { timestamps: true });

export default mongoose.model("Accounts", accountsSchema);
