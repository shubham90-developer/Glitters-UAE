import { auth } from "@/firebase/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* =========================================================
   Types
========================================================= */

export interface INamed {
  _id: string;
  name: string;
}

export interface IWishlistVariant {
  _id?: string;
  image?: string;
  price?: number | string;
  delPrice?: number | string;
  stock?: number | string;

  size?:
    | {
        _id?: string;
        size?: string;
      }
    | string;

  color?:
    | {
        _id?: string;
        colorName?: string;
      }
    | string;
}

export interface IWishlistProduct {
  _id: string;

  productName: string;

  category: string;

  subCategory: string;

  section: string;

  brand: INamed | string;

  material: INamed | string;

  dealOfTheDay: boolean;

  coupon: string;

  tags: string[];

  videoUrl: string;

  variants: IWishlistVariant[];

  shortDesc: string;

  desc: string;

  additionalInformation: string;

  shippingReturnPolicy: string;

  specifications: unknown[];

  reviews: {
    rating?: number | string;
  }[];

  status: "active" | "inactive";

  isDeleted: boolean;
}

export interface IWishlist {
  _id: string;

  product: IWishlistProduct;

  user: string;

  isDeleted: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface IWishlistResponse<T> {
  success: boolean;

  statusCode: number;

  message: string;

  totalItems?: number;

  data: T;
}

export interface IClearWishlistResponse {
  success: boolean;

  statusCode: number;

  message: string;

  deletedCount: number;
}

export interface IAddToWishlistBody {
  product: string;
}

/* =========================================================
   Base Query
========================================================= */

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,

  prepareHeaders: async (headers) => {
    const user = auth.currentUser;

    if (!user) {
      return headers;
    }

    try {
      const token = await user.getIdToken();

      headers.set("Authorization", `Bearer ${token}`);
    } catch (error) {
      console.error("Firebase token error:", error);
    }

    return headers;
  },
});

/* =========================================================
   Wishlist API
========================================================= */

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",

  baseQuery,

  tagTypes: ["Wishlist"],

  endpoints: (builder) => ({
    /* =====================================================
       GET WISHLIST
    ===================================================== */

    getWishlist: builder.query<IWishlist[], void>({
      query: () => "/wishlist",

      transformResponse: (response: IWishlistResponse<IWishlist[]>) => {
        return response.data ?? [];
      },

      providesTags: (result) => [
        {
          type: "Wishlist",
          id: "LIST",
        },

        ...(result ?? []).map((item) => ({
          type: "Wishlist" as const,
          id: item._id,
        })),
      ],
    }),

    /* =====================================================
       GET WISHLIST BY ID
    ===================================================== */

    getWishlistById: builder.query<IWishlist, string>({
      query: (id) => `/wishlist/${id}`,

      transformResponse: (response: IWishlistResponse<IWishlist>) =>
        response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "Wishlist",
          id,
        },
      ],
    }),

    /* =====================================================
       ADD TO WISHLIST
    ===================================================== */

    addToWishlist: builder.mutation<
      IWishlistResponse<IWishlist>,
      IAddToWishlistBody
    >({
      query: (body) => ({
        url: "/wishlist",

        method: "POST",

        body,
      }),

      invalidatesTags: [
        {
          type: "Wishlist",
          id: "LIST",
        },
      ],
    }),

    /* =====================================================
       DELETE BY WISHLIST ID
    ===================================================== */

    removeFromWishlist: builder.mutation<IWishlistResponse<IWishlist>, string>({
      query: (id) => ({
        url: `/wishlist/${id}`,

        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "Wishlist",
          id,
        },
        {
          type: "Wishlist",
          id: "LIST",
        },
      ],
    }),

    /* =====================================================
       DELETE BY PRODUCT ID
    ===================================================== */

    removeWishlistByProduct: builder.mutation<
      IWishlistResponse<IWishlist>,
      string
    >({
      query: (productId) => ({
        url: `/wishlist/product/${productId}`,

        method: "DELETE",
      }),

      /*
       * Immediately remove product from RTK cache.
       */

      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          wishlistApi.util.updateQueryData(
            "getWishlist",
            undefined,
            (draft) => {
              const index = draft.findIndex(
                (item) => item.product?._id === productId,
              );

              if (index !== -1) {
                draft.splice(index, 1);
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          /*
           * DELETE failed.
           * Restore previous cache.
           */

          patchResult.undo();
        }
      },

      invalidatesTags: [
        {
          type: "Wishlist",
          id: "LIST",
        },
      ],
    }),

    /* =====================================================
       CLEAR WISHLIST
    ===================================================== */

    clearWishlist: builder.mutation<IClearWishlistResponse, void>({
      query: () => ({
        url: "/wishlist/clear",

        method: "DELETE",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          wishlistApi.util.updateQueryData(
            "getWishlist",
            undefined,
            (draft) => {
              draft.length = 0;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: [
        {
          type: "Wishlist",
          id: "LIST",
        },
      ],
    }),
  }),
});

/* =========================================================
   Hooks
========================================================= */

export const {
  useGetWishlistQuery,

  useGetWishlistByIdQuery,

  useAddToWishlistMutation,

  useRemoveFromWishlistMutation,

  useRemoveWishlistByProductMutation,

  useClearWishlistMutation,
} = wishlistApi;
