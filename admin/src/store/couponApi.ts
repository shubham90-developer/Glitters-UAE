import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export type CouponStatus = 'active' | 'inactive'

export interface ICoupon {
  _id: string
  couponName: string
  subTitle: string
  couponCode: string
  couponAmount: string
  status: CouponStatus
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

/** Fields sent when creating / updating a coupon */
export type CouponPayload = Pick<ICoupon, 'couponName' | 'subTitle' | 'couponCode' | 'couponAmount' | 'status'>

interface CouponResponse<T = ICoupon | ICoupon[]> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const couponApi = createApi({
  reducerPath: 'couponApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      // Content-Type is set automatically by fetchBaseQuery:
      // JSON for plain objects, multipart (with boundary) for FormData.
      return headers
    },
  }),

  tagTypes: ['Coupon'],

  endpoints: (builder) => ({
    // list
    getCoupon: builder.query<ICoupon[], void>({
      query: () => ({
        url: '/coupons',
        method: 'GET',
      }),

      transformResponse: (response: CouponResponse): ICoupon[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Coupon' as const, id: _id })), { type: 'Coupon' as const, id: 'LIST' }]
          : [{ type: 'Coupon' as const, id: 'LIST' }],
    }),

    // single
    getCouponById: builder.query<ICoupon, string>({
      query: (id) => `/coupons/${id}`,
      transformResponse: (response: CouponResponse<ICoupon>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Coupon', id }],
    }),

    // create
    createCoupon: builder.mutation<ICoupon, CouponPayload>({
      query: (body) => ({
        url: '/coupons',
        method: 'POST',
        body,
      }),

      transformResponse: (response: CouponResponse<ICoupon>) => response.data,

      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),

    // update
    updateCoupon: builder.mutation<ICoupon, { id: string; data: Partial<CouponPayload> }>({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: CouponResponse<ICoupon>) => response.data,

      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),

    // delete
    deleteCoupon: builder.mutation<ICoupon, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: CouponResponse<ICoupon>) => response.data,

      invalidatesTags: (_result, _error, id) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),
  }),
})

export const { useGetCouponQuery, useGetCouponByIdQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } = couponApi
