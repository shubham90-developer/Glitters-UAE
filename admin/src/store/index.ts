import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import { apiSlice } from './apiSlice'
import { settingApi } from './settingApi'
import { homeBannerApi } from './homeBanner'
import { aboutUsApi } from './aboutUsApi'
import { counterApi } from './counterApi'

import { currentOpeningsApi } from './currentOpeningsApi'

import { testimonialsApi } from './testimonialsApi'
import { faqApi } from './faqApi'

import { mediaCoverageApi } from './mediaCoverageApi'
import { privacyApi } from './privacyPolicyApi'
import { contactApi } from './contactApi'
import { careerApi } from './careerEnquiriesApi'
import { blogApi } from './blogApi'

import { termsApi } from './termsApi'
import { productsApi } from './productsApi'

import { seoPagesApi } from './seoPages'
import { categoryApi } from './categoriesApi'
import { subCategoryApi } from './subCategoryApi'
import { offerBannerApi } from './offerBannerApi'
import { topSaleBannerApi } from './topSaleBannerApi'
import { careerInfoApi } from './careerinfoApi'
import { returnRefundApi } from './returnRefundApi'
import { returnRequestApi } from './returnRequestApi'
import { blogCategoryApi } from './blogCategoryApi'
import { storeLocatorApi } from './storeLocatorApi'
import { storeEnquiryApi } from './storeEnquiryApi'
import { colorsApi } from './colorsApi'
import { sizeApi } from './sizeApi'
import { brandApi } from './brandApi'
import { materialApi } from './materialApi'
import { couponApi } from './couponApi'
import { appBannerApi } from './appBannerApi'
import { appSettingApi } from './appSettingsApi'
import { generalSettingsApi } from './generalSettingsApi'
import { dashboardApi } from './dashboardApi'
export const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subCategoryApi.reducerPath]: subCategoryApi.reducer,
    [offerBannerApi.reducerPath]: offerBannerApi.reducer,
    [topSaleBannerApi.reducerPath]: topSaleBannerApi.reducer,
    [homeBannerApi.reducerPath]: homeBannerApi.reducer,
    [aboutUsApi.reducerPath]: aboutUsApi.reducer,
    [counterApi.reducerPath]: counterApi.reducer,

    [colorsApi.reducerPath]: colorsApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [materialApi.reducerPath]: materialApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,

    [careerInfoApi.reducerPath]: careerInfoApi.reducer,
    [currentOpeningsApi.reducerPath]: currentOpeningsApi.reducer,

    [testimonialsApi.reducerPath]: testimonialsApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,

    [mediaCoverageApi.reducerPath]: mediaCoverageApi.reducer,
    [privacyApi.reducerPath]: privacyApi.reducer,
    [returnRefundApi.reducerPath]: returnRefundApi.reducer,
    [returnRequestApi.reducerPath]: returnRequestApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [careerApi.reducerPath]: careerApi.reducer,

    [blogCategoryApi.reducerPath]: blogCategoryApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,

    [appBannerApi.reducerPath]: appBannerApi.reducer,
    [appSettingApi.reducerPath]: appSettingApi.reducer,

    [storeLocatorApi.reducerPath]: storeLocatorApi.reducer,
    [storeEnquiryApi.reducerPath]: storeEnquiryApi.reducer,

    [termsApi.reducerPath]: termsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,

    [seoPagesApi.reducerPath]: seoPagesApi.reducer,

    [settingApi.reducerPath]: settingApi.reducer,
    [generalSettingsApi.reducerPath]: generalSettingsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
      categoryApi.middleware,
      subCategoryApi.middleware,
      offerBannerApi.middleware,
      homeBannerApi.middleware,
      topSaleBannerApi.middleware,
      aboutUsApi.middleware,
      counterApi.middleware,

      colorsApi.middleware,
      sizeApi.middleware,
      brandApi.middleware,
      materialApi.middleware,
      couponApi.middleware,

      currentOpeningsApi.middleware,
      careerInfoApi.middleware,

      appBannerApi.middleware,
      appSettingApi.middleware,

      testimonialsApi.middleware,
      faqApi.middleware,

      mediaCoverageApi.middleware,
      privacyApi.middleware,
      returnRefundApi.middleware,
      returnRequestApi.middleware,
      contactApi.middleware,
      careerApi.middleware,

      blogCategoryApi.middleware,
      blogApi.middleware,

      storeLocatorApi.middleware,
      storeEnquiryApi.middleware,

      termsApi.middleware,
      productsApi.middleware,

      settingApi.middleware,
      seoPagesApi.middleware,
      generalSettingsApi.middleware,
      dashboardApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
