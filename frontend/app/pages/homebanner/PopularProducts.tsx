"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "@/app/components/ProductCard";
import { useGetTopSaleBannerQuery } from "@/store/topSaleBannerApi";
import { useGetProductsQuery } from "@/store/productsApi";

// mobile <480 => 1.5 | <640 => 2 | <1280 => 3 | >=1280 => 4
const getSlides = (w: number) =>
  w >= 1280 ? 4 : w >= 640 ? 3 : w >= 480 ? 2 : 1.5;

const useSlidesToShow = () => {
  const [count, setCount] = useState(1.5);

  useEffect(() => {
    const update = () => setCount(getSlides(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
};

// internal paths use next/link, full URLs open in a new tab
const isExternal = (url: string) => /^https?:\/\//.test(url);

const PopularProducts = () => {
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsQuery();

  const popularProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.section) return false;

      const sections = Array.isArray(product.section)
        ? product.section
        : [product.section];

      return sections.some(
        (section) =>
          typeof section === "string" &&
          section.toLowerCase().replace(/\s+/g, "") === "popularproducts",
      );
    });
  }, [products]);

  const sliderRef = useRef<Slider | null>(null);
  const slidesToShow = useSlidesToShow();

  const {
    data: topSaleBanner = [],
    isLoading,
    isError,
  } = useGetTopSaleBannerQuery();

  const firstBanner = topSaleBanner?.[0]?.offerBannerImg1 || "";
  const secondBanner = topSaleBanner?.[0]?.offerBannerImg2 || "";

  // redirect links from the API (empty string = no link)
  const firstBannerLink = topSaleBanner?.[0]?.offerBannerLink1 || "";
  const secondBannerLink = topSaleBanner?.[0]?.offerBannerLink2 || "";

  // fractional slidesToShow (1.5) must not be infinite
  const isFractional = !Number.isInteger(slidesToShow);
  const canSlide = popularProducts.length > Math.ceil(slidesToShow);

  const settings = {
    dots: false,
    arrows: false,
    infinite: canSlide && !isFractional,
    speed: 550,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    cssEase: "ease-in-out",
  };

  if (isLoading) {
    return (
      <section className="w-full bg-white py-5 dark:bg-[#111]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="h-75 animate-pulse rounded-2xl bg-gray-100 dark:bg-[#171717]" />
        </div>
      </section>
    );
  }

  if (isError) return null;

  if (isProductsLoading) {
    return (
      <section className="w-full bg-white py-5 dark:bg-[#111]">
        <p className="text-center text-sm text-gray-500">Loading...</p>
      </section>
    );
  }

  if (isProductsError) {
    return (
      <section className="w-full bg-white py-5 dark:bg-[#111]">
        <p className="text-center text-sm text-red-500">Something went wrong</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-5 dark:bg-[#111]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-stretch">
          {/* PRODUCTS */}
          <div className="h-full min-w-0">
            <div className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-[#171717] sm:p-5">
              {/* HEADER */}
              <div className="mb-4 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-serif text-[18px] font-extrabold text-[#151515] dark:text-white sm:text-[22px]">
                    Popular Products
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Discover our latest products and exclusive deals
                  </p>
                </div>

                {/* SLIDER CONTROLS */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous products"
                    onClick={() => sliderRef.current?.slickPrev()}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-[#ffd83d] hover:bg-[#fff8dc] hover:text-black dark:border-gray-700 dark:bg-[#222] dark:text-white"
                  >
                    <FiChevronLeft size={17} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next products"
                    onClick={() => sliderRef.current?.slickNext()}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#ffd83d] text-black transition hover:bg-[#ffcf0f]"
                  >
                    <FiChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div className="mb-4 border-b border-dashed border-[#ead77d]" />

              {/* SLIDER (key re-initialises slick when breakpoint changes) */}
              <div className="-mx-1.5 sm:-mx-2">
                <Slider
                  key={slidesToShow}
                  ref={sliderRef}
                  {...settings}
                  className="new-offer-slider"
                >
                  {popularProducts.map((product) => (
                    <div key={product._id} className="px-1.5 pb-3 sm:px-2">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>

          {/* DESKTOP RIGHT BANNER */}
          {firstBanner && (
            <div className="hidden h-full xl:block">
              {firstBannerLink ? (
                isExternal(firstBannerLink) ? (
                  <a
                    href={firstBannerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block h-full min-h-full w-full overflow-hidden rounded-2xl bg-gray-100"
                  >
                    <Image
                      src={firstBanner}
                      alt="Right Offer Banner"
                      fill
                      className="object-fill"
                      sizes="220px"
                    />
                  </a>
                ) : (
                  <Link
                    href={firstBannerLink}
                    className="relative block h-full min-h-full w-full overflow-hidden rounded-2xl bg-gray-100"
                  >
                    <Image
                      src={firstBanner}
                      alt="Right Offer Banner"
                      fill
                      className="object-fill"
                      sizes="220px"
                    />
                  </Link>
                )
              ) : (
                <div className="relative block h-full min-h-full w-full overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={firstBanner}
                    alt="Right Offer Banner"
                    fill
                    className="object-fill"
                    sizes="220px"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE / TABLET BANNER (hidden on xl, where the right-side banner shows) */}
        {secondBanner && (
          <div className="mt-4 xl:hidden">
            {secondBannerLink ? (
              isExternal(secondBannerLink) ? (
                <a
                  href={secondBannerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-3/1 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800"
                >
                  <Image
                    src={secondBanner}
                    alt="Offer Banner"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1279px) 100vw, 0px"
                  />
                </a>
              ) : (
                <Link
                  href={secondBannerLink}
                  className="relative block aspect-3/1 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800"
                >
                  <Image
                    src={secondBanner}
                    alt="Offer Banner"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1279px) 100vw, 0px"
                  />
                </Link>
              )
            ) : (
              <div className="relative block aspect-3/1 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800">
                <Image
                  src={secondBanner}
                  alt="Offer Banner"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1279px) 100vw, 0px"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;
