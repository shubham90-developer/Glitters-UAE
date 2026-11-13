import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { auth } from "@/firebase/config";

export interface AuthUser {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export interface SyncUserRequest {
  name?: string;
  phone?: string;
}

export interface UpdateEmailRequest {
  email: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: async (headers) => {
      try {
        await auth.authStateReady();

        const currentUser = auth.currentUser;

        if (currentUser) {
          const token = await currentUser.getIdToken();

          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Firebase token error:", error);
      }

      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),

  tagTypes: ["AuthUser"],

  endpoints: (builder) => ({
    syncUser: builder.mutation<AuthResponse, SyncUserRequest>({
      query: (body) => ({
        url: "/auth/sync",
        method: "POST",
        body,
      }),

      invalidatesTags: ["AuthUser"],
    }),

    getMe: builder.query<AuthResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),

      providesTags: ["AuthUser"],
    }),

    updateEmail: builder.mutation<AuthResponse, UpdateEmailRequest>({
      query: (body) => ({
        url: "/auth/email",
        method: "PUT",
        body,
      }),

      invalidatesTags: ["AuthUser"],
    }),
  }),
});

export const {
  useSyncUserMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateEmailMutation,
} = authApi;
