import mongoose, { Model, Schema } from "mongoose";
import { ISavedCard } from "./Savedcards.interface";

const savedCardSchema = new Schema<ISavedCard>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["Visa", "Mastercard", "RuPay", "American Express"],
      required: true,
    },
    last4: { type: String, required: true, match: /^\d{4}$/ },
    expiry: { type: String, required: true, match: /^(0[1-9]|1[0-2])\/\d{2}$/ },
    holder: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    gatewayToken: { type: String, select: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        if (ret.createdAt) {
          ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
        }
        if (ret.updatedAt) {
          ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
        }
        return ret;
      },
    },
  },
);

savedCardSchema.index({ user: 1, isDeleted: 1, createdAt: -1 });

export const SavedCard: Model<ISavedCard> =
  (mongoose.models.SavedCard as Model<ISavedCard>) ||
  mongoose.model<ISavedCard>("SavedCard", savedCardSchema);
