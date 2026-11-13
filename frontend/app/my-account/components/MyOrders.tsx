"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { FiPackage } from "react-icons/fi";

import { IOrder, PaymentMethod, useGetMyOrdersQuery } from "@/store/ordersApi";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: "Credit / Debit Card",
  upi: "UPI",
  razorpay: "Razorpay",
  tabby: "Tabby",
  cod: "Cash on Delivery",
  "apple-pay": "Apple Pay",
};

const formatAED = (n: number) => `AED ${n.toLocaleString()}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type Tone = "green" | "blue" | "yellow" | "red";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  yellow:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

// one label for the badge, from the payment + order status
const getStatus = (order: IOrder): { label: string; tone: Tone } => {
  if (order.paymentStatus === "failed") {
    return { label: "Payment Failed", tone: "red" };
  }

  if (order.orderStatus === "cancelled") {
    return { label: "Cancelled", tone: "red" };
  }

  const isOnline =
    order.paymentMethod === "razorpay" || order.paymentMethod === "tabby";

  if (isOnline && order.paymentStatus === "pending") {
    return { label: "Payment Pending", tone: "yellow" };
  }

  switch (order.orderStatus) {
    case "delivered":
      return { label: "Delivered", tone: "green" };
    case "shipped":
      return { label: "Shipped", tone: "blue" };
    case "confirmed":
      return { label: "Confirmed", tone: "green" };
    default:
      return { label: "Processing", tone: "yellow" };
  }
};

// "Product name" or "Product name + 2 more"
const getProductTitle = (order: IOrder) => {
  const first = order.items[0]?.productName ?? "Order";
  const more = order.items.length - 1;
  return more > 0 ? `${first} + ${more} more` : first;
};

/* ====================================================== */
/* COMPONENT */
/* ====================================================== */

const MyOrders = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery();

  // newest first
  const orders = useMemo(
    () =>
      [...(data ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [data],
  );

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
        <div className="border-b border-gray-100 p-5 dark:border-white/10 sm:p-6">
          <h2 className="text-xl font-black text-gray-950 dark:text-white">
            My Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage your recent purchases.
          </p>
        </div>

        {/* LOADING */}
        {isLoading && (
          <p className="p-6 text-center text-sm text-gray-400">
            Loading your orders...
          </p>
        )}

        {/* ERROR */}
        {isError && !isLoading && (
          <p className="p-6 text-center text-sm text-red-500">
            Unable to load your orders. Please log in and try again.
          </p>
        )}

        {/* EMPTY */}
        {!isLoading && !isError && orders.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have not placed any orders yet.
            </p>

            <Link
              href="/"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#ffd83d] px-5 text-xs font-extrabold text-black"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* ORDERS */}
        {!isLoading && !isError && orders.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {orders.map((order) => {
              const status = getStatus(order);

              return (
                <article
                  key={order._id}
                  className="p-5 transition hover:bg-gray-50 dark:hover:bg-white/2 sm:p-6"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300">
                        <FiPackage size={19} />
                      </div>

                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                          {order.orderNumber}
                        </p>

                        <h3 className="mt-1 text-sm font-black text-gray-900 dark:text-white">
                          {getProductTitle(order)}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Ordered on {formatDate(order.createdAt)} ·{" "}
                          {PAYMENT_LABELS[order.paymentMethod] ??
                            order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-sm font-black text-gray-950 dark:text-white">
                        {formatAED(order.total)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${TONE_CLASSES[status.tone]}`}
                      >
                        {status.label}
                      </span>

                      <Link
                        href={"/track-order"}
                        className="cursor-pointer text-xs font-extrabold text-[#9d7b00] hover:underline dark:text-[#ffd83d]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
