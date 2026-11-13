/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiSearch, FiArrowLeft, FiX, FiClock } from "react-icons/fi";

import ProductCard from "@/app/components/ProductCard";
import { useGetcategoryQuery } from "@/store/categoriesApi";
import { useGetProductsQuery } from "@/store/productsApi";

const STORAGE_KEY = "recent-searches";
const MAX_RECENT = 8;

type Rec = Record<string, unknown>;

/* remove html tags like <p>text</p> */
const stripHtml = (value: unknown) =>
  typeof value === "string" ? value.replace(/<[^>]*>/g, " ") : "";

/* category id from "id" or { _id } */
const getCategoryId = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String((value as Rec)._id ?? "");
};

const Search = () => {
  // api
  const { data: categories = [] } = useGetcategoryQuery();
  const { data: products = [], isLoading } = useGetProductsQuery();

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  /* load recent searches */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecent(JSON.parse(saved) as string[]);
    } catch {
      setRecent([]);
    }
  }, []);

  const saveRecent = (list: string[]) => {
    setRecent(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore storage errors */
    }
  };

  const addRecent = (value: string) => {
    const list = [
      value,
      ...recent.filter((item) => item.toLowerCase() !== value.toLowerCase()),
    ].slice(0, MAX_RECENT);

    saveRecent(list);
  };

  const removeRecent = (value: string) =>
    saveRecent(recent.filter((item) => item !== value));

  /* category id -> category name */
  const categoryNames = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c._id] = c.categoryName;
    });
    return map;
  }, [categories]);

  /* keywords: "red shirt" -> ["red", "shirt"] */
  const keywords = useMemo(
    () => search.toLowerCase().split(/\s+/).filter(Boolean),
    [search],
  );

  /* live results: show product if ANY keyword matches */
  const results = useMemo(() => {
    if (keywords.length === 0) return [];

    return products
      .map((product) => {
        const p = product as unknown as Rec;

        const text = [
          p.productName,
          p.section,
          stripHtml(p.shortDesc),
          stripHtml(p.desc),
          Array.isArray(p.tags) ? p.tags.join(" ") : "",
          categoryNames[getCategoryId(p.category)] ?? "",
        ]
          .join(" ")
          .toLowerCase();

        const score = keywords.filter((word) => text.includes(word)).length;

        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);
  }, [products, keywords, categoryNames]);

  const hasQuery = keywords.length > 0;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = search.trim();
    if (!value) return;

    addRecent(value);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] dark:bg-[#0f0f0f]">
      {/* TOP SEARCH AREA */}
      <section className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-xl dark:border-gray-800 dark:bg-[#111]/95">
        <div className="mx-auto flex w-full max-w-300 items-center gap-2 px-3 py-3 sm:gap-3 sm:px-5 sm:py-4 lg:px-8">
          {/* BACK */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-sm transition hover:bg-gray-50 sm:h-11 sm:w-11 dark:border-gray-700 dark:bg-[#191919] dark:text-white"
          >
            <FiArrowLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </button>

          {/* SEARCH FORM */}
          <form
            onSubmit={handleSearch}
            className="flex h-11 min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-[#fafafa] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#ffd83d] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#ffd83d]/20 sm:h-12 sm:rounded-2xl lg:h-13 dark:border-gray-700 dark:bg-[#191919]"
          >
            <div className="flex min-w-0 flex-1 items-center">
              <FiSearch
                className="ml-3 shrink-0 text-gray-400 sm:ml-4"
                size={18}
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                placeholder="Search products, brands and categories..."
                className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[12px] text-black outline-none placeholder:text-gray-400 sm:px-3 sm:text-[13px] lg:text-[14px] dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <button
              type="submit"
              aria-label="Search"
              className="flex w-11 shrink-0 cursor-pointer items-center justify-center bg-[#ffd83d] text-black transition hover:bg-[#ffce16] sm:w-13 lg:w-14"
            >
              <FiSearch
                className="h-4.5 w-4.5 sm:h-5 sm:w-5"
                strokeWidth={2.2}
              />
            </button>
          </form>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-300 px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        {/* RECENT SEARCHES */}
        {!hasQuery && recent.length > 0 && (
          <div className="mb-6">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="font-serif text-[13px] font-bold text-black sm:text-[14px] lg:text-[15px] dark:text-white">
                Recent Searches
              </h2>

              <button
                type="button"
                onClick={() => saveRecent([])}
                className="cursor-pointer text-[10px] font-bold text-rose-500 hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recent.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-1.5 dark:border-gray-700 dark:bg-[#191919]"
                >
                  <FiClock size={11} className="text-gray-400" />

                  <button
                    type="button"
                    onClick={() => setSearch(item)}
                    className="cursor-pointer text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {item}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeRecent(item)}
                    aria-label={`Remove ${item}`}
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}
        {hasQuery ? (
          <div>
            <h2 className="mb-3 font-serif text-[13px] font-bold text-black sm:text-[14px] lg:text-[15px] dark:text-white">
              {isLoading ? "Searching..." : `${results.length} results for `}
              {!isLoading && (
                <span className="text-[#8d6c00]">
                  &quot;{search.trim()}&quot;
                </span>
              )}
            </h2>

            {!isLoading && results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-10 text-center dark:border-gray-800 dark:bg-[#171717]">
                <p className="text-[13px] font-bold text-black dark:text-white">
                  No products found
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  Try a different keyword.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                {results.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* TITLE */}
            <div className="mb-4 sm:mb-5">
              <h1 className="text-[17px] font-extrabold tracking-[-0.3px] text-[#151515] sm:text-[19px] lg:text-[22px] dark:text-white">
                What are you looking for?
              </h1>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-[11px] lg:text-[12px]">
                Search products or explore popular categories
              </p>
            </div>

            {/* CATEGORY HEADER */}
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="font-serif text-[13px] font-bold text-black sm:text-[14px] lg:text-[15px] dark:text-white">
                Shop by Category
              </h2>
            </div>

            {/* CATEGORY GRID */}
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 lg:gap-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/product-list?category=${category._id}`}
                  className="group flex min-w-0 flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-1.5 py-2.5 shadow-[0_3px_14px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ffe177] hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] active:scale-[0.97] sm:rounded-2xl sm:py-3 dark:border-gray-800 dark:bg-[#191919]"
                >
                  <div className="relative flex h-12 w-full items-center justify-center sm:h-14.5 lg:h-16.25">
                    <Image
                      src={category.img}
                      alt={category.categoryName}
                      width={70}
                      height={70}
                      className="h-11 w-11 object-contain transition-transform duration-200 group-hover:scale-105 sm:h-13 sm:w-13 lg:h-14.5 lg:w-14.5"
                    />
                  </div>

                  <p className="mt-1.5 line-clamp-2 w-full text-center text-[8px] font-semibold leading-2.75 text-gray-700 sm:text-[9px] sm:leading-3 lg:text-[10px] dark:text-gray-300">
                    {category.categoryName}
                  </p>
                </Link>
              ))}
            </div>

            {/* EMPTY SEARCH STATE */}
            <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center sm:mt-10 sm:py-10 dark:border-gray-800 dark:bg-[#171717]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff8d9] text-black sm:h-14 sm:w-14">
                <FiSearch className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <h3 className="mt-3 text-[13px] font-bold text-black sm:text-[14px] dark:text-white">
                Start your search
              </h3>

              <p className="mx-auto mt-1 max-w-[320px] text-[10px] leading-4 text-gray-400 sm:text-[11px]">
                Search for mobiles, smart watches, accessories, chargers and
                more.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Search;
