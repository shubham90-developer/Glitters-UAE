/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiBox, FiPercent, FiShoppingBag } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";

import { useGetProductsQuery } from "@/store/productsApi";
import { useAddToCartMutation } from "@/store/addToCartApi";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ApiVariant = {
  price: number;
  delPrice?: number;
  stock?: number;
  image?: string;
};

type ApiReview = { rating?: number | string };

type ApiProduct = {
  _id: string;
  productName: string;
  shortDesc?: string;
  dealOfTheDay?: boolean;
  dealStartTime?: string | null;
  dealEndTime?: string | null;
  variants: ApiVariant[];
  reviews?: ApiReview[];
  status?: string;
  isDeleted?: boolean;
};

type Deal = {
  id: string;
  productId: string;
  name: string;
  description: string;
  image?: string;
  href: string;
  price: number;
  oldPrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  endsAt: number | null; // deal end time (ms), null = no end time saved
};

type TimeLeft = { hours: number; minutes: number; seconds: number };

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Accepts `[...]` or `{ data: [...] }` / `{ products: [...] }` */
const toList = <T,>(response: unknown): T[] => {
  if (Array.isArray(response)) return response as T[];

  if (response && typeof response === "object") {
    const { data, products } = response as Record<string, unknown>;
    if (Array.isArray(data)) return data as T[];
    if (Array.isArray(products)) return products as T[];
  }

  return [];
};

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").trim();

/** Same slug rule as the cart page, so links open the same product route */
const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isVisible = (p: ApiProduct) =>
  p.status === "active" && !p.isDeleted && p.variants?.length > 0;

const toTime = (value?: string | null): number | null => {
  if (!value) return null;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? null : time;
};

/**
 * A deal is live while "now" is between its start and end time.
 * Older deal products without saved times stay live (they count down to midnight).
 */
const isDealLive = (p: ApiProduct, now: number) => {
  const start = toTime(p.dealStartTime);
  const end = toTime(p.dealEndTime);

  if (start !== null && now < start) return false;
  if (end !== null && now >= end) return false;

  return true;
};

const toDeal = (p: ApiProduct): Deal => {
  const variant = p.variants.find((v) => (v.stock ?? 0) > 0) ?? p.variants[0];

  const ratings = (p.reviews ?? [])
    .map((r) => Number(r.rating))
    .filter((n) => Number.isFinite(n) && n > 0);

  const rating = ratings.length
    ? ratings.reduce((sum, n) => sum + n, 0) / ratings.length
    : 0;

  return {
    id: p._id,
    productId: p._id,
    name: p.productName,
    description: stripHtml(p.shortDesc),
    image: variant.image,
    href: `/product/${slugify(p.productName)}/${p._id}`,
    price: variant.price,
    oldPrice: variant.delPrice ?? variant.price,
    stock: Number(variant.stock ?? 0),
    rating,
    reviewCount: p.reviews?.length ?? 0,
    endsAt: toTime(p.dealEndTime),
  };
};

const getTimeLeft = (target: number, now: number): TimeLeft => {
  const total = Math.max(0, Math.floor((target - now) / 1000));

  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

const getEndOfDay = (now: number) => {
  const endOfDay = new Date(now);
  endOfDay.setHours(24, 0, 0, 0);

  return endOfDay.getTime();
};

/** Current time, updated every second. Starts at 0 so server and client HTML match. */
const useNow = () => {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
};

/* -------------------------------------------------------------------------- */
/*  DealOfTheDay (main section)                                               */
/* -------------------------------------------------------------------------- */

const DealOfTheDay = () => {
  const { data: response, isLoading, isError } = useGetProductsQuery();
  const now = useNow();

  // only a deal that is inside its start / end time is shown (re-checked every second)
  const deal = useMemo<Deal | null>(() => {
    if (!now) return null;

    const product = toList<ApiProduct>(response).find(
      (p) => isVisible(p) && p.dealOfTheDay === true && isDealLive(p, now),
    );

    return product ? toDeal(product) : null;
  }, [response, now]);

  // counts down to the deal's end time (older deals without one: to midnight)
  const time: TimeLeft = deal
    ? getTimeLeft(deal.endsAt ?? getEndOfDay(now), now)
    : { hours: 0, minutes: 0, seconds: 0 };

  if (isLoading || !now) {
    return (
      <Wrapper>
        <div className="h-25 animate-pulse rounded-xl bg-gray-100 dark:bg-[#222]" />
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper>
        <div className="flex h-25 items-center justify-center rounded-xl border border-red-100 bg-red-50">
          <p className="text-sm text-red-500">Unable to load products</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="grid overflow-hidden rounded-xl border border-[#f4ead0] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.03)] lg:h-25 lg:grid-cols-[305px_minmax(0,1fr)_265px] dark:border-gray-800 dark:bg-[#171717]">
        <DealTimer time={time} />
        {deal ? <DealProductCard deal={deal} /> : <EmptyProduct />}
        <PromoBanner />
      </div>
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <section className="w-full bg-white py-3 dark:bg-[#111]">
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Left: timer                                                               */
/* -------------------------------------------------------------------------- */

const DealTimer = ({ time }: { time: TimeLeft }) => (
  <div className="relative flex min-h-25 flex-col justify-center overflow-hidden bg-linear-to-r from-[#fff8d9] via-[#fffbea] to-[#fffdf6] px-5">
    <div className="pointer-events-none absolute -right-10 -top-12 h-30 w-30 rounded-full bg-[#ffe576]/20 blur-2xl" />

    <h2 className="relative font-serif text-[20px] font-extrabold leading-none tracking-[-0.4px] text-[#181818]">
      Deal of the Day
    </h2>

    <div className="relative mt-4 flex items-center gap-3">
      <span className="shrink-0 text-[10px] font-semibold text-[#555]">
        Ends in
      </span>

      <span className="h-5 w-px bg-[#ddd5b8]" />

      <div className="flex items-center gap-2 font-serif">
        <TimeBox value={time.hours} label="Hours" />
        <Colon />
        <TimeBox value={time.minutes} label="Minutes" />
        <Colon />
        <TimeBox value={time.seconds} label="Seconds" />
      </div>
    </div>
  </div>
);

const Colon = () => (
  <span className="text-[15px] font-bold text-[#cbb341]">:</span>
);

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex h-10.5 w-12.5 flex-col items-center justify-center rounded-md bg-[#ffe066] shadow-[0_2px_4px_rgba(221,179,0,0.08)]">
    <span className="text-[13px] font-extrabold leading-none text-[#151515]">
      {String(value).padStart(2, "0")}
    </span>
    <span className="mt-1 text-[7px] font-semibold leading-none text-[#6f5a00]">
      {label}
    </span>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Center: deal product                                                      */
/* -------------------------------------------------------------------------- */

const DealProductCard = ({ deal }: { deal: Deal }) => {
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(deal.image?.trim()) && !imageError;
  const saving = Math.max(0, deal.oldPrice - deal.price);
  const discount = saving > 0 ? Math.round((saving / deal.oldPrice) * 100) : 0;
  const outOfStock = deal.stock <= 0;

  const buttonLabel = outOfStock
    ? "Out of Stock"
    : isAdding
      ? "Adding..."
      : "Add to Cart";

  /**
   * Add to cart
   */
  const handleAddToCart = async () => {
    if (outOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      const res = await addToCart({
        product: deal.productId,
        quantity: 1,
      }).unwrap();

      toast.success(res?.message ?? "Product added to cart");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to add product to cart. Try again.",
      );
    }
  };

  return (
    <div className="group relative flex min-h-25 items-center border-y border-[#f3ead5] bg-white px-4.5 py-3 lg:border-x lg:border-y-0 lg:py-0 dark:border-gray-800 dark:bg-[#171717]">
      {/* IMAGE */}
      <Link
        href={deal.href}
        className="relative h-22.5 w-36.25 shrink-0 overflow-hidden"
      >
        {hasImage ? (
          <Image
            src={deal.image!}
            alt={deal.name}
            fill
            sizes="145px"
            onError={() => setImageError(true)}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#fafafa] text-gray-300 dark:bg-[#222]">
            <FiBox size={30} strokeWidth={1.4} />
          </div>
        )}
      </Link>

      {/* INFO */}
      <div className="min-w-0 flex-1 pl-3">
        <Link
          href={deal.href}
          className="line-clamp-1 font-serif text-[11px] font-extrabold leading-3.75 text-[#161616] transition hover:text-[#c49b00] dark:text-white"
        >
          {deal.name}
        </Link>

        {deal.description && (
          <p className="mt-px line-clamp-1 text-[9px] font-medium text-[#555] dark:text-gray-400">
            {deal.description}
          </p>
        )}

        <Rating rating={deal.rating} count={deal.reviewCount} />

        <div className="mt-1.5 flex items-center gap-3">
          <span className="font-serif text-[14px] font-extrabold text-[#171717] dark:text-white">
            AED {deal.price.toLocaleString()}
          </span>

          {saving > 0 && (
            <span className="text-[9px] font-medium text-[#a2a2a2] line-through">
              AED {deal.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* MOBILE ADD TO CART (desktop button is in the actions column) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || outOfStock}
          className="mt-2 flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#ffd83d] px-3 font-serif text-[10px] font-bold text-black transition hover:bg-[#ffcc00] disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
        >
          <FiShoppingBag size={12} />
          {buttonLabel}
        </button>
      </div>

      {/* ACTIONS */}
      <div className="ml-3 hidden h-full min-w-31.25 shrink-0 flex-col items-end justify-between py-2.5 sm:flex">
        {discount > 0 ? (
          <span className="rounded-[5px] bg-[#ff3b49] px-2.5 py-1 text-[9px] font-extrabold leading-none text-white">
            {discount}% OFF
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || outOfStock}
          className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ffd83d] font-serif text-[11px] font-bold text-black transition-all duration-200 hover:bg-[#ffcc00] hover:shadow-[0_6px_18px_rgba(255,216,61,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiShoppingBag size={15} />
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

const Rating = ({ rating, count }: { rating: number; count: number }) => (
  <div className="mt-1.25 flex items-center">
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <AiFillStar
          key={star}
          size={10}
          className={
            star <= Math.round(rating)
              ? "fill-[#ffbf00] text-[#ffbf00]"
              : "text-[#d8d8d8]"
          }
        />
      ))}
    </div>

    {rating > 0 && (
      <span className="ml-1 text-[8px] text-[#999]">
        {rating.toFixed(1)} ({count})
      </span>
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Right: promo banner                                                       */
/* -------------------------------------------------------------------------- */

const PromoBanner = () => (
  <Link
    href="/product-list"
    className="group relative flex min-h-25 items-center overflow-hidden bg-linear-to-r from-[#fff4b7] via-[#fff9dd] to-[#fffdf5] px-5"
  >
    <div className="absolute -left-6.25 -top-4.5 h-30 w-30 rotate-16 rounded-[28px] bg-[#ffdc39]/35" />
    <div className="absolute left-6 top-4 h-16 w-16 rotate-[-10deg] rounded-[17px] bg-[#ffd21c]/30" />

    <div className="relative z-10 flex h-14.5 w-13.25 shrink-0 rotate-[-8deg] items-center justify-center rounded-[10px] bg-[#ffd01a] shadow-[0_5px_12px_rgba(215,163,0,0.16)]">
      <FiPercent size={27} strokeWidth={3} className="text-[#151515]" />
    </div>

    <div className="relative z-10 ml-5 min-w-0">
      <h3 className="whitespace-nowrap font-serif text-[13px] font-extrabold leading-tight text-[#171717]">
        Don&apos;t Miss Out!
      </h3>

      <p className="mt-1 whitespace-nowrap text-[8px] text-[#555]">
        Great deals. Every day.
      </p>

      <span className="mt-3 flex items-center gap-2 whitespace-nowrap text-[9px] font-extrabold text-[#222]">
        Shop Daily Deals
        <FiArrowRight
          size={12}
          className="transition-transform duration-200 group-hover:translate-x-0.75"
        />
      </span>
    </div>
  </Link>
);

/* -------------------------------------------------------------------------- */
/*  Empty state                                                               */
/* -------------------------------------------------------------------------- */

const EmptyProduct = () => (
  <div className="relative flex min-h-25 items-center justify-center overflow-hidden border-y border-[#f3ead5] bg-[#fcfcfc] lg:border-x lg:border-y-0 dark:border-gray-800 dark:bg-[#181818]">
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[125%] -translate-x-1/2 -translate-y-1/2 rotate-11 bg-[#edf0f4]" />
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[125%] -translate-x-1/2 -translate-y-1/2 rotate-[-11deg] bg-[#edf0f4]" />

    <div className="relative z-10 flex items-center gap-2.5 rounded-[10px] bg-[#fcfcfc] px-4.5 py-2.5 dark:bg-[#181818]">
      <FiBox size={30} strokeWidth={1.45} className="text-[#cbd3dd]" />

      <div>
        <p className="text-[11px] font-semibold leading-none text-[#c1cad5]">
          Product
        </p>
        <p className="mt-1 text-[8px] text-[#d0d6de]">No deal available</p>
      </div>
    </div>
  </div>
);

export default DealOfTheDay;
