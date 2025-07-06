import mongoose from "mongoose";
const { Schema } = mongoose;

const nomineeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    relation: String,
    age: Number,
    mobile: String
}, { timestamps: true });

export default mongoose.model("Nominee", nomineeSchema);
