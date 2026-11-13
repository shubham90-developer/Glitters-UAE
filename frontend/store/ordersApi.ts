import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { auth } from "@/firebase/config";
import { addToCartApi } from "./addToCartApi";

/* =========================================================
   Types
========================================================= */

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
  _id: string;
  product: string;
  variantId: string;
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

export interface IOrder {
  _id: string;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOrderBody {
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
}

/* ---------- online payments (Razorpay / Tabby) ---------- */

// what the backend returns to open the Razorpay window
export interface IRazorpayPayment {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number; // smallest currency unit
  currency: string;
  keyId: string; // public key id
  prefill: { name: string; contact: string; email: string };
}

// what Razorpay gives back after a successful payment
export interface IRazorpayVerifyBody {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ITabbySession {
  orderId: string;
  webUrl: string; // Tabby hosted payment page
}

export type OnlinePaymentStatus = "paid" | "failed" | "pending";

export interface IPaymentResult {
  orderId: string;
  status: OnlinePaymentStatus;
}

interface IOrderResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/* =========================================================
   Base Query (adds Firebase token)
========================================================= */

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,

  prepareHeaders: async (headers) => {
    try {
      await auth.authStateReady();

      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Firebase token error:", error);
    }

    return headers;
  },
});

/* =========================================================
   Orders API
========================================================= */

export const ordersApi = createApi({
  reducerPath: "ordersApi",

  baseQuery,

  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // PLACE ORDER (uses the current cart)
    createOrder: builder.mutation<IOrderResponse<IOrder>, ICreateOrderBody>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],

      // the backend empties the cart, so refresh the cart data too
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(addToCartApi.util.invalidateTags(["AddToCart"]));
        } catch {
          /* order failed - cart stays as it is */
        }
      },
    }),

    // RAZORPAY: step 1 - create the Razorpay order for an existing order
    createRazorpayPayment: builder.mutation<
      IOrderResponse<IRazorpayPayment>,
      { orderId: string }
    >({
      query: (body) => ({
        url: "/payments/razorpay/create",
        method: "POST",
        body,
      }),
    }),

    // RAZORPAY: step 2 - backend checks the signature and marks the order paid
    verifyRazorpayPayment: builder.mutation<
      IOrderResponse<IPaymentResult>,
      IRazorpayVerifyBody
    >({
      query: (body) => ({
        url: "/payments/razorpay/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],

      // the cart is emptied once the payment is confirmed
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(addToCartApi.util.invalidateTags(["AddToCart"]));
        } catch {
          /* not confirmed - cart stays as it is */
        }
      },
    }),

    // TABBY: step 1 - create a Tabby session, returns the page to redirect to
    createTabbyPayment: builder.mutation<
      IOrderResponse<ITabbySession>,
      { orderId: string }
    >({
      query: (body) => ({
        url: "/payments/tabby/create",
        method: "POST",
        body,
      }),
    }),

    // TABBY: step 2 - after the redirect back, backend asks Tabby for the status
    verifyTabbyPayment: builder.mutation<
      IOrderResponse<IPaymentResult>,
      { orderId: string }
    >({
      query: (body) => ({
        url: "/payments/tabby/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(addToCartApi.util.invalidateTags(["AddToCart"]));
        } catch {
          /* not confirmed - cart stays as it is */
        }
      },
    }),

    // customer closed the payment window / cancelled: frees the stock,
    // the cart is kept so they can try again
    cancelPayment: builder.mutation<
      IOrderResponse<IPaymentResult>,
      { orderId: string }
    >({
      query: (body) => ({
        url: "/payments/cancel",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // MY ORDERS
    getMyOrders: builder.query<IOrder[], void>({
      query: () => "/orders",
      transformResponse: (response: IOrderResponse<IOrder[]>) => response.data,
      providesTags: ["Orders"],
    }),

    // ONE ORDER
    getOrderById: builder.query<IOrder, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: IOrderResponse<IOrder>) => response.data,
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useVerifyRazorpayPaymentMutation,
  useCreateTabbyPaymentMutation,
  useVerifyTabbyPaymentMutation,
  useCancelPaymentMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApi;
