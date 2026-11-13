import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// =====================================================
// TYPES
// =====================================================

export type ColorStatus = "active" | "inactive";

export interface IColors {
  _id: string;

  colorName: string;
  hexCode: string;

  status: ColorStatus;

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ICreateColorPayload {
  colorName: string;
  hexCode: string;
  status: ColorStatus;
}

export interface IUpdateColorPayload {
  colorName?: string;
  hexCode?: string;
  status?: ColorStatus;
}

interface ColorsResponse {
  success: boolean;
  statusCode: number;
  message: string;

  data: IColors | IColors[];
}

// =====================================================
// API
// =====================================================

export const colorsApi = createApi({
  reducerPath: "colorsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Colors"],

  endpoints: (builder) => ({
    // =================================================
    // GET ALL COLORS
    // =================================================

    getColors: builder.query<IColors[], void>({
      query: () => ({
        url: "/colors",
        method: "GET",
      }),

      transformResponse: (response: ColorsResponse): IColors[] => {
        if (Array.isArray(response.data)) {
          return response.data;
        }

        return response.data ? [response.data] : [];
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Colors" as const,
                id: item._id,
              })),

              {
                type: "Colors",
                id: "LIST",
              },
            ]
          : [
              {
                type: "Colors",
                id: "LIST",
              },
            ],
    }),

    // =================================================
    // GET COLOR BY ID
    // =================================================

    getColorsById: builder.query<IColors, string>({
      query: (id) => ({
        url: `/colors/${id}`,
        method: "GET",
      }),

      transformResponse: (response: ColorsResponse) => response.data as IColors,

      providesTags: (result, error, id) => [
        {
          type: "Colors",
          id,
        },
      ],
    }),

    // =================================================
    // CREATE COLOR
    // =================================================

    createColors: builder.mutation<
      IColors,
      {
        colorName: string;
        hexCode: string;
        status: "active" | "inactive";
      }
    >({
      query: (data) => ({
        url: "/colors",
        method: "POST",
        body: data,
      }),

      transformResponse: (response: ColorsResponse) => response.data as IColors,

      invalidatesTags: ["Colors"],
    }),

    // =================================================
    // UPDATE COLOR
    // =================================================

    updateColors: builder.mutation<
      IColors,
      {
        id: string;
        data: IUpdateColorPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `/colors/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: (response: ColorsResponse) => response.data as IColors,

      invalidatesTags: (result, error, arg) => [
        {
          type: "Colors",
          id: arg.id,
        },

        {
          type: "Colors",
          id: "LIST",
        },
      ],
    }),

    // =================================================
    // DELETE COLOR
    // =================================================

    deleteColors: builder.mutation<IColors, string>({
      query: (id) => ({
        url: `/colors/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: ColorsResponse) => response.data as IColors,

      invalidatesTags: [
        {
          type: "Colors",
          id: "LIST",
        },
      ],
    }),
  }),
});

// =====================================================
// HOOKS
// =====================================================

export const {
  useGetColorsQuery,
  useGetColorsByIdQuery,
  useCreateColorsMutation,
  useUpdateColorsMutation,
  useDeleteColorsMutation,
} = colorsApi;
