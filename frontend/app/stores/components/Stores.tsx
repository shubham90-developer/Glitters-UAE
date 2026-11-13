"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { useGetStoreLocatorQuery } from "@/store/storeLocatorApi";
import Image from "next/image";
import React, { useMemo } from "react";
import { FiArrowRight, FiImage, FiMapPin } from "react-icons/fi";

/* ============================================================
   TYPES
============================================================ */

interface Store {
  _id: string;
  storeName?: string;
  shortDesc?: string;
  img?: string | null;
  address?: string;
  rating?: number | string;
  status?: string;
  isDeleted?: boolean;
}

/* ============================================================
   HELPERS
============================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStore = (value: unknown): value is Store =>
  isRecord(value) && "_id" in value;

/** Supports: Store[] | { data: Store[] } | { stores: Store[] } */
const extractStores = (response: unknown): Store[] => {
  if (Array.isArray(response)) return response.filter(isStore);

  if (isRecord(response)) {
    if (Array.isArray(response.data)) return response.data.filter(isStore);
    if (Array.isArray(response.stores)) return response.stores.filter(isStore);
  }

  return [];
};

const isActiveStore = (store: Store): boolean =>
  store.status?.toLowerCase() === "active" && !store.isDeleted;

/* ============================================================
   HEADER
============================================================ */

const PageHeader = ({ count }: { count?: number }) => (
  <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#b58b00]">
        Explore Nearby
      </span>

      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 transition-colors dark:text-white sm:text-3xl">
        Featured Stores
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
        Explore our trusted stores and discover quality products from popular
        sellers.
      </p>
    </div>

    {count !== undefined ? (
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {count} {count === 1 ? "store" : "stores"} available
      </p>
    ) : (
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
    )}
  </div>
);

/* ============================================================
   SKELETON
============================================================ */

const StoreCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#121212]">
    <div className="h-52.5 bg-gray-200 dark:bg-neutral-800" />

    <div className="p-5">
      <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-neutral-800" />

      <div className="mt-3 space-y-2">
        <div className="h-3.5 rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="h-3.5 w-5/6 rounded bg-gray-200 dark:bg-neutral-800" />
      </div>

      <div className="my-4 h-px bg-gray-100 dark:bg-white/10" />

      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200 dark:bg-neutral-800" />

        <div className="flex-1">
          <div className="h-3 w-16 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="mt-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>

      <div className="mt-4 h-10 rounded-lg bg-gray-200 dark:bg-neutral-800 sm:h-11" />
    </div>
  </div>
);

/* ============================================================
   STORE CARD
============================================================ */

const StoreCard = ({ store }: { store: Store }) => {
  const image = store.img?.trim();
  const name = store.storeName ?? "Store";

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl dark:border-white/10 dark:bg-[#121212] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-[#161616]">
      {/* Image */}
      <div className="relative h-52.5 overflow-hidden bg-gray-100 dark:bg-neutral-900">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-neutral-700">
            <FiImage size={36} />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        {/* Status */}
        <div className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1.5 text-[11px] font-bold capitalize text-white shadow-sm">
          {store.status}
        </div>

        {/* Rating */}
        {store.rating !== undefined && store.rating !== "" && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-900 shadow dark:bg-black/80 dark:text-white dark:backdrop-blur-md">
            <span className="text-[#f5aa00]">★</span>
            {store.rating}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-extrabold text-gray-900 transition-colors group-hover:text-[#b58b00] dark:text-white dark:group-hover:text-[#d5ad27]">
          {name}
        </h2>

        <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {store.shortDesc}
        </p>

        <div className="my-4 h-px bg-gray-100 dark:bg-white/10" />

        {/* Address */}
        {store.address && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff8dc] text-[#b58b00] dark:bg-[#b58b00]/15">
              <FiMapPin size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Address
              </p>

              <p className="mt-1 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300">
                {store.address}
              </p>
            </div>
          </div>
        )}

        <ThemeBtnOne
          text="View Store"
          url={`/stores/${store._id}`}
          icon={<FiArrowRight />}
          className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#ffd83d] px-5 font-serif text-[9px] font-extrabold text-black transition hover:bg-[#ffcf12] sm:h-11"
        />
      </div>
    </article>
  );
};

/* ============================================================
   PAGE
============================================================ */

const Stores = () => {
  const { data, isLoading, isError } = useGetStoreLocatorQuery();

  const stores = useMemo(
    () => extractStores(data).filter(isActiveStore),
    [data],
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8 transition-colors duration-300 dark:bg-[#090909] sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-362.5 px-4 sm:px-6 lg:px-8">
        {/* LOADING */}
        {isLoading ? (
          <>
            <PageHeader />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <StoreCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : isError ? (
          /* ERROR */
          <>
            <PageHeader count={0} />

            <p className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">
              Failed to load stores. Please try again later.
            </p>
          </>
        ) : (
          <>
            <PageHeader count={stores.length} />

            {stores.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {stores.map((store) => (
                  <StoreCard key={store._id} store={store} />
                ))}
              </div>
            ) : (
              /* EMPTY */
              <div className="flex flex-col items-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
                  <FiMapPin size={25} />
                </div>

                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  No stores available
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Please check back soon.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Stores;
