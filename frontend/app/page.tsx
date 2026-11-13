import React from "react";
import HomeBanner from "./pages/homebanner/HomeBanner";
import OfferBanner from "./pages/homebanner/OfferBanner";
import NewOffer from "./pages/homebanner/NewOffer";
import PopularProducts from "./pages/homebanner/PopularProducts";
import DealOfTheDay from "./pages/homebanner/DealOfTheDay";
import NewArrivals from "./pages/homebanner/NewArrivals";
import NewOfferBanner from "./pages/homebanner/NewOfferBanner";
import HomeBlog from "./pages/homebanner/HomeBlog";
import MobileCategories from "./components/MobileCategories";

const page = () => {
  return (
    <>
      <HomeBanner />
      <MobileCategories />
      <NewOffer />
      <OfferBanner />
      <PopularProducts />
      <DealOfTheDay />
      <NewArrivals />
      <NewOfferBanner />
      <HomeBlog />
    </>
  );
};

export default page;
