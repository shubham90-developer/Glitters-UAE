import mongoose, { Schema } from "mongoose";
const adminSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true, select: false }, // bcrypt hash
    role: { type: String, default: "admin" },
    status: { type: String, default: "active" },
  },
  { timestamps: true },
);
export const Admin = mongoose.model("Admin", adminSchema);
