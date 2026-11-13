import { Document, Types } from "mongoose";

export type PaymentMethod =
  | "card"
  | "upi"
  | "razorpay"
  | "tabby"
  | "cod"
  | "apple-pay";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface IOrderItem {
  product: Types.ObjectId;
  variantId: Types.ObjectId;
  productName: string;
  brand: string;
  material: string;
  color: string;
  size: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface IShippingAddress {
  name: string;
  type?: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;

  // ---- online payment (Razorpay / Tabby) ----
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  tabbyPaymentId?: string;
  paidAt?: Date;
  // cart lines this order was created from (removed from the cart once paid)
  cartItemIds?: Types.ObjectId[];

  // ---- shipping (Shiprocket) ----
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  awbCode?: string; // courier tracking number
  courierName?: string;
  shipmentStatus?: string; // creating | failed | AWB Assigned | Shiprocket status
  trackingUrl?: string;
  shipmentError?: string; // last Shiprocket error (never sent to customers)

  createdAt: Date;
  updatedAt: Date;
}
