import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  todaysOrders: number
  lastWeekOrders: number
  pendingOrders: number
  deliveredRate: number
  totalRevenue: number
  totalCustomers: number
  totalJobEnquiries: number
  totalContactEnquiries: number
  totalBlogs: number
}

interface DashboardResponse {
  success: boolean
  statusCode: number
  message: string
  data: DashboardStats
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),

  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardResponse, void>({
      query: () => ({ url: '/dashboard/stats', method: 'GET' }),
    }),
  }),
})

export const { useGetDashboardStatsQuery } = dashboardApi
