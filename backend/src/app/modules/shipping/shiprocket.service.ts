import axios, { AxiosError } from "axios";
import { FilterQuery, HydratedDocument } from "mongoose";

import { appError } from "../../errors/appError";
import { User } from "../auth/auth.model";
import { IOrder } from "../orders/order.interface";
import { Order } from "../orders/order.model";

type OrderDoc = HydratedDocument<IOrder>;

/* =========================================================
   Config (read from .env at call time)
========================================================= */

const getBaseUrl = () =>
  (
    process.env.SHIPROCKET_API_URL || "https://apiv2.shiprocket.in/v1/external"
  ).replace(/\/+$/, "");

const positive = (value: string | undefined, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const isShiprocketConfigured = () =>
  !!(
    process.env.SHIPROCKET_EMAIL &&
    process.env.SHIPROCKET_PASSWORD &&
    process.env.SHIPROCKET_PICKUP_LOCATION
  );

/* =========================================================
   Shiprocket API client (login token is cached)
========================================================= */

// Shiprocket tokens last 24h - 10 days depending on the account, so the token
// is cached for a safe 20 hours and a 401 always triggers a fresh login.
const TOKEN_TTL_MS = 20 * 60 * 60 * 1000;

let cachedToken: { token: string; expiresAt: number } | null = null;

type ShiprocketErrorBody = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

// "message: detail, detail" from a failed Shiprocket response
const describeError = (error: unknown) => {
  const err = error as AxiosError<ShiprocketErrorBody>;
  const data = err.response?.data;

  const details = data?.errors
    ? Object.values(data.errors).flat().join(", ")
    : "";

  return (
    [data?.message, details].filter(Boolean).join(": ") ||
    err.message ||
    "Shiprocket request failed"
  );
};

const login = async (): Promise<string> => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const { data } = await axios.post<{ token?: string }>(
      `${getBaseUrl()}/auth/login`,
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      },
      { timeout: 20000 },
    );

    if (!data.token) throw new Error("No token in the login response");

    cachedToken = { token: data.token, expiresAt: Date.now() + TOKEN_TTL_MS };
    return data.token;
  } catch (error) {
    console.error("Shiprocket login failed:", describeError(error));
    throw new appError(
      "Could not log in to Shiprocket. Check the API user email and password.",
      502,
    );
  }
};

const shiprocketRequest = async <T>(
  method: "get" | "post",
  path: string,
  body?: unknown,
  retried = false,
): Promise<T> => {
  const token = await login();

  try {
    const response = await axios.request<T>({
      method,
      url: `${getBaseUrl()}${path}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    // expired token: log in again and retry once
    if ((error as AxiosError).response?.status === 401 && !retried) {
      cachedToken = null;
      return shiprocketRequest<T>(method, path, body, true);
    }

    const message = describeError(error);
    console.error(
      `Shiprocket ${method.toUpperCase()} ${path} failed:`,
      message,
    );
    throw new appError(message, 502);
  }
};

/* =========================================================
   Build the Shiprocket order from our order
========================================================= */

// "+91 98765 43210" -> "9876543210"
export const cleanPhone10 = (phone: string) =>
  phone.replace(/\D/g, "").slice(-10);

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] || "Customer", last: parts.slice(1).join(" ") };
};

// Shiprocket wants "YYYY-MM-DD HH:mm"
const formatOrderDate = (date: Date) =>
  new Date(date)
    .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata", hour12: false })
    .slice(0, 16);

export const buildShiprocketOrder = (order: OrderDoc, email: string) => {
  const address = order.shippingAddress;
  const { first, last } = splitName(address.name);

  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // products do not store a weight / size yet, so defaults from .env are used
  const weightPerItem = positive(process.env.SHIPROCKET_DEFAULT_WEIGHT, 0.5);

  return {
    order_id: order.orderNumber,
    order_date: formatOrderDate(order.createdAt),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,

    billing_customer_name: first,
    billing_last_name: last,
    billing_address: address.address,
    billing_city: address.city,
    billing_pincode: address.pincode,
    billing_state: address.state,
    billing_country: "India",
    billing_email: email,
    billing_phone: cleanPhone10(address.phone),
    shipping_is_billing: true,

    order_items: order.items.map((item) => ({
      name: item.productName,
      sku: String(item.variantId || item.product),
      units: item.quantity,
      selling_price: item.unitPrice,
    })),

    payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
    shipping_charges: order.shipping,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: order.subtotal,

    length: positive(process.env.SHIPROCKET_DEFAULT_LENGTH, 10), // cm
    breadth: positive(process.env.SHIPROCKET_DEFAULT_BREADTH, 10), // cm
    height: positive(process.env.SHIPROCKET_DEFAULT_HEIGHT, 10), // cm
    weight: Math.round(weightPerItem * units * 100) / 100, // kg
  };
};

/* =========================================================
   Create the shipment (order -> AWB -> pickup)
========================================================= */

type CreateOrderResponse = {
  order_id?: number | string;
  shipment_id?: number | string;
  awb_code?: string;
  courier_name?: string;
  message?: string;
};

type AssignAwbResponse = {
  awb_assign_status?: number;
  message?: string;
  response?: { data?: { awb_code?: string; courier_name?: string } };
};

export type ShipmentResult = { created: boolean; reason?: string };

const STALE_CLAIM_MINUTES = 10;

// can be run again safely: it continues from the step that did not finish
export const createShipmentForOrder = async (
  orderId: string,
): Promise<ShipmentResult> => {
  if (!isShiprocketConfigured()) {
    throw new appError("Shiprocket is not configured on the server", 500);
  }

  const staleBefore = new Date(Date.now() - STALE_CLAIM_MINUTES * 60 * 1000);

  // claim the order so two requests can never create two shipments.
  // Only paid (or COD), not cancelled and not already shipped orders match.
  const claimFilter = {
    $and: [
      { _id: orderId },
      { awbCode: { $in: ["", null] } },
      { orderStatus: { $ne: "cancelled" } },
      { $or: [{ paymentMethod: "cod" }, { paymentStatus: "paid" }] },
      {
        $or: [
          { shipmentStatus: { $ne: "creating" } },
          { updatedAt: { $lt: staleBefore } },
        ],
      },
    ],
  } as FilterQuery<IOrder>;

  const order = await Order.findOneAndUpdate(
    claimFilter,
    { $set: { shipmentStatus: "creating", shipmentError: "" } },
    { new: true },
  );

  if (!order) {
    const current = await Order.findById(orderId).select(
      "awbCode paymentMethod paymentStatus orderStatus",
    );

    if (!current) throw new appError("Order not found", 404);
    if (current.awbCode)
      return { created: false, reason: "Shipment already created" };
    if (current.orderStatus === "cancelled")
      return { created: false, reason: "Order is cancelled" };
    if (current.paymentMethod !== "cod" && current.paymentStatus !== "paid")
      return { created: false, reason: "Order is not paid yet" };

    return { created: false, reason: "Shipment is already being created" };
  }

  try {
    /* ---- 1. create the order in Shiprocket ---- */
    if (!order.shiprocketShipmentId) {
      const address = order.shippingAddress;

      if (!address.city || !address.state || !address.pincode) {
        throw new appError(
          "The shipping address needs a city, state and pincode",
          400,
        );
      }

      const user = await User.findById(order.user).select("email").lean();
      const email = user?.email || process.env.SHIPROCKET_FALLBACK_EMAIL || "";

      if (!email) {
        throw new appError(
          "No customer email found (set SHIPROCKET_FALLBACK_EMAIL as a fallback)",
          400,
        );
      }

      const created = await shiprocketRequest<CreateOrderResponse>(
        "post",
        "/orders/create/adhoc",
        buildShiprocketOrder(order, email),
      );

      if (!created.shipment_id) {
        throw new appError(
          created.message || "Shiprocket did not return a shipment id",
          502,
        );
      }

      order.shiprocketOrderId = String(created.order_id ?? "");
      order.shiprocketShipmentId = String(created.shipment_id);

      // Shiprocket can assign the courier by itself (auto-assign setting)
      if (created.awb_code) {
        order.awbCode = created.awb_code;
        order.courierName = created.courier_name ?? "";
      }

      await order.save();
    }

    /* ---- 2. assign a courier -> AWB (tracking number) ---- */
    if (!order.awbCode) {
      const assigned = await shiprocketRequest<AssignAwbResponse>(
        "post",
        "/courier/assign/awb",
        { shipment_id: Number(order.shiprocketShipmentId) },
      );

      const data = assigned.response?.data;

      if (assigned.awb_assign_status !== 1 || !data?.awb_code) {
        throw new appError(
          assigned.message ||
            "Could not assign a courier (check your Shiprocket wallet balance)",
          502,
        );
      }

      order.awbCode = data.awb_code;
      order.courierName = data.courier_name ?? "";
      await order.save();
    }

    /* ---- 3. schedule the pickup (best effort) ---- */
    try {
      await shiprocketRequest("post", "/courier/generate/pickup", {
        shipment_id: [Number(order.shiprocketShipmentId)],
      });
    } catch (error) {
      console.warn(
        `Pickup was not scheduled for ${order.orderNumber}:`,
        (error as Error).message,
      );
    }

    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          shipmentStatus: "AWB Assigned",
          trackingUrl: `https://shiprocket.co/tracking/${order.awbCode}`,
          shipmentError: "",
        },
      },
    );

    return { created: true };
  } catch (error) {
    // keep what was already done, remember the reason, allow a retry
    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          shipmentStatus: "failed",
          shipmentError: error instanceof Error ? error.message : String(error),
        },
      },
    );

    throw error;
  }
};

// Used right after an order is paid / placed as COD. It never throws, so a
// Shiprocket problem can never break checkout. Failed shipments can be
// retried from the admin endpoint.
export const createShipmentSafely = async (orderId: string) => {
  if (process.env.SHIPROCKET_AUTO_CREATE === "false") return;
  if (!isShiprocketConfigured()) return;

  try {
    const result = await createShipmentForOrder(orderId);

    if (!result.created) {
      console.warn(`Shipment skipped for order ${orderId}: ${result.reason}`);
    }
  } catch (error) {
    console.error(
      `Shipment failed for order ${orderId}:`,
      (error as Error).message,
    );
  }
};

/* =========================================================
   Tracking + status updates
========================================================= */

type TrackResponse = {
  tracking_data?: {
    track_status?: number;
    shipment_track?: { current_status?: string }[];
    shipment_track_activities?: {
      date?: string;
      activity?: string;
      location?: string;
      "sr-status-label"?: string;
    }[];
    error?: string;
  };
};

export type TimelineEntry = {
  date: string;
  status: string;
  location: string;
};

export const fetchTracking = async (awbCode: string) => {
  const data = await shiprocketRequest<TrackResponse>(
    "get",
    `/courier/track/awb/${encodeURIComponent(awbCode)}`,
  );

  const tracking = data.tracking_data;

  // track_status 1 = tracking is available
  if (!tracking || tracking.track_status !== 1) {
    return { currentStatus: "", timeline: [] as TimelineEntry[] };
  }

  const timeline: TimelineEntry[] = (
    tracking.shipment_track_activities ?? []
  ).map((item) => ({
    date: item.date ?? "",
    status: item.activity || item["sr-status-label"] || "",
    location: item.location ?? "",
  }));

  return {
    currentStatus: tracking.shipment_track?.[0]?.current_status ?? "",
    timeline,
  };
};

const ORDER_STATUS_RANK: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
};

// Shiprocket status text -> our order status (null = leave as it is)
export const toOrderStatus = (
  rawStatus: string,
): "shipped" | "delivered" | null => {
  const status = rawStatus.trim().toUpperCase();

  if (!status || status.includes("RTO")) return null;
  if (status === "DELIVERED") return "delivered";

  const onTheWay = [
    "PICKED UP",
    "SHIPPED",
    "IN TRANSIT",
    "OUT FOR DELIVERY",
    "UNDELIVERED",
  ];

  return onTheWay.some((word) => status.includes(word)) ? "shipped" : null;
};

// Saves the Shiprocket status and moves the order forward
// (confirmed -> shipped -> delivered). It never moves an order backwards
// and never touches a cancelled order.
export const applyShipmentStatus = async (
  filter: FilterQuery<IOrder>,
  rawStatus: string,
) => {
  const status = rawStatus.trim();
  if (!status) return;

  const order = await Order.findOne(filter).select("orderStatus");
  if (!order) return;

  const update: Record<string, string> = { shipmentStatus: status };
  const target = toOrderStatus(status);

  if (
    target &&
    order.orderStatus !== "cancelled" &&
    ORDER_STATUS_RANK[target] > (ORDER_STATUS_RANK[order.orderStatus] ?? 0)
  ) {
    update.orderStatus = target;
  }

  await Order.updateOne({ _id: order._id }, { $set: update });
};
