"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import { useGetOfferBannerQuery } from "@/store/offerBannerApi";

// Banner width : height ratio (your images look ~3:1). Change if needed.
const BANNER_ASPECT = "aspect-[3/1]";

// mobile < 640 => 1 | tablet 640-1023 => 2 | desktop >= 1024 => 3
const useSlidesToShow = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
};

const OfferBannerSkeleton = () => {
  return (
    <section className="w-full bg-white py-4 dark:bg-[#111]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-[#161616] sm:p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={
                  index === 1
                    ? "hidden sm:block"
                    : index === 2
                      ? "hidden lg:block"
                      : ""
                }
              >
                <div
                  className={`${BANNER_ASPECT} w-full animate-pulse rounded-xl border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-800`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const OfferBanner = () => {
  const { data: offers = [], isLoading, isError } = useGetOfferBannerQuery();
  const slidesToShow = useSlidesToShow();

  if (isLoading) return <OfferBannerSkeleton />;
  if (isError || !offers.length) return null;

  const canSlide = offers.length > slidesToShow;

  const settings: Settings = {
    dots: canSlide,
    infinite: canSlide,
    speed: 600,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: canSlide,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    swipeToSlide: true,
  };

  return (
    <section className="w-full bg-white py-4 dark:bg-[#111]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-[#161616] sm:p-3">
          {/* key re-initialises slick when the breakpoint changes */}
          <Slider key={slidesToShow} {...settings} className="offer-slider">
            {offers.map((offer) => (
              <div key={offer._id} className="px-1.5">
                {offer.redirectUrl ? (
                  <Link
                    href={offer.redirectUrl}
                    className={`group relative block ${BANNER_ASPECT} w-full overflow-hidden rounded-xl border border-gray-200 bg-[#f7f7f7] transition-all duration-300 hover:border-gray-300 hover:shadow-[0_5px_18px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-[#1b1b1b]`}
                  >
                    <Image
                      src={offer.offerBannerImg}
                      alt={`Offer Banner ${offer._id}`}
                      fill
                      priority={false}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </Link>
                ) : (
                  <div
                    className={`relative block ${BANNER_ASPECT} w-full overflow-hidden rounded-xl border border-gray-200 bg-[#f7f7f7] dark:border-gray-700 dark:bg-[#1b1b1b]`}
                  >
                    <Image
                      src={offer.offerBannerImg}
                      alt={`Offer Banner ${offer._id}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center"
                    />
                  </div>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
