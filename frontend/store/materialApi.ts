import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IMaterial {
  _id: string;
  name: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MaterialResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IMaterial | IMaterial[];
}

export const materialApi = createApi({
  reducerPath: "materialApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Material"],

  endpoints: (builder) => ({
    getMaterial: builder.query<IMaterial[], void>({
      query: () => ({
        url: "/material",
        method: "GET",
      }),

      transformResponse: (response: MaterialResponse): IMaterial[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["Material"],
    }),

    // single
    getMaterialById: builder.query<IMaterial, string>({
      query: (id) => `/material/${id}`,
      transformResponse: (response: MaterialResponse) =>
        response.data as IMaterial,
      providesTags: (result, error, id) => [{ type: "Material", id }],
    }),

    // create team api
    createMaterial: builder.mutation<IMaterial, FormData>({
      query: (formData) => ({
        url: "/material",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: MaterialResponse) =>
        response.data as IMaterial,

      invalidatesTags: ["Material"],
    }),

    // update team api
    updateMaterial: builder.mutation<IMaterial, { id: string; data: FormData }>(
      {
        query: ({ id, data }) => ({
          url: `/material/${id}`,
          method: "PUT",
          body: data,
        }),
        transformResponse: (response: MaterialResponse) =>
          response.data as IMaterial,
        invalidatesTags: ["Material"],
      },
    ),

    // delete team api
    deleteMaterial: builder.mutation<IMaterial, string>({
      query: (id) => ({
        url: `/material/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: MaterialResponse) =>
        response.data as IMaterial,

      invalidatesTags: ["Material"],
    }),
  }),
});

export const {
  useGetMaterialQuery,
  useGetMaterialByIdQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialApi;
