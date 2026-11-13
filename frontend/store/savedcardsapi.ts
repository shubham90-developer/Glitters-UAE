import { auth } from "@/firebase/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type CardType = "Visa" | "Mastercard" | "RuPay" | "American Express";

export interface ISavedCard {
  _id: string;
  type: CardType;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAddCardBody {
  type: CardType;
  last4: string;
  expiry: string;
  holder: string;
  isDefault?: boolean;
  gatewayToken?: string;
}

interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  totalItems?: number;
  data: T;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    const user = auth.currentUser;
    if (!user) return headers;

    try {
      const token = await user.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
    } catch (error) {
      console.error("Firebase token error:", error);
    }
    return headers;
  },
});

export const savedCardsApi = createApi({
  reducerPath: "savedCardsApi",
  baseQuery,
  tagTypes: ["SavedCards"],
  endpoints: (builder) => ({
    getSavedCards: builder.query<ISavedCard[], void>({
      query: () => "/saved-cards",
      transformResponse: (res: IResponse<ISavedCard[]>) => res.data ?? [],
      providesTags: [{ type: "SavedCards", id: "LIST" }],
    }),

    addSavedCard: builder.mutation<IResponse<ISavedCard>, IAddCardBody>({
      query: (body) => ({ url: "/saved-cards", method: "POST", body }),
      invalidatesTags: [{ type: "SavedCards", id: "LIST" }],
    }),

    setDefaultCard: builder.mutation<IResponse<ISavedCard>, string>({
      query: (id) => ({ url: `/saved-cards/${id}/default`, method: "PATCH" }),
      invalidatesTags: [{ type: "SavedCards", id: "LIST" }],
    }),

    deleteSavedCard: builder.mutation<IResponse<ISavedCard>, string>({
      query: (id) => ({ url: `/saved-cards/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "SavedCards", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSavedCardsQuery,
  useAddSavedCardMutation,
  useSetDefaultCardMutation,
  useDeleteSavedCardMutation,
} = savedCardsApi;
