"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiChevronRight, FiGrid } from "react-icons/fi";
import { useGetcategoryQuery } from "@/store/categoriesApi";
import { useGetSubCategoryQuery } from "@/store/subCategoryApi";

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
  category: string | { _id: string; categoryName?: string };
  img?: string;
  subCategoryName: string;
  status?: "active" | "inactive";
  isDeleted?: boolean;
};

/* Accepts [..] or { data: [..] } or { categories: [..] } */
const toList = <T,>(res: unknown): T[] => {
  if (Array.isArray(res)) return res as T[];

  const obj = res as Record<string, unknown> | undefined;
  for (const key of ["data", "categories", "subCategories"]) {
    if (Array.isArray(obj?.[key])) return obj[key] as T[];
  }
  return [];
};

const isVisible = (item: { status?: string; isDeleted?: boolean }) =>
  item.status !== "inactive" && !item.isDeleted;

const getCategoryId = (category: ApiSubCategory["category"]) =>
  typeof category === "string" ? category : category?._id;

const Thumb = ({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) => (
  <div className={`relative shrink-0 overflow-hidden ${className}`}>
    {src ? (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="120px"
        className="object-contain p-1.5"
      />
    ) : (
      <FiGrid className="absolute inset-0 m-auto text-gray-400" size={18} />
    )}
  </div>
);

const Categories = () => {
  const { data: categoryRes, isLoading } = useGetcategoryQuery(undefined);
  const { data: subCategoryRes } = useGetSubCategoryQuery(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const categories = useMemo(
    () => toList<ApiCategory>(categoryRes).filter(isVisible),
    [categoryRes],
  );

  const subCategories = useMemo(
    () => toList<ApiSubCategory>(subCategoryRes).filter(isVisible),
    [subCategoryRes],
  );

  const active = categories.find((c) => c._id === selectedId) ?? categories[0];

  const activeSubs = useMemo(
    () => subCategories.filter((s) => getCategoryId(s.category) === active?._id),
    [subCategories, active],
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse p-4">
        <div className="h-[70vh] rounded-3xl bg-gray-100 dark:bg-white/10" />
      </div>
    );
  }

  if (!active) {
    return (
      <p className="py-20 text-center text-sm text-gray-400">
        No categories available.
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-3 pb-28 pt-4 sm:px-4 md:pb-8">
      <div className="grid grid-cols-[110px_1fr] overflow-hidden rounded-3xl border border-gray-200 bg-white sm:grid-cols-[250px_1fr] dark:border-white/10 dark:bg-[#111]">
        {/* LEFT: category tabs */}
        <aside className="border-r border-gray-100 bg-gray-50/70 p-2 sm:p-3 dark:border-white/10 dark:bg-white/3">
          <p className="hidden px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 sm:block">
            Shop by category
          </p>

          <div className="flex max-h-[68vh] flex-col gap-1.5 overflow-y-auto">
            {categories.map((category) => {
              const isActive = category._id === active._id;

              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => setSelectedId(category._id)}
                  aria-pressed={isActive}
                  className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl p-2 text-center transition sm:flex-row sm:gap-3 sm:p-3 sm:text-left ${
                    isActive
                      ? "bg-white shadow-sm dark:bg-white/10"
                      : "hover:bg-white/70 dark:hover:bg-white/5"
                  }`}
                >
                  <Thumb
                    src={category.img}
                    alt={category.categoryName}
                    className={`h-11 w-11 rounded-xl sm:h-10 sm:w-10 ${
                      isActive
                        ? "bg-[#ffd83d]"
                        : "bg-gray-100 dark:bg-white/10"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[11px] font-extrabold leading-tight text-gray-900 sm:text-[13px] dark:text-white">
                      {category.categoryName}
                    </p>

                    {category.categoryDesc && (
                      <p className="mt-0.5 hidden truncate text-[11px] text-gray-500 sm:block dark:text-gray-400">
                        {category.categoryDesc}
                      </p>
                    )}
                  </div>

                  <FiChevronRight
                    size={14}
                    className={`hidden shrink-0 sm:block ${
                      isActive ? "text-gray-900 dark:text-white" : "text-gray-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

  
        </aside>

        {/* RIGHT: sub categories */}
        <div className="min-w-0 p-3 sm:p-6">
          <div className="flex items-end justify-between gap-3 border-b border-gray-100 pb-4 dark:border-white/10">
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">Explore</p>
              <h2 className="truncate text-lg font-black text-gray-950 sm:text-2xl dark:text-white">
                {active.categoryName}
              </h2>
            </div>

          </div>

          {activeSubs.length === 0 ? (
            <p className="py-14 text-center text-sm text-gray-400">
              No sub categories yet.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {activeSubs.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/product-list?category=${active._id}&subCategory=${sub._id}`}
                  className="group rounded-2xl border border-gray-100 bg-gray-50/60 p-2.5 transition hover:-translate-y-0.5 hover:border-[#ffd83d] hover:shadow-sm dark:border-white/10 dark:bg-white/3"
                >
                  <Thumb
                    src={sub.img}
                    alt={sub.subCategoryName}
                    className="aspect-4/3 w-full rounded-xl bg-[#fffbea] dark:bg-white/5"
                  />

                  <div className="mt-2.5 flex items-center justify-between gap-1 px-1">
                    <span className="truncate text-[12px] font-bold text-gray-800 dark:text-gray-200">
                      {sub.subCategoryName}
                    </span>
                    <FiChevronRight
                      size={13}
                      className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Featured */}
          <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#161616] p-5 sm:p-6">
            <p className="text-[10px] font-semibold text-gray-400">
              Featured Collection
            </p>
            <h3 className="mt-1.5 max-w-xs text-base font-extrabold text-white sm:text-lg">
              Explore latest {active.categoryName}
            </h3>

            <Link
              href={`/products?category=${active._id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#ffd83d]"
            >
              Shop Now <FiArrowRight size={13} />
            </Link>

            <div className="pointer-events-none absolute -right-4 -top-4 grid grid-cols-2 gap-2 opacity-10">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-12 w-12 rounded-lg border-2 border-white" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;