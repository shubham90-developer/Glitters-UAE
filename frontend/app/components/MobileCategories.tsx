"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiGrid } from "react-icons/fi";
import { useGetcategoryQuery } from "@/store/categoriesApi";

const MobileCategories = () => {
  // apis
  const { data: categories } = useGetcategoryQuery();
  return (
    <section
      className="
        w-full
        bg-white
        py-3
        lg:hidden
        dark:bg-[#111]
      "
    >
      {/* HEADER */}
      <div className="mb-2.5 flex items-center justify-between px-3">
        <h2
          className="
              font-serif
              text-[14px]
              font-extrabold
              text-[#151515]
              sm:text-[22px]
              dark:text-white
            "
        >
          Shop by Category
        </h2>

        <Link
          href="/categories"
          className="
            flex
            items-center
            gap-1
            text-[9px]
            font-bold
            text-[#c99b00]
          "
        >
          View All Categories
          <FiArrowRight size={11} />
        </Link>
      </div>

      {/* CATEGORY CARDS */}
      <div
        className="
          scrollbar-hide
          flex
          gap-2
          overflow-x-auto
          px-3
          pb-1
        "
      >
        {categories?.map((category) => (
          <Link
            key={category._id}
            href={`/product-list?category=${category._id}`}
            className="
              flex
              h-22
              min-w-19.5
              shrink-0
              flex-col
              items-center
              justify-between
              rounded-xl
              border
              border-gray-100
              bg-[#fafafa]
              px-1.5
              py-2
              shadow-[0_2px_8px_rgba(0,0,0,0.03)]
              transition-all
              duration-200

              active:scale-[0.97]

              dark:border-gray-800
              dark:bg-[#181818]
            "
          >
            {/* IMAGE */}
            <div
              className="
                relative
                flex
                h-13
                w-full
                items-center
                justify-center
              "
            >
              <Image
                src={category.img}
                alt={category.categoryName}
                width={48}
                height={48}
                className="
                  h-11.5
                  w-11.5
                  object-contain
                "
              />
            </div>

            {/* NAME */}
            <p
              className="
                line-clamp-1
                w-full
                text-center
                text-[8px]
                font-semibold
                leading-2.75
                text-gray-700
                dark:text-gray-300
              "
            >
              {category.categoryName}
            </p>
          </Link>
        ))}

        {/* MORE CARD */}
        <Link
          href="/categories"
          className="
            flex
            h-22
            min-w-19.5
            shrink-0
            flex-col
            items-center
            justify-between
            rounded-xl
            border
            border-gray-100
            bg-[#fafafa]
            px-1.5
            py-2
            shadow-[0_2px_8px_rgba(0,0,0,0.03)]
            transition-all
            active:scale-[0.97]

            dark:border-gray-800
            dark:bg-[#181818]
          "
        >
          <div
            className="
              flex
              h-13
              w-full
              items-center
              justify-center
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
                shadow-sm

                dark:bg-[#222]
                dark:text-white
              "
            >
              <FiGrid size={20} />
            </div>
          </div>

          <p
            className="
              text-center
              text-[8px]
              font-semibold
              text-gray-700
              dark:text-gray-300
            "
          >
            More
          </p>
        </Link>
      </div>
    </section>
  );
};

export default MobileCategories;
