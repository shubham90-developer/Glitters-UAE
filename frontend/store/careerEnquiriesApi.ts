import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ICareer {
  _id: string;

  firstName: string;
  lastName: string;

  emailAddress: string;
  phone: string;

  currentPosition: string;
  experience: string;
  currentLocation: string;
  expectedSalary: string;

  linkedIn: string;

  resume: string;

  coverLetter: string;
  message: string;

  createdAt: string;
  updatedAt: string;
}

interface CareerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICareer | ICareer[];
}

export const careerApi = createApi({
  reducerPath: "careerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Career"],

  endpoints: (builder) => ({
    getCareer: builder.query<ICareer[], void>({
      query: () => ({
        url: "/enquiries-careers",
        method: "GET",
      }),

      transformResponse: (response: CareerResponse): ICareer[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["Career"],
    }),

    // single
    getCareerById: builder.query<ICareer, string>({
      query: (id) => `/enquiries-careers/${id}`,
      transformResponse: (response: CareerResponse) => response.data as ICareer,
      providesTags: (result, error, id) => [{ type: "Career", id }],
    }),

    // create team api
    createCareer: builder.mutation<ICareer, FormData>({
      query: (formData) => ({
        url: "/enquiries-careers",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: CareerResponse) => response.data as ICareer,

      invalidatesTags: ["Career"],
    }),

    // update team api
    updateCareer: builder.mutation<ICareer, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/enquiries-careers/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: CareerResponse) => response.data as ICareer,
      invalidatesTags: ["Career"],
    }),

    // delete team api
    deleteCareer: builder.mutation<ICareer, string>({
      query: (id) => ({
        url: `/enquiries-careers/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: CareerResponse) => response.data as ICareer,

      invalidatesTags: ["Career"],
    }),
  }),
});

export const {
  useGetCareerQuery,
  useGetCareerByIdQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
} = careerApi;
