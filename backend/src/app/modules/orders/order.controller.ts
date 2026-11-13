import { NextFunction, Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";

import { appError } from "../../errors/appError";
import { User } from "../auth/auth.model";
import { AddToCart } from "../addToCart/addToCart.model";
import { Product } from "../products/product.model";

import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { createShipmentSafely } from "../shipping/shiprocket.service";
import { createOrderSchema } from "./order.validation";

/* =========================================================
   Helpers
========================================================= */

const catchAsync =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

// Firebase UID (from verified token) -> MongoDB user _id
export const getUserId = async (req: Request): Promise<string> => {
  const firebaseUid = req.user?.uid;

  if (!firebaseUid) {
    throw new appError("Unauthorized", 401);
  }

  const user = await User.findOne({ firebaseUid }).select("_id").lean();

  if (!user) {
    throw new appError("User not found", 404);
  }

  return user._id.toString();
};

const nameOf = (value: any): string =>
  typeof value === "string" ? value : (value?.name ?? "");

const FREE_SHIPPING_FROM = 500;
const SHIPPING_FEE = 25;

const generateOrderNumber = () =>
  `GL${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

type Reserved = { productId: string; variantId: string; quantity: number };

const releaseStock = async (reserved: Reserved[]) => {
  await Promise.all(
    reserved.map((r) =>
      Product.updateOne(
        { _id: r.productId, "variants._id": r.variantId },
        { $inc: { "variants.$.stock": r.quantity } },
      ),
    ),
  );
};

// payment methods that are paid online. Their order is created as "pending"
// and the cart is emptied only after the payment is confirmed.
const ONLINE_PAYMENT_METHODS: string[] = ["razorpay", "tabby"];

// give the stock of a whole order back (payment failed / cancelled)
export const releaseOrderStock = (order: IOrder) =>
  releaseStock(
    order.items.map((item) => ({
      productId: String(item.product),
      variantId: String(item.variantId),
      quantity: item.quantity,
    })),
  );

// unpaid online orders keep their stock reserved. Before a new online order
// is created, free the stock of this user's old unpaid ones.
const STALE_PENDING_MINUTES = 30;

const expireStalePendingOrders = async (userId: string) => {
  const cutoff = new Date(Date.now() - STALE_PENDING_MINUTES * 60 * 1000);

  const stale = await Order.find({
    user: userId,
    paymentMethod: { $in: ONLINE_PAYMENT_METHODS },
    paymentStatus: "pending",
    createdAt: { $lt: cutoff },
  });

  for (const old of stale) {
    // the status filter makes sure the stock is released only once
    const claimed = await Order.findOneAndUpdate(
      { _id: old._id, paymentStatus: "pending" },
      { $set: { paymentStatus: "failed", orderStatus: "cancelled" } },
    );

    if (claimed) await releaseOrderStock(old);
  }
};

/* =========================================================
   CREATE ORDER (from the current cart)
   Prices, stock and totals are always calculated on the server.
========================================================= */

export const createOrder = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const { shippingAddress, paymentMethod } = createOrderSchema.parse(req.body);

  const isOnlinePayment = ONLINE_PAYMENT_METHODS.includes(paymentMethod);

  if (isOnlinePayment) {
    await expireStalePendingOrders(userId);
  }

  const cartItems = await AddToCart.find({ isDeleted: false }).populate({
    path: "product",
    populate: [
      { path: "brand", select: "name" },
      { path: "material", select: "name" },
      { path: "variants.size", select: "size" },
      { path: "variants.color", select: "colorName" },
    ],
  });

  const validCartItems = cartItems.filter((item) => item.product);

  if (validCartItems.length === 0) {
    throw new appError("Your cart is empty", 400);
  }

  // ---------- build order items from live product data ----------
  const items = validCartItems.map((cartItem) => {
    const product = cartItem.product as any;

    if (product.status !== "active" || product.isDeleted) {
      throw new appError(`${product.productName} is no longer available`, 400);
    }

    const variants: any[] = product.variants ?? [];
    const variant = cartItem.variantId
      ? variants.find((v) => String(v._id) === String(cartItem.variantId))
      : variants[0];

    if (!variant) {
      throw new appError(
        `Selected variant of ${product.productName} is no longer available`,
        400,
      );
    }

    const stock = Number(variant.stock ?? 0);

    if (stock < cartItem.quantity) {
      throw new appError(
        stock <= 0
          ? `${product.productName} is out of stock`
          : `Only ${stock} left for ${product.productName}`,
        400,
      );
    }

    const unitPrice = Number(variant.price ?? 0);

    return {
      product: product._id,
      variantId: variant._id,
      productName: product.productName,
      brand: nameOf(product.brand),
      material: nameOf(product.material),
      color: variant.color?.colorName ?? "",
      size: variant.size?.size ?? "",
      image: variant.image ?? "",
      unitPrice,
      quantity: cartItem.quantity,
      lineTotal: unitPrice * cartItem.quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  // ---------- reserve stock (rolled back if anything fails) ----------
  const reserved: Reserved[] = [];

  try {
    for (const item of items) {
      const result = await Product.updateOne(
        {
          _id: item.product,
          variants: {
            $elemMatch: {
              _id: item.variantId,
              stock: { $gte: item.quantity },
            },
          },
        },
        { $inc: { "variants.$.stock": -item.quantity } },
      );

      if (result.modifiedCount === 0) {
        throw new appError(`${item.productName} is out of stock`, 400);
      }

      reserved.push({
        productId: String(item.product),
        variantId: String(item.variantId),
        quantity: item.quantity,
      });
    }
  } catch (error) {
    await releaseStock(reserved);
    throw error;
  }

  // ---------- create the order ----------
  let order;

  try {
    order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
      cartItemIds: validCartItems.map((item) => item._id),
    });
  } catch (error) {
    await releaseStock(reserved);
    throw error;
  }

  // ---------- empty the cart lines that were ordered ----------
  // online payments (Razorpay / Tabby): the cart is emptied after the payment
  // is confirmed (see payments module), so a failed payment keeps the cart.
  if (!isOnlinePayment) {
    await AddToCart.deleteMany({
      _id: { $in: validCartItems.map((item) => item._id) },
    });

    // COD orders are shipped right away (does not wait, never fails the order).
    // Paid online orders are shipped from the payments module instead.
    void createShipmentSafely(order.id);
  }

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: isOnlinePayment
      ? "Order created, waiting for payment"
      : "Order placed successfully",
    data: order,
  });
});

/* =========================================================
   GET MY ORDERS
========================================================= */

export const getMyOrders = catchAsync(async (req, res) => {
  const userId = await getUserId(req);

  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

/* =========================================================
   GET ONE ORDER (only the owner can see it)
========================================================= */

export const getOrderById = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const id = String(req.params.id);

  if (!Types.ObjectId.isValid(id)) {
    throw new appError("Invalid order id", 400);
  }

  const order = await Order.findOne({ _id: id, user: userId });

  if (!order) {
    throw new appError("Order not found", 404);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Order retrieved successfully",
    data: order,
  });
});
