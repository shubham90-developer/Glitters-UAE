"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FiCheck, FiMapPin, FiPackage } from "react-icons/fi";

import { useGetOrderByIdQuery } from "@/store/ordersApi";

const IMAGE_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const formatAED = (n: number) => `AED ${n.toLocaleString()}`;

const resolveImage = (src?: string) => {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/.test(src)) return src;
  return `${IMAGE_BASE}/${src.replace(/^\/+/, "")}`;
};

const PAYMENT_LABELS: Record<string, string> = {
  card: "Credit / Debit Card",
  upi: "UPI",
  razorpay: "Razorpay",
  tabby: "Tabby",
  cod: "Cash on Delivery",
  "apple-pay": "Apple Pay",
};

const OrderSuccess = () => {
  const orderId = useSearchParams().get("order") ?? "";

  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderByIdQuery(orderId, { skip: !orderId });

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-6 sm:py-10 dark:bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-2xl px-3 sm:px-5">
        {isLoading && (
          <p className="py-20 text-center text-[12px] text-gray-400">
            Loading your order...
          </p>
        )}

        {(!orderId || isError) && !isLoading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-[#181818]">
            <p className="font-serif text-[16px] font-extrabold text-black dark:text-white">
              We could not find this order
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#ffd83d] px-5 text-[11px] font-extrabold text-black"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {order && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_5px_24px_rgba(0,0,0,0.04)] sm:p-6 dark:border-gray-800 dark:bg-[#181818]">
            {/* HEADER */}
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffd83d] text-black">
                <FiCheck size={26} />
              </span>

              <h1 className="mt-4 font-serif text-[20px] font-extrabold text-black sm:text-[24px] dark:text-white">
                Order placed successfully
              </h1>

              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                Order No:{" "}
                <b className="text-black dark:text-white">
                  {order.orderNumber}
                </b>
              </p>
            </div>

            {/* ITEMS */}
            <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              {order.items.map((item) => {
                const src = resolveImage(item.image);

                return (
                  <div
                    key={item._id}
                    className="flex gap-3 rounded-xl border border-gray-100 p-2.5 dark:border-gray-800"
                  >
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f8f8f8] p-1.5 dark:bg-[#222]">
                      {src ? (
                        <Image
                          src={src}
                          alt={item.productName}
                          width={70}
                          height={70}
                          unoptimized
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <FiPackage className="text-gray-400" size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {item.brand && (
                        <p className="truncate text-[8px] font-bold uppercase tracking-wider text-gray-400">
                          {item.brand}
                        </p>
                      )}

                      <h3 className="line-clamp-2 font-serif text-[11px] font-bold leading-4 text-black dark:text-white">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-[9px] text-gray-500 dark:text-gray-400">
                        {[
                          item.color && `Color: ${item.color}`,
                          item.size && `Size: ${item.size}`,
                        ]
                          .filter(Boolean)
                          .join("  |  ")}
                      </p>
                    </div>

                    <div className="text-right text-[10px]">
                      <p className="font-bold text-black dark:text-white">
                        {formatAED(item.lineTotal)}
                      </p>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {formatAED(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ADDRESS + PAYMENT */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#f8f8f8] p-3 dark:bg-[#202020]">
                <p className="flex items-center gap-1.5 text-[10px] font-bold text-black dark:text-white">
                  <FiMapPin size={11} /> Delivery address
                </p>
                <p className="mt-1.5 text-[10px] font-semibold text-black dark:text-white">
                  {order.shippingAddress.name}
                </p>
                <p className="mt-0.5 text-[10px] leading-4 text-gray-500 dark:text-gray-400">
                  {order.shippingAddress.address}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                  {order.shippingAddress.phone}
                </p>
              </div>

              <div className="rounded-xl bg-[#f8f8f8] p-3 dark:bg-[#202020]">
                <p className="text-[10px] font-bold text-black dark:text-white">
                  Payment
                </p>
                <p className="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                  {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </p>
                <p className="mt-0.5 text-[10px] capitalize text-gray-500 dark:text-gray-400">
                  Status: {order.paymentStatus}
                </p>
              </div>
            </div>

            {/* TOTALS */}
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-[11px] dark:border-gray-800">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span className="font-bold text-black dark:text-white">
                  {formatAED(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span
                  className={`font-bold ${
                    order.shipping === 0
                      ? "text-green-600"
                      : "text-black dark:text-white"
                  }`}
                >
                  {order.shipping === 0 ? "Free" : formatAED(order.shipping)}
                </span>
              </div>

              <div className="flex items-end justify-between pt-2">
                <span className="text-[14px] font-bold text-black dark:text-white">
                  Total
                </span>
                <span className="font-serif text-[20px] font-extrabold text-black dark:text-white">
                  {formatAED(order.total)}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/"
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#ffd83d] text-[11px] font-extrabold text-black transition hover:bg-[#ffcf12]"
              >
                Continue Shopping
              </Link>

              <Link
                href="/track-order"
                className="flex h-11 flex-1 items-center justify-center rounded-xl border border-gray-300 text-[11px] font-extrabold text-black transition hover:border-[#ffd83d] dark:border-gray-700 dark:text-white"
              >
                Track Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderSuccess;
