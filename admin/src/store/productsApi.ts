import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

// =====================================================
// PRODUCT VARIANT
// =====================================================

export interface IProductVariant {
  size: string
  color: string

  price: number
  delPrice: number
  discount: number
  stock: number

  image?: string
}

// =====================================================
// PRODUCT SPECIFICATION
// =====================================================

export interface IProductSpecification {
  specificationName: string
  value: string
}

// =====================================================
// BASIC INFO
// =====================================================

export interface IProductBasicInfo {
  title?: string
  shortDesc?: string
  description?: string
}

// =====================================================
// TECHNICAL INFO
// =====================================================

export interface IProductTechnicalInfo {
  title?: string
  shortDesc?: string
  description?: string
}

// =====================================================
// PRODUCT OVERVIEW
// =====================================================

export interface IProductOverview {
  title?: string
  shortDesc?: string
  description?: string
}

// =====================================================
// PRODUCT TESTING
// =====================================================

export interface IProductTesting {
  title?: string
  shortDesc?: string
  description?: string
}

// =====================================================
// AI FEATURES
// =====================================================

export interface IProductAiFeatures {
  title?: string
  shortDesc?: string
  description?: string
}

// =====================================================
// PRODUCT SYSTEM
// =====================================================

export interface IProductSystem {
  title?: string
  shortDesc?: string
  description?: string
}

// =====================================================
// FEATURES
// =====================================================

export interface IProductFeature {
  title?: string
  shortDesc?: string
  description?: string
  icon?: string
}

// =====================================================
// PRODUCT
// =====================================================

export interface IProduct {
  _id: string

  productName: string

  category: string
  subCategory?: string

  material?: string

  section?: 'New Offers' | 'Popular Products' | 'New Arrivals'

  brand?: string

  dealOfTheDay: boolean

  coupon?: string

  tags?: string[]

  videoUrl?: string

  productImages?: string[]
  featureIcons?: string[]

  systemImage?: string
  video?: string

  variants: IProductVariant[]

  specifications?: IProductSpecification[]

  basicInfo?: IProductBasicInfo

  technicalInfo?: IProductTechnicalInfo

  productOverview?: IProductOverview

  productTesting?: IProductTesting

  aiFeatures?: IProductAiFeatures

  system?: IProductSystem

  features?: IProductFeature[]

  status: 'active' | 'inactive'

  isDeleted: boolean

  createdAt: string
  updatedAt: string
}

// =====================================================
// API RESPONSE
// =====================================================

export interface ProductsResponse<T = IProduct | IProduct[]> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

// =====================================================
// PRODUCTS API
// =====================================================

export const productsApi = createApi({
  reducerPath: 'productsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      // Don't manually set Content-Type when using FormData.
      // Browser automatically adds multipart/form-data boundary.

      return headers
    },
  }),

  tagTypes: ['Products'],

  endpoints: (builder) => ({
    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    getProducts: builder.query<IProduct[], void>({
      query: () => ({
        url: '/products',
        method: 'GET',
      }),

      transformResponse: (response: ProductsResponse<IProduct | IProduct[]>): IProduct[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((product) => ({
                type: 'Products' as const,
                id: product._id,
              })),

              {
                type: 'Products' as const,
                id: 'LIST',
              },
            ]
          : [
              {
                type: 'Products' as const,
                id: 'LIST',
              },
            ],
    }),

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    getProductsById: builder.query<IProduct, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),

      transformResponse: (response: ProductsResponse<IProduct>): IProduct => {
        return response.data
      },

      providesTags: (result, error, id) => [
        {
          type: 'Products',
          id,
        },
      ],
    }),

    // =====================================================
    // CREATE PRODUCT
    // =====================================================

    createProducts: builder.mutation<IProduct, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: ProductsResponse<IProduct>): IProduct => {
        return response.data
      },

      invalidatesTags: [
        {
          type: 'Products',
          id: 'LIST',
        },
      ],
    }),

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    updateProducts: builder.mutation<
      IProduct,
      {
        id: string
        data: FormData
      }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: ProductsResponse<IProduct>): IProduct => {
        return response.data
      },

      invalidatesTags: (result, error, { id }) => [
        {
          type: 'Products',
          id,
        },
        {
          type: 'Products',
          id: 'LIST',
        },
      ],
    }),

    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    deleteProducts: builder.mutation<IProduct, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: ProductsResponse<IProduct>): IProduct => {
        return response.data
      },

      invalidatesTags: (result, error, id) => [
        {
          type: 'Products',
          id,
        },
        {
          type: 'Products',
          id: 'LIST',
        },
      ],
    }),
  }),
})

// =====================================================
// EXPORT HOOKS
// =====================================================

export const { useGetProductsQuery, useGetProductsByIdQuery, useCreateProductsMutation, useUpdateProductsMutation, useDeleteProductsMutation } =
  productsApi
