"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiHeart } from "react-icons/fi";
import Link from "next/link";

import Logo from "./Logo";
import MyCartSideDrawer from "./MyCartSideDrawer";
import MyAccountModel from "./MyAccountModel";
import { useGetWishlistQuery } from "@/store/wishlistApi";

const searchPlaceholders = [
  "Search for iPhone...",
  "Search for Samsung...",
  "Search for Accessories...",
  "Search for Smart Watches...",
  "Search for Chargers...",
  "Search for Cases & Protection...",
  "Search for Power & Cables...",
];

const Header = () => {
  const { data: wishlist = [] } = useGetWishlistQuery();

  const totalItems = wishlist.length;

  const router = useRouter();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <header
      className="
        sticky
        top-0
        z-9999
        w-full
        overflow-visible
        border-b
        border-gray-200
        bg-white
        dark:border-gray-800
        dark:bg-[#111]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1600px]
          px-3
          sm:px-5
          lg:px-8
          xl:px-10
        "
      >
        <div
          className="
            flex
            min-h-15
            w-full
            items-center
            gap-2
            sm:min-h-17
            lg:min-h-20.5
            lg:gap-5
          "
        >
          {/* LOGO */}
          <div
            className="
              flex
              shrink-0
              items-center
              [&_img]:h-auto
              [&_img]:max-h-10
              [&_img]:w-auto
              sm:[&_img]:max-h-12
              lg:[&_img]:max-h-15.5
            "
          >
            <Logo />
          </div>

          {/* DESKTOP SEARCH */}
          <div
            className="
              hidden
              min-w-0
              flex-1
              justify-center
              lg:flex
              lg:px-4
              xl:px-8
            "
          >
            <button
              type="button"
              onClick={() => router.push("/search")}
              aria-label="Open search page"
              className="
                group
                flex
                h-11.5
                w-full
                max-w-215
                cursor-pointer
                items-center
                overflow-hidden
                rounded-lg
                border
                border-gray-300
                bg-white
                text-left
                transition-all
                duration-200

                hover:border-[#ffd83d]
                hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)]

                dark:border-gray-700
                dark:bg-[#181818]
              "
            >
              {/* LEFT ICON */}
              <FiSearch
                className="
                  ml-4
                  shrink-0
                  text-gray-400
                "
                size={17}
              />

              {/* CHANGING PLACEHOLDER */}
              <span
                key={placeholderIndex}
                className="
                  min-w-0
                  flex-1
                  animate-[fadeSearch_0.35s_ease]
                  truncate
                  px-3
                  text-[13px]
                  text-gray-400
                  dark:text-gray-500
                "
              >
                {searchPlaceholders[placeholderIndex]}
              </span>

              {/* SEARCH BUTTON AREA */}
              <span
                className="
                  flex
                  h-full
                  w-14.5
                  shrink-0
                  items-center
                  justify-center
                  bg-[#ffd83d]
                  text-black
                  transition
                  group-hover:bg-[#ffcc00]
                "
              >
                <FiSearch className="h-5 w-5" strokeWidth={2.3} />
              </span>
            </button>
          </div>

          {/* RIGHT ACTIONS */}
          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              justify-end
              gap-1.5
              sm:gap-2
              lg:gap-0
            "
          >
            {/* MOBILE SEARCH */}
            <Link
              href="/search"
              aria-label="Search products"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-gray-100
                bg-white
                text-black
                shadow-[0_2px_10px_rgba(0,0,0,0.08)]
                transition-all
                duration-200

                hover:border-[#ffd83d]
                hover:bg-[#fffbea]
                hover:text-[#c99b00]

                sm:h-10
                sm:w-10
                lg:hidden

                dark:border-gray-700
                dark:bg-[#181818]
                dark:text-white
              "
            >
              <FiSearch className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={2} />
            </Link>

            {/* MOBILE DIVIDER */}
            <div
              className="
                mx-1
                h-6
                w-px
                shrink-0
                bg-gray-200
                sm:mx-1.5
                sm:h-7
                lg:hidden
                dark:bg-gray-700
              "
            />

            {/* ACCOUNT */}
            <div
              className="
                relative
             
                flex
                shrink-0
                items-center
                justify-center
                lg:mx-4
              "
            >
              <MyAccountModel />
            </div>

            {/* DESKTOP DIVIDER */}
            <div
              className="
                hidden
                h-8
                w-px
                shrink-0
                bg-gray-200
                lg:block
                dark:bg-gray-700
              "
            />

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="
                group
                hidden
                min-h-10.5
                shrink-0
                items-center
                justify-center
                gap-2
                px-4
                text-black
                transition
                hover:text-[#c99b00]
                lg:flex
                xl:px-5
                dark:text-white
                dark:hover:text-[#ffd83d]
              "
            >
              <div className="relative">
                <FiHeart
                  className="
                    h-6.75
                    w-6.75
                    transition-transform
                    group-hover:scale-105
                  "
                  strokeWidth={1.7}
                />

                <span
                  className="
                    absolute
                    -right-1.5
                    -top-1.5
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-[#ffd83d]
                    px-1
                    text-[8px]
                    font-bold
                    leading-none
                    text-black
                  "
                >
                  {totalItems}
                </span>
              </div>

              <div className="hidden leading-tight xl:block">
                <p className="text-[11px] font-bold tracking-wide">Wishlist</p>

                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                  Saved
                </p>
              </div>
            </Link>

            {/* DESKTOP DIVIDER */}
            <div
              className="
                hidden
                h-8
                w-px
                shrink-0
                bg-gray-200
                lg:block
                dark:bg-gray-700
              "
            />

            {/* CART */}
            <div
              className="
                hidden
                shrink-0
                items-center
                lg:flex
                lg:pl-3
                xl:pl-5
              "
            >
              <MyCartSideDrawer />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
