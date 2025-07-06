import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: String,
    method: String,
    route: String,
    status: { type: Boolean, default: true },
});

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
