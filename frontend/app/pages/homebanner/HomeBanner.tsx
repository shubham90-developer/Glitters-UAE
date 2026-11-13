/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Slider from "react-slick";
import Image from "next/image";

import { useGetHomeBannerQuery } from "@/store/homeBannerApi";

type HomeBannerItem = {
  _id: string;

  title?: string;
  subTitle?: string;
  shortDesc?: string;

  banner?: string;
  bgVideo?: string; // holds either an MP4 or a PNG URL

  status?: "active" | "inactive" | boolean;
  isDeleted?: boolean;
};

// MP4 -> video, everything else (PNG) -> image
const isVideoUrl = (url?: string) => !!url && /\.mp4($|\?)/i.test(url);

const HomeBanner = () => {
  const {
    data: homeBannerResponse,
    isLoading,
    isError,
  } = useGetHomeBannerQuery();

  const sliderRef = useRef<Slider | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeSlide, setActiveSlide] = useState(0);

  // ==========================================
  // GET API DATA
  // ==========================================
  const banners = useMemo(() => {
    let data: HomeBannerItem[] = [];

    if (Array.isArray(homeBannerResponse)) {
      data = homeBannerResponse;
      // @ts-ignore
    } else if (Array.isArray(homeBannerResponse?.data)) {
      // @ts-ignore
      data = homeBannerResponse.data;
      // @ts-ignore
    } else if (Array.isArray(homeBannerResponse?.data?.data)) {
      // @ts-ignore
      data = homeBannerResponse.data.data;
    }

    // active + not deleted + valid media
    return data.filter((item) => {
      const hasMedia = Boolean(item.bgVideo || item.banner);

      const active =
        item.status === undefined ||
        item.status === true ||
        item.status === "active";

      const notDeleted =
        item.isDeleted === undefined || item.isDeleted === false;

      return hasMedia && active && notDeleted;
    });
  }, [homeBannerResponse]);

  // ==========================================
  // PLAY ONLY THE VIDEO IN THE ACTIVE SLIDE
  // (works with react-slick's cloned slides)
  // ==========================================
  const syncVideos = useCallback(() => {
    const videos = containerRef.current?.querySelectorAll("video") ?? [];

    videos.forEach((video) => {
      const slide = video.closest(".slick-slide");

      if (slide?.classList.contains("slick-active")) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  // re-sync when the slide changes or when banners finish loading
  useEffect(() => {
    const t = setTimeout(syncVideos, 50); // wait for slick to update classes
    return () => clearTimeout(t);
  }, [activeSlide, banners, syncVideos]);

  // ==========================================
  // SLIDER SETTINGS
  // ==========================================
  const settings = {
    dots: true,
    arrows: false,
    infinite: banners.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,

    autoplay: banners.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    pauseOnFocus: false,

    swipe: true,
    draggable: true,
    cssEase: "ease-in-out",

    beforeChange: (_current: number, next: number) => {
      setActiveSlide(next);
    },

    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="m-0 flex items-center justify-center gap-2">{dots}</ul>
      </div>
    ),

    customPaging: () => (
      <button
        type="button"
        className="
          h-2!
          w-2!
          rounded-full
          bg-white/70!
        "
      />
    ),
  };

  // ==========================================
  // LOADING / ERROR / EMPTY
  // ==========================================
  if (isLoading) {
    return (
      <section className="w-full">
        <div
          className="
            h-30
            w-full
            animate-pulse
            bg-gray-200

            sm:h-40
            md:h-70
            lg:h-90
            xl:h-125
          "
        />
      </section>
    );
  }

  if (isError) return null;
  if (!banners.length) return null;

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#f7f7f7]
        dark:bg-[#111]
      "
    >
      <div ref={containerRef} className="relative w-full">
        <Slider ref={sliderRef} {...settings} className="home-banner-slider">
          {banners.map((item, index) => {
            const mediaUrl = item.bgVideo || item.banner;

            if (!mediaUrl) return null;

            const isVideo = isVideoUrl(mediaUrl);

            return (
              <div key={item._id}>
                <div
                  className="
                    relative
                    h-60
                    w-full
                    overflow-hidden
                    bg-[#f4f4f4]

                    sm:h-80
                    md:h-70
                    lg:h-100
                    xl:h-150

                    dark:bg-[#181818]
                  "
                >
                  {/* ===================== */}
                  {/* VIDEO */}
                  {/* ===================== */}
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      muted
                      playsInline
                      loop
                      preload="auto"
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-fill
                      "
                      onLoadedData={syncVideos}
                    />
                  ) : (
                    /* ===================== */
                    /* IMAGE */
                    /* ===================== */
                    <Image
                      src={mediaUrl}
                      alt={item.title || "Home Banner"}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="
                        object-cover
                        transition-transform
                        duration-700
                      "
                    />
                  )}

                  {/* Overlay */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-linear-to-r
                      from-black/10
                      via-transparent
                      to-black/5
                    "
                  />
                </div>
              </div>
            );
          })}
        </Slider>

        {/* ================================== */}
        {/* COUNTER */}
        {/* ================================== */}
        {banners.length > 1 && (
          <div
            className="
              absolute
              right-5
              bottom-5
              z-20
              rounded-full
              bg-black/40
              px-3
              py-1.5
              text-[11px]
              font-semibold
              text-white
              backdrop-blur-md
            "
          >
            {String(activeSlide + 1).padStart(2, "0")}

            <span className="mx-1.5 opacity-50">/</span>

            {String(banners.length).padStart(2, "0")}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBanner;
