import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// =====================================================
// TYPES
// =====================================================

export interface IFeature {
  title: string
  description: string
}

export interface IReturnStep {
  step: string
  title: string
  description: string
}

export interface IRefundTimeline {
  title: string
  description: string
}

export interface IReturnRefund {
  _id: string

  badgeTitle: string
  title: string
  shortDesc: string

  startReturnBtnText: string
  startReturnBtnUrl: string

  contactSupportBtnText: string
  contactSupportBtnUrl: string

  features: IFeature[]

  howItWorksTitle: string
  howItWorksDesc: string

  returnSteps: IReturnStep[]

  eligibleTitle: string
  eligibleDesc: string
  eligibleItems: string[]

  nonReturnableTitle: string
  nonReturnableDesc: string
  nonReturnableItems: string[]

  refundTimelineTitle: string
  refundTimelineDesc: string
  refundTimeline: IRefundTimeline[]

  refundProcessingTitle: string
  refundProcessingDesc: string

  isDeleted: boolean

  createdAt: string
  updatedAt: string
}

// =====================================================
// PAYLOAD
// =====================================================

export interface IReturnRefundPayload {
  badgeTitle: string
  title: string
  shortDesc: string

  startReturnBtnText: string
  startReturnBtnUrl: string

  contactSupportBtnText: string
  contactSupportBtnUrl: string

  features: IFeature[]

  howItWorksTitle: string
  howItWorksDesc: string

  returnSteps: IReturnStep[]

  eligibleTitle: string
  eligibleDesc: string
  eligibleItems: string[]

  nonReturnableTitle: string
  nonReturnableDesc: string
  nonReturnableItems: string[]

  refundTimelineTitle: string
  refundTimelineDesc: string
  refundTimeline: IRefundTimeline[]

  refundProcessingTitle: string
  refundProcessingDesc: string
}

// =====================================================
// RESPONSE
// =====================================================

interface IReturnRefundResponse {
  success: boolean
  statusCode: number
  message: string
  data: IReturnRefund | IReturnRefund[]
}

// =====================================================
// API
// =====================================================

export const returnRefundApi = createApi({
  reducerPath: 'returnRefundApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ['ReturnRefund'],

  endpoints: (builder) => ({
    // ============================================
    // GET
    // ============================================

    getReturnRefund: builder.query<IReturnRefund[], void>({
      query: () => ({
        url: '/return-policy',
        method: 'GET',
      }),

      transformResponse: (response: IReturnRefundResponse) => {
        if (Array.isArray(response.data)) {
          return response.data
        }

        return response.data ? [response.data] : []
      },

      providesTags: ['ReturnRefund'],
    }),

    // ============================================
    // CREATE
    // ============================================

    createReturnRefund: builder.mutation<IReturnRefund, IReturnRefundPayload>({
      query: (body) => ({
        url: '/return-policy',
        method: 'POST',
        body,
      }),

      transformResponse: (response: IReturnRefundResponse) => response.data as IReturnRefund,

      invalidatesTags: ['ReturnRefund'],
    }),

    // ============================================
    // UPDATE
    // ============================================

    updateReturnRefund: builder.mutation<
      IReturnRefund,
      {
        _id: string
        data: IReturnRefundPayload
      }
    >({
      query: ({ _id, data }) => ({
        url: `/return-policy/${_id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: IReturnRefundResponse) => response.data as IReturnRefund,

      invalidatesTags: ['ReturnRefund'],
    }),
  }),
})

// =====================================================
// HOOKS
// =====================================================

export const { useGetReturnRefundQuery, useCreateReturnRefundMutation, useUpdateReturnRefundMutation } = returnRefundApi
