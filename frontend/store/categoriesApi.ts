import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ICategory {
  data: ICategory;
  _id: string;
  img: string;
  categoryName: string;
  categoryDesc: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICategory | ICategory[];
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Category"],

  endpoints: (builder) => ({
    getcategory: builder.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),

      transformResponse: (response: CategoryResponse): ICategory[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["Category"],
    }),
  }),
});

export const { useGetcategoryQuery } = categoryApi;
