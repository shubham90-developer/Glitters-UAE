/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiFilter, FiX } from "react-icons/fi";

import SideFilter from "./SideFilter";
import TopFilter from "./TopFilter";
import GridView from "./GridView";
import ListView from "./ListView";
import { useGetProductsQuery } from "@/store/productsApi";
import {
  DEFAULT_FILTERS,
  filterProducts,
  getId,
  type Filters,
} from "./filterUtils";

type ViewType = "grid" | "list";

const ProductListContent = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subCategory");

  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const [sort, setSort] = useState("featured");

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    categories: categoryParam ? [categoryParam] : [],
    subCategories: subCategoryParam ? [subCategoryParam] : [],
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: categoryParam ? [categoryParam] : [],
      subCategories: subCategoryParam ? [subCategoryParam] : [],
    }));
  }, [categoryParam, subCategoryParam]);

  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  const filteredProducts = useMemo(
    () => filterProducts(products, filters, sort),
    [products, filters, sort],
  );

  const scopeProducts = useMemo(
    () =>
      products.filter((product) => {
        const p = product as unknown as Record<string, unknown>;

        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(getId(p.category))
        ) {
          return false;
        }

        if (
          filters.subCategories.length > 0 &&
          !filters.subCategories.includes(getId(p.subCategory))
        ) {
          return false;
        }

        return true;
      }),
    [products, filters.categories, filters.subCategories],
  );

  // Lock background scroll while mobile filter is open
  useEffect(() => {
    if (!filterOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filterOpen]);

  // Close drawer using Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <section className="w-full bg-white py-3 dark:bg-[#111] sm:py-5 lg:py-6">
        <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8 xl:px-10">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            {/* DESKTOP FILTER */}
            <aside className="hidden min-w-0 lg:block">
              <div
                className="
                  sticky top-27.5
                  max-h-[calc(100dvh-125px)]
                  overflow-y-auto overscroll-contain
                  rounded-2xl
                  bg-white
                  scrollbar-thin
                  scrollbar-thumb-gray-300
                  scrollbar-track-transparent
                  dark:bg-[#161616]
                  dark:scrollbar-thumb-gray-700
                "
              >
                <SideFilter
                  filters={filters}
                  onChange={setFilters}
                  scopeProducts={scopeProducts}
                />
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 sm:mb-4">
                {/* MOBILE FILTER BUTTON */}
                <button
                  type="button"
                  onClick={() => setFilterOpen(true)}
                  aria-label="Open filters"
                  className="
                    flex h-10 shrink-0 cursor-pointer
                    items-center justify-center gap-1.5
                    rounded-xl border border-gray-200
                    bg-white px-3 text-[11px] font-bold
                    text-black shadow-sm transition
                    active:scale-[0.97]
                    sm:h-11 sm:px-3.5
                    lg:hidden
                    dark:border-gray-700 dark:bg-[#181818]
                    dark:text-white
                  "
                >
                  <FiFilter className="h-4 w-4" />
                  <span>Filter</span>
                </button>

                <div className="min-w-0 flex-1">
                  <TopFilter
                    view={view}
                    onViewChange={setView}
                    sort={sort}
                    onSortChange={setSort}
                    total={filteredProducts.length}
                  />
                </div>
              </div>

              {/* PRODUCT VIEW */}
              <div className="w-full">
                {view === "grid" ? (
                  <GridView
                    products={filteredProducts}
                    isLoading={isLoading}
                    isError={isError}
                  />
                ) : (
                  <ListView
                    products={filteredProducts}
                    isLoading={isLoading}
                    isError={isError}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setFilterOpen(false)}
        className={`
          fixed inset-0 z-9998
          bg-black/40 backdrop-blur-[2px]
          transition-opacity duration-300
          lg:hidden
          ${
            filterOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* MOBILE FILTER DRAWER */}
      <aside
        aria-hidden={!filterOpen}
        className={`
          fixed left-0 top-0 z-9999
          flex h-dvh w-[88%] max-w-85
          flex-col overflow-hidden
          bg-white
          shadow-[15px_0_50px_rgba(0,0,0,0.15)]
          transition-transform duration-300 ease-out
          lg:hidden
          dark:bg-[#111]
          ${filterOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* FIXED HEADER */}
        <div
          className="
            flex h-16 shrink-0
            items-center justify-between
            border-b border-gray-100
            px-4
            dark:border-gray-800
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl bg-[#fff7d1]
                text-black dark:bg-[#2a2510]
                dark:text-[#ffd83d]
              "
            >
              <FiFilter className="h-4.25 w-4.25" />
            </div>

            <div>
              <h2 className="text-[14px] font-extrabold text-black dark:text-white">
                Filters
              </h2>

              <p className="text-[10px] text-gray-400">Refine your results</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            aria-label="Close filters"
            className="
              flex h-9 w-9 cursor-pointer
              items-center justify-center
              rounded-full border border-gray-100
              bg-gray-50 text-gray-600
              transition active:scale-95
              dark:border-gray-700
              dark:bg-[#1b1b1b] dark:text-white
            "
          >
            <FiX className="h-4.25 w-4.25" />
          </button>
        </div>

        {/* SCROLLABLE FILTER CONTENT */}
        <div
          className="
            min-h-0 flex-1
            overflow-x-hidden overflow-y-auto
            overscroll-contain
            touch-pan-y
            p-3
            scrollbar-thin
            [scrollbar-color:#bdbdbd_transparent]
          "
        >
          <SideFilter
            filters={filters}
            onChange={setFilters}
            scopeProducts={scopeProducts}
          />
        </div>

        {/* FIXED BOTTOM BUTTON */}
        <div
          className="
            relative z-10 shrink-0
            border-t border-gray-100
            bg-white p-3
            pb-[max(12px,env(safe-area-inset-bottom))]
            dark:border-gray-800
            dark:bg-[#111]
          "
        >
          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            className="
              flex h-11 w-full cursor-pointer
              items-center justify-center
              rounded-xl bg-[#ffd83d]
              text-[12px] font-extrabold text-black
              transition hover:bg-[#ffcf12]
              active:scale-[0.98]
            "
          >
            Show {filteredProducts.length} Products
          </button>
        </div>
      </aside>
    </>
  );
};

const ProductList = () => (
  <Suspense fallback={null}>
    <ProductListContent />
  </Suspense>
);

export default ProductList;
