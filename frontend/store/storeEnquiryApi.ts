import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IStoreEnquiry {
  _id: string;
  storeName: string;
  fullName: string;
  phone: string;
  email: string;
  msg: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// payload sent when a customer submits the store enquiry form
export interface ICreateStoreEnquiry {
  fullName: string;
  email: string;
  phone: string;
  msg: string;
  storeName: string; // store _id
}

interface StoreResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IStoreEnquiry | IStoreEnquiry[];
}

export const storeEnquiryApi = createApi({
  reducerPath: "storeEnquiryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Store"],

  endpoints: (builder) => ({
    getStore: builder.query<IStoreEnquiry[], void>({
      query: () => ({
        url: "/store-enquiries",
        method: "GET",
      }),

      transformResponse: (response: StoreResponse): IStoreEnquiry[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["Store"],
    }),

    // single
    getStoreById: builder.query<IStoreEnquiry, string>({
      query: (id) => `/store-enquiries/${id}`,
      transformResponse: (response: StoreResponse) =>
        response.data as IStoreEnquiry,
      providesTags: (result, error, id) => [{ type: "Store", id }],
    }),

    // create team api
    createStore: builder.mutation<IStoreEnquiry, ICreateStoreEnquiry>({
      query: (payload) => ({
        url: "/store-enquiries",
        method: "POST",
        body: payload,
      }),

      transformResponse: (response: StoreResponse) =>
        response.data as IStoreEnquiry,

      invalidatesTags: ["Store"],
    }),

    // update team api
    updateStore: builder.mutation<
      IStoreEnquiry,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/store-enquiries/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: StoreResponse) =>
        response.data as IStoreEnquiry,
      invalidatesTags: ["Store"],
    }),

    // delete team api
    deleteStore: builder.mutation<IStoreEnquiry, string>({
      query: (id) => ({
        url: `/store-enquiries/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: StoreResponse) =>
        response.data as IStoreEnquiry,

      invalidatesTags: ["Store"],
    }),
  }),
});

export const {
  useGetStoreQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeEnquiryApi;
