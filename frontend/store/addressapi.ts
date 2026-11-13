import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { auth } from "@/firebase/config";

/* =========================================================
   Types
========================================================= */

export interface IAddress {
  _id: string;
  type: "Home" | "Office";
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAddressBody {
  type: "Home" | "Office";
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface IAddressResponse<T> {
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
   Address API
========================================================= */

export const addressApi = createApi({
  reducerPath: "addressApi",

  baseQuery,

  tagTypes: ["Address"],

  endpoints: (builder) => ({
    getAddresses: builder.query<IAddress[], void>({
      query: () => "/addresses",

      transformResponse: (response: IAddressResponse<IAddress[]>) =>
        response.data ?? [],

      providesTags: ["Address"],
    }),

    addAddress: builder.mutation<IAddressResponse<IAddress>, IAddressBody>({
      query: (body) => ({
        url: "/addresses",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Address"],
    }),

    updateAddress: builder.mutation<
      IAddressResponse<IAddress>,
      { id: string; body: IAddressBody }
    >({
      query: ({ id, body }) => ({
        url: `/addresses/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Address"],
    }),

    deleteAddress: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
