import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// =====================================================
// TYPES
// =====================================================

export interface IProductRef {
  _id: string;
  productName?: string;
  image?: string;
}

export interface IReturnRequest {
  _id: string;

  orderNumber: string;
  emailAddress: string;

  product: string | IProductRef;

  reason: string;
  additionalDetails: string;

  isConfirmed: boolean;

  status: "pending" | "approved" | "rejected" | "received" | "refunded";

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

// =====================================================
// CREATE PAYLOAD
// =====================================================

export interface ICreateReturnRequestPayload {
  orderNumber: string;
  emailAddress: string;

  product: string;

  reason: string;
  additionalDetails: string;

  isConfirmed: boolean;
}

// =====================================================
// UPDATE PAYLOAD
// =====================================================

export interface IUpdateReturnRequestPayload {
  orderNumber?: string;
  emailAddress?: string;

  product?: string;

  reason?: string;
  additionalDetails?: string;

  isConfirmed?: boolean;

  status?: "pending" | "approved" | "rejected" | "received" | "refunded";
}

// =====================================================
// RESPONSE
// =====================================================

interface IReturnRequestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IReturnRequest | IReturnRequest[];
}

// =====================================================
// API
// =====================================================

export const returnRequestApi = createApi({
  reducerPath: "returnRequestApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["ReturnRequest"],

  endpoints: (builder) => ({
    // ============================================
    // GET ALL
    // ============================================

    getReturnRequest: builder.query<IReturnRequest[], void>({
      query: () => ({
        url: "/return-request",
        method: "GET",
      }),

      transformResponse: (response: IReturnRequestResponse) => {
        if (Array.isArray(response.data)) {
          return response.data;
        }

        return response.data ? [response.data] : [];
      },

      providesTags: ["ReturnRequest"],
    }),

    // ============================================
    // GET BY ID
    // ============================================

    getReturnRequestById: builder.query<IReturnRequest, string>({
      query: (_id) => ({
        url: `/return-request/${_id}`,
        method: "GET",
      }),

      transformResponse: (response: IReturnRequestResponse) =>
        response.data as IReturnRequest,

      providesTags: (result, error, _id) => [
        {
          type: "ReturnRequest",
          id: _id,
        },
      ],
    }),

    // ============================================
    // CREATE
    // ============================================

    createReturnRequest: builder.mutation<
      IReturnRequest,
      ICreateReturnRequestPayload
    >({
      query: (body) => ({
        url: "/return-request",
        method: "POST",
        body,
      }),

      transformResponse: (response: IReturnRequestResponse) =>
        response.data as IReturnRequest,

      invalidatesTags: ["ReturnRequest"],
    }),

    // ============================================
    // UPDATE
    // ============================================

    updateReturnRequest: builder.mutation<
      IReturnRequest,
      {
        _id: string;
        data: IUpdateReturnRequestPayload;
      }
    >({
      query: ({ _id, data }) => ({
        url: `/return-request/${_id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: (response: IReturnRequestResponse) =>
        response.data as IReturnRequest,

      invalidatesTags: (result, error, arg) => [
        "ReturnRequest",
        {
          type: "ReturnRequest",
          id: arg._id,
        },
      ],
    }),

    // ============================================
    // DELETE
    // ============================================

    deleteReturnRequest: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (_id) => ({
        url: `/return-request/${_id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["ReturnRequest"],
    }),
  }),
});

// =====================================================
// HOOKS
// =====================================================

export const {
  useGetReturnRequestQuery,
  useGetReturnRequestByIdQuery,
  useCreateReturnRequestMutation,
  useUpdateReturnRequestMutation,
  useDeleteReturnRequestMutation,
} = returnRequestApi;
