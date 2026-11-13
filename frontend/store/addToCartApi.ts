/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IProduct {
  _id: string;
  productName: string;
  category: string;
  subCategory: string;
  material: string;
  section: string;
  brand: string;
  dealOfTheDay: boolean;
  coupon: string;
  tags: string[];
  videoUrl: string;
  variants: any[];
  shortDesc: string;
  desc: string;
  additionalInformation: string;
  shippingReturnPolicy: string;
  specifications: any[];
  reviews: any[];
  status: "active" | "inactive";
  isDeleted: boolean;
}

export interface IAddToCart {
  _id: string;
  product: IProduct; // populate ke baad single object aata hai
  variantId?: string | null; // selected variant (color + size)
  quantity: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IAddToCartResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  totalItems?: number;
  data: T;
}

interface IAddToCartBody {
  product: string; // product ki _id
  variantId?: string; // selected variant ki _id
  quantity?: number;
}

export const addToCartApi = createApi({
  reducerPath: "addToCartApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["AddToCart"],

  endpoints: (builder) => ({
    // GET all cart items
    getAddToCart: builder.query<IAddToCart[], void>({
      query: () => ({
        url: "/add-to-cart",
        method: "GET",
      }),
      transformResponse: (
        response: IAddToCartResponse<IAddToCart[]>,
      ): IAddToCart[] => response.data,
      providesTags: ["AddToCart"],
    }),

    // GET single cart item
    getAddToCartById: builder.query<IAddToCart, string>({
      query: (id) => ({
        url: `/add-to-cart/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: IAddToCartResponse<IAddToCart>,
      ): IAddToCart => response.data,
      providesTags: ["AddToCart"],
    }),

    // ADD to cart
    addToCart: builder.mutation<IAddToCartResponse<IAddToCart>, IAddToCartBody>(
      {
        query: (body) => ({
          url: "/add-to-cart",
          method: "POST",
          body,
        }),
        invalidatesTags: ["AddToCart"],
      },
    ),

    // UPDATE quantity
    updateCart: builder.mutation<
      IAddToCartResponse<IAddToCart>,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/add-to-cart/${id}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["AddToCart"],
    }),

    // DELETE one item
    deleteCart: builder.mutation<IAddToCartResponse<IAddToCart>, string>({
      query: (id) => ({
        url: `/add-to-cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AddToCart"],
    }),

    // CLEAR full cart
    clearCart: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/add-to-cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["AddToCart"],
    }),
  }),
});

export const {
  useGetAddToCartQuery,
  useGetAddToCartByIdQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useClearCartMutation,
} = addToCartApi;
