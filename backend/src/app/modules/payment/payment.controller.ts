import crypto from "crypto";
import axios, { AxiosError } from "axios";
import Razorpay from "razorpay";
import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import z from "zod";

import { appError } from "../../errors/appError";
import { catchAsync } from "../../utils/catchAsync";
import { User } from "../auth/auth.model";
import { AddToCart } from "../addToCart/addToCart.model";
import { IOrder } from "../orders/order.interface";
import { Order } from "../orders/order.model";
import { getUserId, releaseOrderStock } from "../orders/order.controller";
import { createShipmentSafely } from "../shipping/shiprocket.service";

/* =========================================================
   Config (read from .env at request time)
========================================================= */

const getCurrency = () => process.env.PAYMENT_CURRENCY || "AED";

const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new appError("Razorpay is not configured on the server", 500);
  }

  return {
    client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
    keyId,
    keySecret,
  };
};

/* =========================================================
   Helpers
========================================================= */

type OnlineMethod = "razorpay" | "tabby";
type OrderDoc = HydratedDocument<IOrder>;
type PaymentResult = "paid" | "failed" | "pending";

const orderIdSchema = z.object({
  orderId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid order id"),
});

const razorpayVerifySchema = orderIdSchema.extend({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// 1201.5 -> "1201.50" (Tabby)
const money = (n: number) => n.toFixed(2);

// 1201.5 -> 120150 (Razorpay works in the smallest currency unit)
const toMinorUnits = (n: number) => Math.round(n * 100);

// "+91 98765 43210" -> "+919876543210"
const cleanPhone = (phone: string) => {
  const value = phone.trim();
  const digits = value.replace(/\D/g, "");
  return value.startsWith("+") ? `+${digits}` : digits;
};

const sendOk = (res: Response, message: string, data: unknown) =>
  res.status(200).json({ success: true, statusCode: 200, message, data });

const getBuyer = async (req: Request) => {
  const user = await User.findOne({ firebaseUid: req.user?.uid })
    .select("name email phone")
    .lean();

  return {
    name: user?.name ?? "",
    email: user?.email || req.user?.email || "",
    phone: user?.phone || req.user?.phone || "",
  };
};

// the order must belong to the logged in user and be an online-payment order
const loadOwnOrder = async (
  userId: string,
  orderId: string,
  method?: OnlineMethod,
): Promise<OrderDoc> => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new appError("Order not found", 404);
  }

  if (order.paymentMethod !== "razorpay" && order.paymentMethod !== "tabby") {
    throw new appError("This order is not an online payment order", 400);
  }

  if (method && order.paymentMethod !== method) {
    throw new appError(`This order is not a ${method} order`, 400);
  }

  return order;
};

/* ---------- order state changes (safe to call more than once) ---------- */

// pending -> paid. The cart lines of the order are removed only now.
const confirmPayment = async (
  orderId: string,
  extra: Record<string, unknown> = {},
) => {
  const paid = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: "pending" },
    {
      $set: {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        paidAt: new Date(),
        ...extra,
      },
    },
    { new: true },
  ).select("+cartItemIds");

  if (paid) {
    if (paid.cartItemIds?.length) {
      await AddToCart.deleteMany({ _id: { $in: paid.cartItemIds } });
    }

    // paid -> create the Shiprocket shipment (does not wait, never fails the payment)
    void createShipmentSafely(String(paid._id));
    return;
  }

  // nothing was pending: fine if it is already paid (double call)
  const current = await Order.findById(orderId).select("paymentStatus");

  if (current?.paymentStatus === "paid") return;

  throw new appError(
    "This order was cancelled before the payment was confirmed. Please contact support.",
    409,
  );
};

// pending -> failed. Gives the reserved stock back exactly once.
const failOrder = async (orderId: string) => {
  const failed = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: "pending" },
    { $set: { paymentStatus: "failed", orderStatus: "cancelled" } },
    { new: true },
  );

  if (failed) {
    await releaseOrderStock(failed);
  }
};

/* =========================================================
   RAZORPAY
========================================================= */

// POST /payments/razorpay/create   { orderId }
export const createRazorpayPayment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = await getUserId(req);
    const { orderId } = orderIdSchema.parse(req.body);

    const order = await loadOwnOrder(userId, orderId, "razorpay");

    if (order.paymentStatus !== "pending") {
      throw new appError("This order can no longer be paid", 400);
    }

    const { client, keyId } = getRazorpay();
    const currency = getCurrency();

    let razorpayOrder;

    try {
      // the amount always comes from the order saved on the server
      razorpayOrder = await client.orders.create({
        amount: toMinorUnits(order.total),
        currency,
        receipt: order.orderNumber,
        notes: { orderId: String(order._id) },
      });
    } catch (error: any) {
      console.error("Razorpay create order error:", error?.error ?? error);
      throw new appError(
        error?.error?.description || "Could not start the Razorpay payment",
        502,
      );
    }

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    const buyer = await getBuyer(req);

    sendOk(res, "Razorpay order created", {
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: Number(razorpayOrder.amount),
      currency,
      keyId, // public key id, safe for the browser
      prefill: {
        name: order.shippingAddress.name,
        contact: cleanPhone(order.shippingAddress.phone),
        email: buyer.email,
      },
    });
  },
);

// POST /payments/razorpay/verify
// { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const verifyRazorpayPayment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = await getUserId(req);
    const body = razorpayVerifySchema.parse(req.body);

    const order = await loadOwnOrder(userId, body.orderId, "razorpay");

    if (order.paymentStatus === "paid") {
      return sendOk(res, "Payment already confirmed", {
        status: "paid",
        orderId: String(order._id),
      });
    }

    if (
      !order.razorpayOrderId ||
      order.razorpayOrderId !== body.razorpay_order_id
    ) {
      throw new appError("Payment does not belong to this order", 400);
    }

    const { keySecret } = getRazorpay();

    // signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expected);
    const receivedBuf = Buffer.from(body.razorpay_signature);

    const valid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!valid) {
      throw new appError("Payment verification failed", 400);
    }

    await confirmPayment(String(order._id), {
      razorpayPaymentId: body.razorpay_payment_id,
    });

    sendOk(res, "Payment successful", {
      status: "paid",
      orderId: String(order._id),
    });
  },
);

/* =========================================================
   TABBY
========================================================= */

type TabbySession = {
  status?: string;
  payment?: { id?: string };
  configuration?: {
    available_products?: { installments?: { web_url?: string }[] };
    products?: { installments?: { rejection_reason?: string | null } };
  };
};

type TabbyPayment = {
  id: string;
  status: string;
  amount: string;
  currency: string;
};

const TABBY_REJECTION_MESSAGES: Record<string, string> = {
  order_amount_too_high:
    "This purchase is above your current spending limit with Tabby. Try a smaller cart or use another payment method.",
  order_amount_too_low:
    "The purchase amount is below the minimum required to use Tabby. Add more items or use another payment method.",
};

const TABBY_DEFAULT_REJECTION =
  "Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order.";

// Tabby test buyer (UAE). Used only when TABBY_TEST_MODE=true.
const TABBY_TEST_BUYER = {
  email: "otp.success@tabby.ai",
  phone: "+971500000001",
};

const tabbyRequest = async <T>(
  method: "get" | "post",
  path: string,
  body?: unknown,
): Promise<T> => {
  const secretKey = process.env.TABBY_SECRET_KEY;

  if (!secretKey) {
    throw new appError("Tabby is not configured on the server", 500);
  }

  const baseUrl = (process.env.TABBY_API_URL || "https://api.tabby.ai").replace(
    /\/+$/,
    "",
  );

  try {
    const response = await axios.request<T>({
      method,
      url: `${baseUrl}${path}`,
      data: body,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Tabby API error:",
      err.response?.status,
      JSON.stringify(err.response?.data),
    );
    throw new appError(
      "Could not complete the Tabby request. Please try again or use another payment method.",
      502,
    );
  }
};

// Asks Tabby for the real status of the payment (never trust the redirect).
const syncTabbyOrder = async (order: OrderDoc): Promise<PaymentResult> => {
  if (order.paymentStatus === "paid") return "paid";
  if (order.paymentStatus === "failed") return "failed";

  // no Tabby session was ever created for this order
  if (!order.tabbyPaymentId) {
    await failOrder(String(order._id));
    return "failed";
  }

  const payment = await tabbyRequest<TabbyPayment>(
    "get",
    `/api/v2/payments/${order.tabbyPaymentId}`,
  );

  const status = String(payment.status).toUpperCase();

  // AUTHORIZED = customer paid, CLOSED = already captured
  if (status === "AUTHORIZED" || status === "CLOSED") {
    const sameAmount =
      Math.abs(Number(payment.amount) - order.total) < 0.01 &&
      String(payment.currency).toUpperCase() === getCurrency().toUpperCase();

    if (!sameAmount) {
      console.error("Tabby amount mismatch", payment, order.total);
      throw new appError("Payment amount does not match the order", 400);
    }

    if (status === "AUTHORIZED") {
      // reference_id makes the capture safe to retry
      await tabbyRequest("post", `/api/v2/payments/${payment.id}/captures`, {
        amount: money(order.total),
        reference_id: `capture-${order.orderNumber}`,
      });
    }

    await confirmPayment(String(order._id));
    return "paid";
  }

  // customer cancelled / Tabby declined / session timed out
  if (status === "REJECTED" || status === "EXPIRED") {
    await failOrder(String(order._id));
    return "failed";
  }

  return "pending";
};

// POST /payments/tabby/create   { orderId }  ->  { webUrl }
export const createTabbyPayment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = await getUserId(req);
    const { orderId } = orderIdSchema.parse(req.body);

    const order = await loadOwnOrder(userId, orderId, "tabby");

    if (order.paymentStatus !== "pending") {
      throw new appError("This order can no longer be paid", 400);
    }

    const merchantCode = process.env.TABBY_MERCHANT_CODE;

    if (!merchantCode) {
      throw new appError("Tabby is not configured on the server", 500);
    }

    const buyer = await getBuyer(req);
    const useTestBuyer = process.env.TABBY_TEST_MODE === "true";

    const buyerEmail = useTestBuyer ? TABBY_TEST_BUYER.email : buyer.email;
    const buyerPhone = useTestBuyer
      ? TABBY_TEST_BUYER.phone
      : cleanPhone(order.shippingAddress.phone);

    if (!buyerEmail) {
      throw new appError(
        "Please add an email address to your account to pay with Tabby",
        400,
      );
    }

    const redirectBase = `${getFrontendUrl()}/checkout/payment-status`;
    const urlFor = (result: "success" | "cancel" | "failure") =>
      `${redirectBase}?result=${result}&order=${String(order._id)}`;

    const session = await tabbyRequest<TabbySession>(
      "post",
      "/api/v2/checkout",
      {
        payment: {
          amount: money(order.total),
          currency: getCurrency(),
          description: `Order ${order.orderNumber}`,
          buyer: {
            name: order.shippingAddress.name || buyer.name || "Customer",
            email: buyerEmail,
            phone: buyerPhone,
          },
          shipping_address: {
            city: order.shippingAddress.city || "N/A",
            address: order.shippingAddress.address,
            zip: order.shippingAddress.pincode || "N/A",
          },
          order: {
            reference_id: order.orderNumber,
            shipping_amount: money(order.shipping),
            items: order.items.map((item) => ({
              title: item.productName,
              quantity: item.quantity,
              unit_price: money(item.unitPrice),
              category: "General",
            })),
          },
        },
        lang: "en",
        merchant_code: merchantCode,
        merchant_urls: {
          success: urlFor("success"),
          cancel: urlFor("cancel"),
          failure: urlFor("failure"),
        },
      },
    );

    // not approved by Tabby (this is a normal 200 response, not an error)
    if (session.status === "rejected") {
      await failOrder(String(order._id));

      const reason =
        session.configuration?.products?.installments?.rejection_reason ?? "";

      throw new appError(
        TABBY_REJECTION_MESSAGES[reason] ?? TABBY_DEFAULT_REJECTION,
        400,
      );
    }

    const webUrl =
      session.configuration?.available_products?.installments?.[0]?.web_url;
    const paymentId = session.payment?.id;

    // never redirect without a web_url
    if (!webUrl || !paymentId) {
      await failOrder(String(order._id));
      throw new appError(TABBY_DEFAULT_REJECTION, 400);
    }

    order.tabbyPaymentId = paymentId;
    await order.save();

    sendOk(res, "Tabby session created", {
      orderId: String(order._id),
      webUrl,
    });
  },
);

// POST /payments/tabby/verify   { orderId }  ->  { status: paid|failed|pending }
export const verifyTabbyPayment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = await getUserId(req);
    const { orderId } = orderIdSchema.parse(req.body);

    const order = await loadOwnOrder(userId, orderId, "tabby");
    const status = await syncTabbyOrder(order);

    sendOk(res, "Payment status checked", { status, orderId });
  },
);

/* =========================================================
   CANCEL (customer closed Razorpay / cancelled on Tabby)
========================================================= */

// POST /payments/cancel   { orderId }  ->  { status: paid|failed }
export const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const { orderId } = orderIdSchema.parse(req.body);

  const order = await loadOwnOrder(userId, orderId);

  // for Tabby, check first: the customer may have paid before cancelling
  if (order.paymentMethod === "tabby") {
    const result = await syncTabbyOrder(order);

    if (result === "paid") {
      return sendOk(res, "Payment already completed", {
        status: "paid",
        orderId,
      });
    }
  }

  // releases the stock, keeps the cart so the customer can try again
  await failOrder(orderId);

  const current = await Order.findById(orderId).select("paymentStatus");

  sendOk(res, "Payment cancelled", {
    status: current?.paymentStatus === "paid" ? "paid" : "failed",
    orderId,
  });
});
