import { Router } from "express";

import { generalSettingsRouter } from "../modules/general-settings/general-settings.routes";
import { homeBannerRouter } from "../modules/homeBanner/homeBanner.route";
import { aboutUsRouter } from "../modules/aboutUs/about.route";
import { counterRouter } from "../modules/counter/counter.route";

import { clientsRouter } from "../modules/clients/clients.route";

import { currentOpeningsRouter } from "../modules/currentOpenings/currentOpenings.route";

import { faqRouter } from "../modules/faq/faq.route";

import { awardsRouter } from "../modules/awards/awards.route";
import { certificatesRouter } from "../modules/certificates/certificates.route";

import { privacyPolicyRouter } from "../modules/privacypolicy/privacypolicy.route";
import { termsRouter } from "../modules/terms/terms.route";

import { contactRouter } from "../modules/contacts/contacts.route";
import { careerEnquiryRouter } from "../modules/careersEnquiry/careerEnquiry.route";
import { blogRouter } from "../modules/blogs/blogs.route";
import { testimonialsRouter } from "../modules/testimonials/testimonials.route";

import { productRouter } from "../modules/products/product.router";
import { seoPagesRouter } from "../modules/seo-pages/seoPages.route";
import { blogCategoryRouter } from "../modules/blogCategory/blogsCategory.route";
import { careerInfoRouter } from "../modules/careerInfo/careerInfo.route";
import { storeLocationRouter } from "../modules/storeLocation/storeLocation.route";
import { storeEnquiryRouter } from "../modules/storeEnquiry/storeEnquiry.route";
import { returnPolicyRouter } from "../modules/returnPolicy/returnPolicy.route";
import { returnRequestRouter } from "../modules/returnRequest/returnRequest.route";
import { categoryRouter } from "../modules/category/category.route";
import { subCategoryRouter } from "../modules/subCategories/subCategory.route";
import { brandsRouter } from "../modules/brands/brands.route";
import { colorsRouter } from "../modules/colors/colors.route";
import { sizeRouter } from "../modules/size/size.route";
import { materialRouter } from "../modules/material/material.route";
import { couponsRouter } from "../modules/coupons/coupons.route";
import { offerBannerRouter } from "../modules/offerBanner/offerBanner.route";
import { topSaleBannerRouter } from "../modules/topSaleBanner/topSaleBanner.route";
import { appBannerRouter } from "../modules/appBanner/appBanner.route";
import { appSettingsRouter } from "../modules/appSettings/app-settings.routes";
import { cartRouter } from "../modules/addToCart/addToCart.route";
import { authRouter } from "../modules/auth/auth.routes";
import { wishlistRouter } from "../modules/wishlist/wishlist.route";
import { addressRouter } from "../modules/Address/Address.route";
import { savedCardsRouter } from "../modules/cards/Savedcards.route";
import { productReviewRouter } from "../modules/product-reviews/Productreview.route";
import { orderRouter } from "../modules/orders/order.route";
import { adminAuthRouter } from "../modules/admin/adminRoute";
import { paymentRouter } from "../modules/payment/payment.route";
import { shippingRouter } from "../modules/shipping/shipping.route";
import { dashboardRouter } from "../modules/dashboard/dashboard.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },

  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/sub-categories",
    route: subCategoryRouter,
  },
  {
    path: "/brands",
    route: brandsRouter,
  },
  {
    path: "/colors",
    route: colorsRouter,
  },
  {
    path: "/size",
    route: sizeRouter,
  },
  {
    path: "/material",
    route: materialRouter,
  },
  {
    path: "/enquiries-contacts",
    route: contactRouter,
  },
  {
    path: "/enquiries-careers",
    route: careerEnquiryRouter,
  },
  {
    path: "/products",
    route: productRouter,
  },
  {
    path: "/add-to-cart",
    route: cartRouter,
  },
  {
    path: "/wishlist",
    route: wishlistRouter,
  },
  {
    path: "/blogs-category",
    route: blogCategoryRouter,
  },
  {
    path: "/blogs",
    route: blogRouter,
  },
  {
    path: "/app-banner",
    route: appBannerRouter,
  },
  {
    path: "/app-settings",
    route: appSettingsRouter,
  },

  {
    path: "/home-banner",
    route: homeBannerRouter,
  },
  {
    path: "/about-us",
    route: aboutUsRouter,
  },
  {
    path: "/counter",
    route: counterRouter,
  },

  {
    path: "/clients",
    route: clientsRouter,
  },
  {
    path: "/coupons",
    route: couponsRouter,
  },
  {
    path: "/offer-banner",
    route: offerBannerRouter,
  },
  {
    path: "/top-sale-banner",
    route: topSaleBannerRouter,
  },

  {
    path: "/current-openings",
    route: currentOpeningsRouter,
  },
  {
    path: "/career-info",
    route: careerInfoRouter,
  },
  {
    path: "/store-locations",
    route: storeLocationRouter,
  },
  {
    path: "/store-enquiries",
    route: storeEnquiryRouter,
  },

  {
    path: "/faq",
    route: faqRouter,
  },

  {
    path: "/awards",
    route: awardsRouter,
  },
  {
    path: "/certificates",
    route: certificatesRouter,
  },

  {
    path: "/privacy-policy",
    route: privacyPolicyRouter,
  },
  {
    path: "/terms-and-conditions",
    route: termsRouter,
  },
  {
    path: "/return-policy",
    route: returnPolicyRouter,
  },
  {
    path: "/return-request",
    route: returnRequestRouter,
  },
  {
    path: "/testimonials",
    route: testimonialsRouter,
  },

  {
    path: "/seo-pages",
    route: seoPagesRouter,
  },
  {
    path: "/settings",
    route: generalSettingsRouter,
  },
  { path: "/addresses", route: addressRouter },
  { path: "/saved-cards", route: savedCardsRouter },
  { path: "/product-reviews", route: productReviewRouter },
  { path: "/orders", route: orderRouter },
  { path: "/payments", route: paymentRouter },
  { path: "/shipping", route: shippingRouter },
  { path: "/admin-auth", route: adminAuthRouter },
  { path: "/dashboard", route: dashboardRouter },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
