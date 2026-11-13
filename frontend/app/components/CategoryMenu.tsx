/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FiArrowRight,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiMenu,
} from "react-icons/fi";

import { useGetcategoryQuery } from "@/store/categoriesApi";
import { useGetSubCategoryQuery } from "@/store/subCategoryApi";

/* =========================================================
   API TYPES
========================================================= */

type ApiCategory = {
  _id: string;
  img?: string;
  categoryName: string;
  categoryDesc?: string;
  status?: "active" | "inactive";
  isDeleted?: boolean;
};

type ApiSubCategory = {
  _id: string;

  category:
    | string
    | {
        _id: string;
        categoryName?: string;
      };

  img?: string;
  subCategoryName: string;

  status?: "active" | "inactive";
  isDeleted?: boolean;
};

/* =========================================================
   UI TYPES
========================================================= */

type SubCategory = {
  id: string;
  name: string;
  href: string;
  img: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
  href: string;
  img: string;
  children: SubCategory[];
};

/* =========================================================
   HELPERS
========================================================= */

/*
  Supports responses like:

  [...]
  { data: [...] }
  { data: { data: [...] } }
*/
const getArrayFromResponse = <T,>(response: any): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
};

/* =========================================================
   COMPONENT
========================================================= */

const CategoryMenu = () => {
  /* =========================
     API
  ========================= */

  const {
    data: categoryResponse,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetcategoryQuery();

  const {
    data: subCategoryResponse,
    isLoading: isSubCategoryLoading,
    isError: isSubCategoryError,
  } = useGetSubCategoryQuery();

  /* =========================
     STATES
  ========================= */

  const [open, setOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("");

  /* =========================
     NORMALIZE CATEGORY API
  ========================= */

  const categoryData = useMemo<ApiCategory[]>(() => {
    return getArrayFromResponse<ApiCategory>(categoryResponse);
  }, [categoryResponse]);

  /* =========================
     NORMALIZE SUB CATEGORY API
  ========================= */

  const subCategoryData = useMemo<ApiSubCategory[]>(() => {
    return getArrayFromResponse<ApiSubCategory>(subCategoryResponse);
  }, [subCategoryResponse]);

  /* =========================
     CREATE FINAL CATEGORY DATA
  ========================= */

  const categories = useMemo<Category[]>(() => {
    return categoryData
      .filter((category) => {
        const active = !category.status || category.status === "active";
        const notDeleted = category.isDeleted !== true;

        return active && notDeleted;
      })
      .map((category) => {
        const children = subCategoryData
          .filter((subCategory) => {
            /*
              category can be:
              category: "mongo-id"
              OR
              category: { _id: "mongo-id" }
            */
            const parentCategoryId =
              typeof subCategory.category === "object"
                ? subCategory.category?._id
                : subCategory.category;

            const sameCategory =
              String(parentCategoryId) === String(category._id);

            const active =
              !subCategory.status || subCategory.status === "active";

            const notDeleted = subCategory.isDeleted !== true;

            return sameCategory && active && notDeleted;
          })
          .map((subCategory) => ({
            id: subCategory._id,
            name: subCategory.subCategoryName,
            img: subCategory.img || category.img || "/img/no-image.png",

            // category + subCategory ids go in the URL
            href: `/product-list?category=${category._id}&subCategory=${subCategory._id}`,
          }));

        return {
          id: category._id,
          name: category.categoryName,
          description: category.categoryDesc || "",
          img: category.img || "/img/no-image.png",

          // category id goes in the URL
          href: `/product-list?category=${category._id}`,

          children,
        };
      });
  }, [categoryData, subCategoryData]);

  /* =========================
     SET FIRST CATEGORY ACTIVE
  ========================= */

  useEffect(() => {
    if (!categories.length) {
      setActiveCategory("");
      return;
    }

    const categoryStillExists = categories.some(
      (category) => category.id === activeCategory,
    );

    if (!categoryStillExists) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  /* =========================
     SELECTED CATEGORY
  ========================= */

  const selectedCategory = useMemo(() => {
    if (!categories.length) {
      return null;
    }

    return (
      categories.find((category) => category.id === activeCategory) ||
      categories[0]
    );
  }, [categories, activeCategory]);

  /* =========================
     LOADING
  ========================= */

  if (isCategoryLoading || isSubCategoryLoading) {
    return (
      <div className="relative shrink-0">
        <div className="h-11 w-51.25 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isCategoryError || isSubCategoryError) {
    return (
      <div className="relative shrink-0">
        <button
          type="button"
          className="flex h-11 min-w-51.25 items-center justify-center rounded-xl bg-red-50 px-4 text-[11px] font-semibold text-red-500"
        >
          Categories unavailable
        </button>
      </div>
    );
  }

  /* =========================
     EMPTY
  ========================= */

  if (!categories.length || !selectedCategory) {
    return (
      <div className="relative shrink-0">
        <button
          type="button"
          className="flex h-11 min-w-51.25 items-center gap-2 rounded-xl bg-[#ffd83d] px-4 text-[12px] font-bold text-black"
        >
          <FiMenu size={17} />
          No Categories
        </button>
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      {/* =====================================================
          ALL CATEGORIES BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex h-11 min-w-51.25 cursor-pointer items-center justify-between rounded-xl bg-[#ffd83d] px-4 font-serif text-black shadow-[0_4px_18px_rgba(255,216,61,0.18)] transition-all duration-200 hover:bg-[#ffcf0f]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5">
            <FiMenu size={18} />
          </span>

          <span className="text-[12px] font-bold">All Categories</span>
        </span>

        <FiChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* =====================================================
          MEGA MENU
      ====================================================== */}

      {open && (
        <>
          {/* BACKDROP */}
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-40" />

          {/* MENU */}
          <div className="absolute left-0 top-13.5 z-50 flex w-190 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.13)] dark:border-gray-800 dark:bg-[#171717]">
            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="w-65 shrink-0 border-r border-gray-100 bg-[#fafafa] p-3 dark:border-gray-800 dark:bg-[#141414]">
              <div className="mb-2 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-gray-400">
                  Shop by category
                </p>
              </div>

              <div className="space-y-1">
                {categories.map((category) => {
                  const active = activeCategory === category.id;

                  return (
                    <div
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category.id)}
                    >
                      <Link
                        href={category.href}
                        onClick={() => setOpen(false)}
                        className={`group flex min-h-14 items-center gap-3 rounded-xl px-3 transition-all ${
                          active
                            ? "bg-white shadow-[0_3px_12px_rgba(0,0,0,0.06)] dark:bg-[#222]"
                            : "hover:bg-white dark:hover:bg-[#202020]"
                        }`}
                      >
                        {/* ICON */}
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                            active
                              ? "bg-[#ffd83d] text-black"
                              : "bg-[#eeeeee] text-gray-500 dark:bg-[#242424] dark:text-gray-300"
                          }`}
                        >
                        
                          <Image src={category.img} alt="category-img" width={50} height={50} className=" p-1"  />
                        </span>

                        {/* TEXT */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-[10px] tracking-wider font-bold font-serif ${
                              active
                                ? "text-black dark:text-white"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {category.name}
                          </p>

                          {category.description && (
                            <p className="mt-0.5 truncate text-[10px] text-gray-900 dark:text-white">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <FiChevronRight
                          size={13}
                          className={
                            active
                              ? "text-black dark:text-white"
                              : "text-gray-300"
                          }
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* VIEW ALL */}
              <Link
                href="/product-list"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-[10px] font-bold text-gray-600 transition hover:border-[#ffd83d] hover:text-gray-900 dark:border-gray-700 dark:bg-[#1d1d1d] dark:text-gray-300 dark:hover:text-white"
              >
                View All Products
                <FiArrowRight size={13} />
              </Link>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex-1 bg-white p-5 dark:bg-[#171717]">
              {/* HEADING */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    Explore
                  </p>

                  <h3 className="mt-0.5 text-[17px] font-bold text-[#181818] dark:text-white">
                    {selectedCategory.name}
                  </h3>
                </div>

                <Link
                  href={selectedCategory.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 text-[10px] font-bold text-gray-500 transition hover:text-black dark:hover:text-white"
                >
                  View All
                  <FiArrowRight size={12} />
                </Link>
              </div>

              {/* DIVIDER */}
              <div className="my-4 h-px bg-gray-100 dark:bg-gray-800" />

              {/* =================================================
                  SUB CATEGORIES
              ================================================= */}

              {selectedCategory.children.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {selectedCategory.children.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-25 flex-col justify-between rounded-2xl border border-gray-100 bg-[#fafafa] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ffe06a] hover:bg-[#fffbea] hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] dark:border-gray-800 dark:bg-[#202020] dark:hover:bg-[#25210d]"
                    >
                      {/* IMAGE */}
                      <span className="relative flex h-19.5 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#eeeeee] bg-linear-to-br from-white via-[#fffef8] to-[#fff8dc] shadow-[0_3px_12px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:border-[#ffe16a] group-hover:shadow-[0_8px_20px_rgba(255,216,61,0.14)] dark:border-gray-700 dark:from-[#292929] dark:via-[#242424] dark:to-[#201d12]">
                        <span className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-[#ffd83d]/15" />
                        <span className="pointer-events-none absolute -bottom-5 -left-5 h-14 w-14 rounded-full bg-[#ffd83d]/10" />

                        <Image
                          src={item.img}
                          alt={item.name}
                          width={70}
                          height={70}
                          className="relative z-10 h-16 w-16 object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110 dark:mix-blend-normal"
                        />
                      </span>

                      {/* TITLE */}
                      <div className="mt-3 flex items-center justify-between gap-1">
                        <span className="line-clamp-1 text-[10px] font-bold text-gray-700 transition group-hover:text-black dark:text-gray-200 dark:group-hover:text-gray-400">
                          {item.name}
                        </span>

                        <FiChevronRight
                          size={11}
                          className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-black"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#202020]">
                  <div className="text-center">
                    <FiGrid size={25} className="mx-auto text-gray-300" />

                    <p className="mt-2 text-[11px] font-semibold text-gray-400">
                      No subcategories
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  PROMO
              ================================================= */}

              <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#171717] px-5 py-4 text-white dark:bg-[#ffd83d] dark:text-black">
                <div className="relative z-10">
                  <p className="text-[9px] font-medium opacity-60">
                    Featured Collection
                  </p>

                  <p className="mt-1 text-[13px] font-bold">
                    Explore latest {selectedCategory.name}
                  </p>

                  <Link
                    href={selectedCategory.href}
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold"
                  >
                    Shop Now
                    <FiArrowRight size={11} />
                  </Link>
                </div>

                <FiGrid
                  size={100}
                  strokeWidth={0.8}
                  className="absolute -bottom-6 right-4 opacity-[0.08]"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryMenu;
