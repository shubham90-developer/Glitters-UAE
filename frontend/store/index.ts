import { configureStore } from "@reduxjs/toolkit";
import { homeBannerApi } from "./homeBannerApi";
import { categoryApi } from "./categoriesApi";
import { subCategoryApi } from "./subCategoryApi";
import { offerBannerApi } from "./offerBannerApi";
import { topSaleBannerApi } from "./topSaleBannerApi";
import { blogApi } from "./blogApi";
import { blogCategoryApi } from "./blogCategoryApi";
import { aboutUsApi } from "./aboutUsApi";
import { counterApi } from "./counterApi";
import { careerInfoApi } from "./careerinfoApi";
import { currentOpeningsApi } from "./currentOpeningsApi";
import { settingApi } from "./settingApi";
import { careerApi } from "./careerEnquiriesApi";
import { storeLocatorApi } from "./storeLocatorApi";
import { storeEnquiryApi } from "./storeEnquiryApi";
import { privacyApi } from "./privacyPolicyApi";
import { termsApi } from "./termsApi";
import { contactApi } from "./contactApi";
import { faqApi } from "./faqApi";
import { returnRefundApi } from "./returnRefundApi";
import { returnRequestApi } from "./returnRequestApi";
import { productsApi } from "./productsApi";
import { sizeApi } from "./sizeApi";
import { colorsApi } from "./colorsApi";
import { materialApi } from "./materialApi";
import { addToCartApi } from "./addToCartApi";
import { authApi } from "./authApi";
import { wishlistApi } from "./wishlistApi";
import { couponApi } from "./couponApi";
import { addressApi } from "./addressapi";
import { savedCardsApi } from "./savedcardsapi";
import { reviewApi } from "./reviewApi";
import { ordersApi } from "./ordersApi";

export const store = configureStore({
  reducer: {
    authApi: authApi.reducer,
    categoryApi: categoryApi.reducer,
    subCategoryApi: subCategoryApi.reducer,
    homeBannerApi: homeBannerApi.reducer,
    offerBannerApi: offerBannerApi.reducer,
    topSaleBannerApi: topSaleBannerApi.reducer,
    blogCategoryApi: blogCategoryApi.reducer,
    blogApi: blogApi.reducer,
    aboutUsApi: aboutUsApi.reducer,
    counterApi: counterApi.reducer,
    careerInfoApi: careerInfoApi.reducer,
    currentOpeningsApi: currentOpeningsApi.reducer,
    careerApi: careerApi.reducer,
    storeLocatorApi: storeLocatorApi.reducer,
    storeEnquiryApi: storeEnquiryApi.reducer,
    settingApi: settingApi.reducer,
    privacyApi: privacyApi.reducer,
    termsApi: termsApi.reducer,
    contactApi: contactApi.reducer,
    faqApi: faqApi.reducer,
    returnRefundApi: returnRefundApi.reducer,
    returnRequestApi: returnRequestApi.reducer,

    // products
    productsApi: productsApi.reducer,
    sizeApi: sizeApi.reducer,
    colorsApi: colorsApi.reducer,
    materialApi: materialApi.reducer,
    addToCartApi: addToCartApi.reducer,
    wishlistApi: wishlistApi.reducer,
    couponApi: couponApi.reducer,
    addressApi: addressApi.reducer,
    savedCardsApi: savedCardsApi.reducer,
    reviewApi: reviewApi.reducer,
    ordersApi: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      categoryApi.middleware,
      subCategoryApi.middleware,
      homeBannerApi.middleware,
      offerBannerApi.middleware,
      topSaleBannerApi.middleware,
      blogCategoryApi.middleware,
      blogApi.middleware,
      aboutUsApi.middleware,
      counterApi.middleware,
      careerInfoApi.middleware,
      currentOpeningsApi.middleware,
      careerApi.middleware,
      storeLocatorApi.middleware,
      storeEnquiryApi.middleware,
      settingApi.middleware,
      privacyApi.middleware,
      termsApi.middleware,
      contactApi.middleware,
      faqApi.middleware,
      returnRefundApi.middleware,
      returnRequestApi.middleware,

      // products
      productsApi.middleware,
      sizeApi.middleware,
      colorsApi.middleware,
      materialApi.middleware,
      addToCartApi.middleware,
      wishlistApi.middleware,
      couponApi.middleware,
      addressApi.middleware,
      savedCardsApi.middleware,
      reviewApi.middleware,
      ordersApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
