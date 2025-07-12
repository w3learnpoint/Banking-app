import mongoose from "mongoose";

const { Schema } = mongoose;

const roleSchema = new Schema({
    name: { type: String, unique: true },
    roleType: {
        type: String,
        enum: ["superadmin", "admin", "viewer", "custom", "user"],
        default: "custom"
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    status: { type: Boolean, default: true },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
