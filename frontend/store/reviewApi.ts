import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { auth } from "../firebase/config";

/* =========================================================
   Types
========================================================= */

// one review (public)
export interface IReviewItem {
  _id: string;
  name: string;
  rating: number;
  reviewTitle: string;
  review: string;
  image?: string; 
  video?:string;// Cloudinary URL, empty when no photo
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface IReviewSummary {
  total: number;
  average: number;
  // JSON keys are strings: "1" ... "5"
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface IProductReviewsData {
  reviews: IReviewItem[];
  summary: IReviewSummary;
  page: number;
  limit: number;
}

// the logged-in user's own review
export interface IMyReview {
  _id: string;
  rating: number;
  reviewTitle: string;
  review: string;
  image?: string;
  createdAt: string;
}

interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/* =========================================================
   Base Query (adds Firebase token when user is logged in)
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
   Review API
========================================================= */

export const reviewApi = createApi({
  reducerPath: "reviewApi",

  baseQuery,

  tagTypes: ["Reviews", "MyReview"],

  endpoints: (builder) => ({
    // PUBLIC: reviews + rating summary
    // GET /product-reviews/product/:productId
    getProductReviews: builder.query<
      IProductReviewsData,
      { productId: string; page?: number; limit?: number }
    >({
      query: ({ productId, page = 1, limit = 20 }) => ({
        url: `/product-reviews/product/${productId}`,
        params: { page, limit },
      }),

      transformResponse: (response: IApiResponse<IProductReviewsData>) =>
        response.data,

      providesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
      ],
    }),

    // LOGGED-IN: my review of this product (or null)
    // GET /product-reviews/product/:productId/mine
    getMyReview: builder.query<IMyReview | null, string>({
      query: (productId) => `/product-reviews/product/${productId}/mine`,

      transformResponse: (response: IApiResponse<IMyReview | null>) =>
        response.data ?? null,

      providesTags: (_result, _error, productId) => [
        { type: "MyReview", id: productId },
      ],
    }),

    // LOGGED-IN: add a review (multipart/form-data, optional "image" file)
    // POST /product-reviews/product/:productId
    addReview: builder.mutation<
      IApiResponse<undefined>,
      { productId: string; body: FormData }
    >({
      query: ({ productId, body }) => ({
        url: `/product-reviews/product/${productId}`,
        method: "POST",
        body, // FormData: the browser sets the multipart header itself
      }),

      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "MyReview", id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetMyReviewQuery,
  useAddReviewMutation,
} = reviewApi;
