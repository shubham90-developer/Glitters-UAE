import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ICurrentOpenings {
  _id: string;

  jobID: string;
  jobTitle: string;
  shortDesc: string;

  location: string;
  jobType: string;
  experience: string;
  dept: string;

  roles: string;
  salary: string;
  openings: string;

  responsibilities: string;
  requirements: string;
  benefits: string;

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface ICurrentOpeningsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICurrentOpenings | ICurrentOpenings[];
}

export const currentOpeningsApi = createApi({
  reducerPath: "currentOpeningsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["CurrentOpenings"],

  endpoints: (builder) => ({
    getCurrentOpenings: builder.query<ICurrentOpenings[], void>({
      query: () => ({
        url: "/current-openings",
        method: "GET",
      }),

      transformResponse: (
        response: ICurrentOpeningsResponse,
      ): ICurrentOpenings[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["CurrentOpenings"],
    }),

    // single
    getCurrentOpeningsById: builder.query<ICurrentOpenings, string>({
      query: (id) => `/current-openings/${id}`,
      transformResponse: (response: ICurrentOpeningsResponse) =>
        response.data as ICurrentOpenings,
      providesTags: (result, error, id) => [{ type: "CurrentOpenings", id }],
    }),

    // create team api
    createCurrentOpenings: builder.mutation<ICurrentOpenings, FormData>({
      query: (formData) => ({
        url: "/current-openings",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: ICurrentOpeningsResponse) =>
        response.data as ICurrentOpenings,

      invalidatesTags: ["CurrentOpenings"],
    }),

    // update team api
    updateCurrentOpenings: builder.mutation<
      ICurrentOpenings,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/current-openings/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ICurrentOpeningsResponse) =>
        response.data as ICurrentOpenings,
      invalidatesTags: ["CurrentOpenings"],
    }),

    // delete team api
    deleteCurrentOpenings: builder.mutation<ICurrentOpenings, string>({
      query: (id) => ({
        url: `/current-openings/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: ICurrentOpeningsResponse) =>
        response.data as ICurrentOpenings,

      invalidatesTags: ["CurrentOpenings"],
    }),
  }),
});

export const {
  useGetCurrentOpeningsQuery,
  useGetCurrentOpeningsByIdQuery,
  useCreateCurrentOpeningsMutation,
  useUpdateCurrentOpeningsMutation,
  useDeleteCurrentOpeningsMutation,
} = currentOpeningsApi;
