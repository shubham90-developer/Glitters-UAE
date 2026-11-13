"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useGetProductsQuery } from "@/store/productsApi";
import ProductCard from "@/app/components/ProductCard";

// phone <480 => 1.5 | <640 => 2 | <1024 => 3 | <1280 => 4 | >=1280 => 5
const getSlides = (w: number) =>
  w >= 1280 ? 5 : w >= 1024 ? 4 : w >= 640 ? 3 : w >= 480 ? 2 : 1.5;

const useSlidesToShow = () => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const update = () => setCount(getSlides(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
};

const NewOffer = () => {
  const sliderRef = useRef<Slider | null>(null);
  const slidesToShow = useSlidesToShow();

  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  const newOfferProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.section) return false;

      const sections = Array.isArray(product.section)
        ? product.section
        : [product.section];

      return sections.some(
        (section) =>
          typeof section === "string" &&
          section.toLowerCase().replace(/\s+/g, "") === "newoffers",
      );
    });
  }, [products]);

  // fractional counts (1.5) must not loop
  const isFractional = !Number.isInteger(slidesToShow);
  const canSlide = newOfferProducts.length > Math.ceil(slidesToShow);

  const settings: Settings = {
    dots: false,
    arrows: false,
    infinite: canSlide && !isFractional,
    speed: 550,
    slidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    cssEase: "ease-in-out",
  };

  if (isLoading) {
    return (
      <section className="w-full bg-white py-4 sm:py-5 dark:bg-[#111]">
        <p className="text-center text-sm text-gray-500">Loading...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-white py-4 sm:py-5 dark:bg-[#111]">
        <p className="text-center text-sm text-red-500">Something went wrong</p>
      </section>
    );
  }

  if (newOfferProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-4 sm:py-5 dark:bg-[#111]">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-10">
        {/* HEADER */}
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5 sm:gap-4">
          <div className="min-w-0">
            <h2 className="font-serif text-[16px] font-extrabold text-[#151515] sm:text-[20px] md:text-[22px] dark:text-white">
              New Offers
            </h2>

            <p className="mt-1 text-[11px] text-gray-500 sm:text-xs md:text-sm">
              Discover our latest products and exclusive deals
            </p>
          </div>

          {/* ARROWS */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => sliderRef.current?.slickPrev()}
              className="
                flex h-8 w-8 cursor-pointer items-center justify-center
                rounded-lg border border-gray-200 bg-white
                text-gray-600 shadow-sm transition-all
                hover:border-[#ffd83d]
                hover:bg-[#fff8dc]
                hover:text-black
                sm:h-9 sm:w-9
                lg:h-10 lg:w-10
                dark:border-gray-700
                dark:bg-[#1b1b1b]
                dark:text-white
              "
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Next products"
              onClick={() => sliderRef.current?.slickNext()}
              className="
                flex h-8 w-8 cursor-pointer items-center justify-center
                rounded-lg bg-[#ffd83d] text-black
                shadow-[0_3px_10px_rgba(255,216,61,0.18)]
                transition-all
                hover:bg-[#ffcf0f]
                sm:h-9 sm:w-9
                lg:h-10 lg:w-10
              "
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mb-4 border-b border-dashed border-[#f2d66b] sm:mb-5" />

        {/* PRODUCTS (key re-initialises slick when the slide count changes) */}
        <div className="-mx-1.5 sm:-mx-2">
          <Slider key={slidesToShow} ref={sliderRef} {...settings}>
            {newOfferProducts.map((product) => (
              <div key={product._id} className="px-1.5 pb-3 sm:px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default NewOffer;
