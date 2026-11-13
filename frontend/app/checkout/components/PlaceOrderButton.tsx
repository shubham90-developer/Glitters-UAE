"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiLoader, FiShoppingBag } from "react-icons/fi";
import { toast } from "react-toastify";

import { auth } from "@/firebase/config";
import { openAccountMenu } from "@/lib/authPopover";
import {
  ICreateOrderBody,
  IRazorpayPayment,
  PaymentMethod,
  useCancelPaymentMutation,
  useCreateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useCreateTabbyPaymentMutation,
  useVerifyRazorpayPaymentMutation,
} from "@/store/ordersApi";

/* ====================================================== */
/* RAZORPAY BROWSER TYPES (checkout.js adds window.Razorpay) */
/* ====================================================== */

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: { error: { description?: string } }) => void,
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/* ====================================================== */
/* HELPERS */
/* ====================================================== */

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

// loads checkout.js once (resolves false if it cannot be loaded)
const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// backend message from an RTK Query error (or a plain Error)
const getErrorMessage = (error: unknown) => {
  const err = error as { data?: { message?: string }; message?: string };
  return (
    err?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again."
  );
};

type Method = "cod" | "razorpay" | "tabby";

/* ====================================================== */
/* COMPONENT */
/* ====================================================== */

type PlaceOrderButtonProps = {
  shippingAddress?: ICreateOrderBody["shippingAddress"] | null;
  paymentMethod?: PaymentMethod;
  disabled?: boolean;
};

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  shippingAddress,
  paymentMethod = "card",
  disabled = false,
}) => {
  const router = useRouter();

  // method currently being processed (null = idle)
  const [busy, setBusy] = useState<Method | null>(null);

  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();
  const [createTabbyPayment] = useCreateTabbyPaymentMutation();
  const [cancelPayment] = useCancelPaymentMutation();

  // frees the reserved stock again (cart is kept). Safe to call twice.
  const cancelOrder = async (orderId: string) => {
    try {
      await cancelPayment({ orderId }).unwrap();
    } catch {
      /* the backend also cleans up old unpaid orders by itself */
    }
  };

  /* ---------- CASH ON DELIVERY ---------- */
  const payWithCod = async (address: ICreateOrderBody["shippingAddress"]) => {
    const created = await createOrder({
      shippingAddress: address,
      paymentMethod: "cod",
    }).unwrap();

    // order is placed; success page takes over (busy stays on while navigating)
    router.replace(`/order-success?order=${created.data._id}`);
  };

  /* ---------- RAZORPAY ---------- */
  const payWithRazorpay = async (
    address: ICreateOrderBody["shippingAddress"],
  ) => {
    // load the script first so a failure here does not leave an unpaid order
    const loaded = await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {
      throw new Error(
        "Could not load Razorpay. Check your internet connection and try again.",
      );
    }

    // 1. order is created as "pending" (cart stays until the payment is done)
    const created = await createOrder({
      shippingAddress: address,
      paymentMethod: "razorpay",
    }).unwrap();

    const orderId = created.data._id;

    try {
      // 2. backend creates the Razorpay order (amount comes from the server)
      const payment: IRazorpayPayment = (
        await createRazorpayPayment({ orderId }).unwrap()
      ).data;

      let paymentDone = false;

      // 3. open the Razorpay window
      const razorpay = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "Glitters",
        description: `Order ${payment.orderNumber}`,
        order_id: payment.razorpayOrderId,
        prefill: payment.prefill,
        theme: { color: "#ffd83d" },

        // 4. payment done -> backend verifies the signature
        handler: async (response) => {
          paymentDone = true;

          try {
            await verifyRazorpayPayment({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            router.replace(`/order-success?order=${orderId}`);
          } catch (error) {
            toast.error(
              `${getErrorMessage(error)} If money was deducted, please contact support with order ${payment.orderNumber}.`,
            );
            setBusy(null);
          }
        },

        // customer closed the window without paying
        modal: {
          ondismiss: async () => {
            if (paymentDone) return;

            await cancelOrder(orderId);
            toast.info("Payment cancelled. Your cart is safe.");
            setBusy(null);
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        toast.error(
          response.error.description || "Payment failed. Please try again.",
        );
      });

      razorpay.open();
    } catch (error) {
      await cancelOrder(orderId);
      throw error;
    }
  };

  /* ---------- TABBY ---------- */
  const payWithTabby = async (address: ICreateOrderBody["shippingAddress"]) => {
    // 1. order is created as "pending" (cart stays until the payment is done)
    const created = await createOrder({
      shippingAddress: address,
      paymentMethod: "tabby",
    }).unwrap();

    const orderId = created.data._id;

    try {
      // 2. backend creates the Tabby session
      const session = await createTabbyPayment({ orderId }).unwrap();

      // 3. go to the Tabby page. Tabby sends the customer back to
      //    /checkout/payment-status where the payment is verified.
      window.location.assign(session.data.webUrl);
    } catch (error) {
      await cancelOrder(orderId);
      throw error;
    }
  };

  /* ---------- run the method selected on the checkout page ---------- */
  const runPayment = async (
    method: Method,
    address: ICreateOrderBody["shippingAddress"],
  ) => {
    if (busy) return;

    setBusy(method);

    try {
      if (method === "cod") {
        await payWithCod(address);
      } else if (method === "razorpay") {
        await payWithRazorpay(address);
      } else {
        await payWithTabby(address);
      }
      // success: busy stays on while the page navigates or the Razorpay window is open
    } catch (error) {
      toast.error(getErrorMessage(error));
      setBusy(null);
    }
  };

  /* ---------- Place Order click ---------- */
  const handlePlaceOrder = () => {
    if (!auth.currentUser) {
      toast.info("Please log in to place your order");
      openAccountMenu();
      return;
    }

    if (!shippingAddress) {
      toast.error("Please select a delivery address first");
      return;
    }

    if (
      paymentMethod === "cod" ||
      paymentMethod === "razorpay" ||
      paymentMethod === "tabby"
    ) {
      runPayment(paymentMethod, shippingAddress);
      return;
    }

    toast.info(
      "This payment method is not available yet. Please choose another.",
    );
  };

  return (
    <button
      type="button"
      onClick={handlePlaceOrder}
      disabled={disabled || !!busy}
      className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ffd83d] text-[11px] font-extrabold text-black transition-all hover:bg-[#ffcf12] hover:shadow-[0_6px_18px_rgba(255,216,61,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
    >
      {busy ? (
        <>
          <FiLoader size={14} className="animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <FiShoppingBag size={14} />
          Place Order
        </>
      )}
    </button>
  );
};

export default PlaceOrderButton;
