import mongoose, { Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    productName: { type: String, required: true, trim: true },
    brand: { type: String, default: "", trim: true },
    material: { type: String, default: "", trim: true },
    color: { type: String, default: "", trim: true },
    size: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: true },
);

const shippingAddressSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    pincode: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const orderSchema: Schema<IOrder> = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: { type: [orderItemSchema], required: true },

    shippingAddress: { type: shippingAddressSchema, required: true },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "razorpay", "tabby", "cod", "apple-pay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },

    // ---- online payment (Razorpay / Tabby) ----
    razorpayOrderId: { type: String, default: "", trim: true },
    razorpayPaymentId: { type: String, default: "", trim: true },
    tabbyPaymentId: { type: String, default: "", trim: true },
    paidAt: { type: Date },

    // cart lines this order was created from. Hidden from normal queries;
    // they are removed from the cart only after the payment is confirmed.
    cartItemIds: {
      type: [Schema.Types.ObjectId],
      default: [],
      select: false,
    },

    // ---- shipping (Shiprocket) ----
    shiprocketOrderId: { type: String, default: "", trim: true },
    shiprocketShipmentId: { type: String, default: "", trim: true },
    awbCode: { type: String, default: "", trim: true, index: true },
    courierName: { type: String, default: "", trim: true },
    shipmentStatus: { type: String, default: "", trim: true },
    trackingUrl: { type: String, default: "", trim: true },
    // last Shiprocket error. Hidden from normal queries (internal details).
    shipmentError: { type: String, default: "", select: false },
  },
  { timestamps: true },
);

export const Order =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", orderSchema);
