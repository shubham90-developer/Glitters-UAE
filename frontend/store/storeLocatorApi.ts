import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IStoreLocator {
  _id: string;

  badgeTitle: string;

  img: string;

  storeName: string;

  rating: string;

  shortDesc: string;

  address: string;

  phone: string;

  email: string;

  workingHours: string;

  qrcode: string;

  facebook: string;

  instagram: string;

  twitter: string;

  youtube: string;

  status: "active" | "inactive";

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface IStoreResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IStoreLocator | IStoreLocator[];
}

export const storeLocatorApi = createApi({
  reducerPath: "storeLocatorApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["StoreResponse"],

  endpoints: (builder) => ({
    getStoreLocator: builder.query<IStoreLocator[], void>({
      query: () => ({
        url: "/store-locations",
        method: "GET",
      }),

      transformResponse: (response: IStoreResponse): IStoreLocator[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["StoreResponse"],
    }),

    // single
    getStoreLocatorById: builder.query<IStoreLocator, string>({
      query: (id) => `/store-locations/${id}`,
      transformResponse: (response: IStoreResponse) =>
        response.data as IStoreLocator,
      providesTags: (result, error, id) => [{ type: "StoreResponse", id }],
    }),

    // create team api
    createStoreLocator: builder.mutation<IStoreLocator, FormData>({
      query: (formData) => ({
        url: "/store-locations",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: IStoreResponse) =>
        response.data as IStoreLocator,

      invalidatesTags: ["StoreResponse"],
    }),

    // update team api
    updateStoreLocator: builder.mutation<
      IStoreLocator,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/store-locations/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: IStoreResponse) =>
        response.data as IStoreLocator,
      invalidatesTags: ["StoreResponse"],
    }),

    // delete team api
    deleteStoreLocator: builder.mutation<IStoreLocator, string>({
      query: (id) => ({
        url: `/store-locations/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: IStoreResponse) =>
        response.data as IStoreLocator,

      invalidatesTags: ["StoreResponse"],
    }),
  }),
});

export const {
  useGetStoreLocatorQuery,
  useGetStoreLocatorByIdQuery,
  useCreateStoreLocatorMutation,
  useUpdateStoreLocatorMutation,
  useDeleteStoreLocatorMutation,
} = storeLocatorApi;
