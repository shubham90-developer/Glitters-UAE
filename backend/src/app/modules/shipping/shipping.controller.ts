import crypto from "crypto";
import { Request, Response } from "express";
import z from "zod";

import { appError } from "../../errors/appError";
import { catchAsync } from "../../utils/catchAsync";
import { Order } from "../orders/order.model";
import { getUserId } from "../orders/order.controller";
import {
  applyShipmentStatus,
  createShipmentForOrder,
  fetchTracking,
  isShiprocketConfigured,
  TimelineEntry,
} from "./shiprocket.service";

const orderParamsSchema = z.object({
  orderId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid order id"),
});

const sendOk = (res: Response, message: string, data: unknown) =>
  res.status(200).json({ success: true, statusCode: 200, message, data });

/* =========================================================
   CUSTOMER: track my order
   GET /shipping/track/:orderId
========================================================= */
export const getOrderTracking = catchAsync(
  async (req: Request, res: Response) => {
    const userId = await getUserId(req);
    const { orderId } = orderParamsSchema.parse(req.params);

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new appError("Order not found", 404);
    }

    let timeline: TimelineEntry[] = [];

    // live tracking from Shiprocket. If Shiprocket is down we still return
    // what is saved on the order.
    if (order.awbCode && isShiprocketConfigured()) {
      try {
        const live = await fetchTracking(order.awbCode);
        timeline = live.timeline;

        if (live.currentStatus && live.currentStatus !== order.shipmentStatus) {
          await applyShipmentStatus({ _id: order._id }, live.currentStatus);
        }
      } catch (error) {
        console.error("Live tracking failed:", (error as Error).message);
      }
    }

    // read again: the status may have just been updated
    const latest = (await Order.findById(orderId)) ?? order;

    sendOk(res, "Tracking fetched", {
      orderId: String(latest._id),
      orderNumber: latest.orderNumber,
      orderStatus: latest.orderStatus,
      paymentMethod: latest.paymentMethod,
      paymentStatus: latest.paymentStatus,
      // null until a courier is assigned
      shipment: latest.awbCode
        ? {
            awbCode: latest.awbCode,
            courierName: latest.courierName,
            status: latest.shipmentStatus,
            trackingUrl: latest.trackingUrl,
          }
        : null,
      timeline,
    });
  },
);

/* =========================================================
   ADMIN: create / retry the shipment of an order
   POST /shipping/admin/orders/:orderId/create
========================================================= */
export const createShipmentAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = orderParamsSchema.parse(req.params);

    // a Shiprocket failure is thrown with its message so the admin sees why
    const result = await createShipmentForOrder(orderId);

    const order = await Order.findById(orderId).select("+shipmentError");

    sendOk(
      res,
      result.created
        ? "Shipment created"
        : (result.reason ?? "Shipment was not created"),
      {
        created: result.created,
        orderId,
        shiprocketOrderId: order?.shiprocketOrderId ?? "",
        awbCode: order?.awbCode ?? "",
        courierName: order?.courierName ?? "",
        shipmentStatus: order?.shipmentStatus ?? "",
        error: order?.shipmentError ?? "",
      },
    );
  },
);

const safeEqual = (a: string, b: string) => {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  return (
    first.length === second.length && crypto.timingSafeEqual(first, second)
  );
};

export const shiprocketWebhook = catchAsync(
  async (req: Request, res: Response) => {
    const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    const received = req.header("x-api-key") ?? "";

    // no token configured = webhook is closed
    if (!expected || !safeEqual(received, expected)) {
      throw new appError("Unauthorized", 401);
    }

    const body = (req.body ?? {}) as {
      awb?: string | number;
      order_id?: string | number;
      current_status?: string;
    };

    const status = String(body.current_status ?? "");

    if (body.awb) {
      await applyShipmentStatus({ awbCode: String(body.awb) }, status);
    } else if (body.order_id) {
      // order_id is our orderNumber (we send it when creating the shipment)
      await applyShipmentStatus({ orderNumber: String(body.order_id) }, status);
    }

    // always answer 200 so Shiprocket does not keep retrying
    res.status(200).json({ success: true });
  },
);
