"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiLoader } from "react-icons/fi";

import {
  useCancelPaymentMutation,
  useVerifyTabbyPaymentMutation,
} from "@/store/ordersApi";

type ViewState = "loading" | "pending" | "failed" | "error";

// messages approved by Tabby for the redirects
const CANCEL_MESSAGE =
  "You aborted the payment. Please retry or choose another payment method.";
const FAILURE_MESSAGE =
  "Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order.";

// Tabby sends the customer back here:
//   /checkout/payment-status?result=success|cancel|failure&order=<orderId>
const PaymentStatus = () => {
  const router = useRouter();
  const params = useSearchParams();

  const result = params.get("result") ?? "";
  const orderId = params.get("order") ?? "";

  const [view, setView] = useState<ViewState>("loading");
  const [message, setMessage] = useState("");

  const [verifyTabbyPayment] = useVerifyTabbyPaymentMutation();
  const [cancelPayment] = useCancelPaymentMutation();

  // the backend asks Tabby for the real status (the URL alone is not trusted)
  const confirm = useCallback(async () => {
    if (!orderId) {
      setMessage("We could not find this order.");
      setView("error");
      return;
    }

    setView("loading");

    try {
      if (result === "success") {
        const { data } = await verifyTabbyPayment({ orderId }).unwrap();

        if (data.status === "paid") {
          router.replace(`/order-success?order=${orderId}`);
          return;
        }

        if (data.status === "pending") {
          setMessage(
            "We are still waiting for Tabby to confirm your payment. Please check again in a moment.",
          );
          setView("pending");
          return;
        }

        setMessage(FAILURE_MESSAGE);
        setView("failed");
        return;
      }

      // cancel / failure: frees the stock, the cart is kept
      const { data } = await cancelPayment({ orderId }).unwrap();

      // paid before cancelling
      if (data.status === "paid") {
        router.replace(`/order-success?order=${orderId}`);
        return;
      }

      setMessage(result === "cancel" ? CANCEL_MESSAGE : FAILURE_MESSAGE);
      setView("failed");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      setMessage(
        err?.data?.message ||
          "We could not confirm your payment. Please try again.",
      );
      setView("error");
    }
  }, [orderId, result, router, verifyTabbyPayment, cancelPayment]);

  // run once (React strict mode runs effects twice in development)
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    confirm();
  }, [confirm]);

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-10 dark:bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-md px-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-[0_5px_24px_rgba(0,0,0,0.04)] dark:border-gray-800 dark:bg-[#181818]">
          {view === "loading" ? (
            <>
              <FiLoader
                size={30}
                className="mx-auto animate-spin text-gray-500"
              />
              <p className="mt-4 font-serif text-[16px] font-extrabold text-black dark:text-white">
                Confirming your payment...
              </p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                Please do not close or refresh this page.
              </p>
            </>
          ) : (
            <>
              <FiAlertCircle size={30} className="mx-auto text-red-500" />
              <p className="mt-4 font-serif text-[16px] font-extrabold text-black dark:text-white">
                {view === "pending"
                  ? "Payment not confirmed yet"
                  : "Payment not completed"}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                {message}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                {view === "pending" && (
                  <button
                    type="button"
                    onClick={confirm}
                    className="flex h-11 items-center justify-center rounded-xl bg-[#ffd83d] text-[11px] font-extrabold text-black transition hover:bg-[#ffcf12]"
                  >
                    Check again
                  </button>
                )}

                <Link
                  href="/checkout"
                  className="flex h-11 items-center justify-center rounded-xl bg-[#ffd83d] text-[11px] font-extrabold text-black transition hover:bg-[#ffcf12]"
                >
                  Back to checkout
                </Link>

                <Link
                  href="/"
                  className="flex h-11 items-center justify-center rounded-xl border border-gray-300 text-[11px] font-extrabold text-black transition hover:border-[#ffd83d] dark:border-gray-700 dark:text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentStatus;
