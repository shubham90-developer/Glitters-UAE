"use client";

import { useGetAddToCartQuery } from "@/store/addToCartApi";
import { PaymentMethod } from "@/store/ordersApi";
import PlaceOrderButton from "./PlaceOrderButton";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  FiBox,
  FiCheck,
  FiCopy,
  FiLock,
  FiPercent,
  FiShield,
  FiTag,
} from "react-icons/fi";

/* ====================================================== */
/* CONFIG */
/* ====================================================== */

// Base URL for images stored on your backend (e.g. "http://localhost:5000").
// Full http(s) URLs from the API are used as-is.
const IMAGE_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const PLACEHOLDER = "/placeholder.png";

/* ====================================================== */
/* TYPES */
/* ====================================================== */

type Named = { name?: string } | string | null | undefined;

type Coupon = {
  _id: string;
  code: string;
  title?: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
  expiryDate?: string;
  isActive?: boolean;
};

// coupon exactly as the backend sends it (populated on product.coupon)
type BackendCoupon = {
  _id?: string;
  couponName?: string;
  subTitle?: string;
  couponCode?: string;
  couponAmount?: string | number; // percentage
  status?: string; // "active" | "inactive"
};

type RawCoupon = Coupon | BackendCoupon | string;

type Variant = {
  _id?: string;
  price?: number;
  image?: string[] | string;
  images?: string[];
  color?: Named;
  size?: Named;
  material?: Named;
  coupon?: RawCoupon | null;
};

type CartItem = {
  _id: string;
  quantity: number;
  price?: number;
  variantId?: string;
  variant?: Variant | string | null;
  color?: Named;
  size?: Named;
  material?: Named;
  coupon?: RawCoupon | null;
  coupons?: RawCoupon[];
  product?: {
    _id: string;
    productName: string;
    brand?: Named;
    material?: Named;
    coupon?: RawCoupon | null;
    coupons?: RawCoupon[];
    variants?: Variant[];
  } | null;
};

type CartRow = {
  id: string;
  name: string;
  brand: string;
  image: string;
  color: string;
  size: string;
  material: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discount: number;
  payable: number;
  appliedCode: string | null;
};

// one entry per coupon attached to a cart product
type CouponEntry = {
  key: string;
  coupon: Coupon;
  productName: string;
  lineTotal: number;
  savings: number; // what this coupon would save on this item
  unavailable: string | null; // reason it can't be used
  isApplied: boolean;
};

/* ====================================================== */
/* HELPERS */
/* ====================================================== */

const formatAED = (n: number) => `AED ${n.toLocaleString()}`;

const nameOf = (v: Named) => (typeof v === "string" ? v : (v?.name ?? ""));

// find the variant this cart line belongs to (falls back to the first one)
const getVariant = (item: CartItem): Variant | undefined => {
  if (item.variant && typeof item.variant === "object") return item.variant;
  const variants = item.product?.variants ?? [];
  const id =
    item.variantId ?? (typeof item.variant === "string" ? item.variant : "");
  return variants.find((v) => v._id === id) ?? variants[0];
};

const getUnitPrice = (item: CartItem) =>
  Number(item.price ?? getVariant(item)?.price ?? 0);

const resolveImage = (src?: string) => {
  if (!src) return PLACEHOLDER;
  if (/^(https?:|data:|blob:)/.test(src)) return src;
  return `${IMAGE_BASE}/${src.replace(/^\/+/, "")}`;
};

const getImage = (item: CartItem) => {
  const v = getVariant(item);
  const first =
    (Array.isArray(v?.image) ? v?.image[0] : v?.image) ??
    v?.images?.[0] ??
    item.product?.variants?.[0]?.image?.[0];
  return resolveImage(typeof first === "string" ? first : undefined);
};

// every place a coupon might live in the cart response
const getRawCoupons = (item: CartItem): RawCoupon[] => {
  const p = item.product;
  return [
    item.coupon,
    ...(item.coupons ?? []),
    p?.coupon,
    ...(p?.coupons ?? []),
    getVariant(item)?.coupon,
  ].filter((c): c is RawCoupon => !!c);
};

// backend coupon (couponCode / couponAmount %) -> shape used in this file
const normalizeCoupon = (c: RawCoupon): Coupon | string => {
  if (typeof c === "string") return c;

  const b = c as BackendCoupon;
  if (typeof b.couponCode === "string") {
    return {
      _id: b._id ?? b.couponCode,
      code: b.couponCode,
      title: b.couponName,
      description: b.subTitle,
      discountType: "percentage",
      discountValue: Number(b.couponAmount),
      isActive: b.status ? b.status.toLowerCase() === "active" : undefined,
    };
  }

  return c as Coupon;
};

const isCoupon = (c: unknown): c is Coupon =>
  !!c && typeof c === "object" && typeof (c as Coupon).code === "string";

// populated coupons only (an unpopulated id string can't be displayed)
const getCoupons = (item: CartItem): Coupon[] => {
  const seen = new Set<string>();
  return getRawCoupons(item)
    .map(normalizeCoupon)
    .filter((c): c is Coupon => {
      if (!isCoupon(c)) return false;
      const id = c._id ?? c.code;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
};

const getUnavailableReason = (coupon: Coupon, lineTotal: number) => {
  if (coupon.isActive === false) return "Inactive";
  if (
    coupon.discountType === "percentage" &&
    !(coupon.discountValue > 0 && coupon.discountValue <= 100)
  )
    return "Invalid coupon";
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date())
    return "Expired";
  if (coupon.minPurchase && lineTotal < coupon.minPurchase)
    return `Min. purchase ${formatAED(coupon.minPurchase)}`;
  return null;
};

const calcCouponDiscount = (coupon: Coupon, lineTotal: number) => {
  const raw =
    coupon.discountType === "fixed"
      ? coupon.discountValue
      : (lineTotal * coupon.discountValue) / 100;
  return Math.min(Math.round(raw * 100) / 100, lineTotal);
};

const discountLabel = (c: Coupon) =>
  c.discountType === "fixed"
    ? `AED ${c.discountValue} OFF`
    : `${c.discountValue}% OFF`;

/* ====================================================== */
/* SMALL COMPONENTS */
/* ====================================================== */

const SummaryRow = ({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[12px] text-gray-900 dark:text-gray-300">
      {label}
    </span>
    <span
      className={`text-[11px] font-bold ${
        green ? "text-green-600" : "text-black dark:text-white"
      }`}
    >
      {value}
    </span>
  </div>
);

// falls back to the placeholder if the image fails to load
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? PLACEHOLDER : src}
      alt={alt}
      width={70}
      height={70}
      unoptimized
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  );
};

const Chip = ({ label, value }: { label: string; value: string }) =>
  value ? (
    <span className="rounded-md bg-[#f3f3f3] px-1.5 py-0.5 text-[9px] text-gray-600 dark:bg-[#262626] dark:text-gray-300">
      {label}: <b className="font-semibold">{value}</b>
    </span>
  ) : null;

/* ====================================================== */
/* COUPON CARD */
/* ====================================================== */

const CouponCard = ({
  entry,
  onApply,
  onRemove,
}: {
  entry: CouponEntry;
  onApply: (code: string) => void;
  onRemove: (code: string) => void;
}) => {
  const { coupon } = entry;
  const disabled = !!entry.unavailable;
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div
      className={`w-full rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-gray-700 dark:bg-[#181818] ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {/* product */}
      <div className="flex items-center gap-2.5 border-b border-dashed border-gray-200 pb-3 dark:border-gray-700">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[#3b3f9e]">
          <FiBox size={14} />
        </span>
        <div className="min-w-0">
          <p className="text-[9px] text-gray-400">Coupon for</p>
          <p className="truncate text-[11px] font-semibold text-black dark:text-white">
            {entry.productName}
          </p>
        </div>
      </div>

      {/* coupon info */}
      <div className="flex items-center gap-2.5 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffd83d] text-black">
          <FiPercent size={14} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-serif text-[12px] font-extrabold text-black dark:text-white">
            {coupon.title || coupon.code}
          </p>
          {coupon.description && (
            <p className="truncate text-[9px] text-gray-400">
              {coupon.description}
            </p>
          )}
        </div>
      </div>

      {/* discount */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Your discount</span>
        <span className="rounded-lg bg-[#fff4c2] px-2 py-1 text-[10px] font-bold text-[#7a5d00]">
          {discountLabel(coupon)}
        </span>
      </div>

      {/* price description */}
      {!disabled && (
        <div className="mt-2.5 space-y-1 rounded-lg bg-[#f8f8f8] p-2 text-[10px] dark:bg-[#202020]">
          <div className="flex justify-between text-gray-500">
            <span>Item price</span>
            <span>{formatAED(entry.lineTotal)}</span>
          </div>
          <div className="flex justify-between font-semibold text-green-600">
            <span>You save</span>
            <span>- {formatAED(entry.savings)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1 font-bold text-black dark:border-gray-700 dark:text-white">
            <span>You pay</span>
            <span>{formatAED(entry.lineTotal - entry.savings)}</span>
          </div>
        </div>
      )}

      {/* status */}
      {disabled ? (
        <span className="mt-3 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-semibold text-red-500">
          {entry.unavailable}
        </span>
      ) : (
        <span className="mt-3 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-semibold text-green-600">
          {entry.isApplied ? "Applied" : "Active"}
        </span>
      )}

      {/* code + action */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-gray-200 pt-3 dark:border-gray-700">
        <button
          type="button"
          onClick={copyCode}
          className="flex min-w-0 items-center gap-1.5 rounded-md border border-dashed border-[#e0b800] bg-[#fff4c2] px-2 py-1.5 font-mono text-[10px] font-bold text-black"
        >
          <span className="truncate">{coupon.code}</span>
          {copied ? (
            <FiCheck size={11} className="shrink-0 text-green-600" />
          ) : (
            <FiCopy size={11} className="shrink-0" />
          )}
        </button>

        {entry.isApplied ? (
          <button
            type="button"
            onClick={() => onRemove(coupon.code)}
            className="h-9 shrink-0 cursor-pointer rounded-lg border border-red-200 px-5 text-[11px] font-bold text-red-500 transition hover:bg-red-50"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onApply(coupon.code)}
            className="h-9 shrink-0 cursor-pointer rounded-lg bg-[#ffd83d] px-6 text-[11px] font-bold text-black transition hover:bg-[#ffcf12] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

/* ====================================================== */
/* ORDER SUMMARY */
/* ====================================================== */

type OrderSummaryProps = {
  shippingAddress?: {
    name: string;
    type: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
  paymentMethod?: PaymentMethod;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  shippingAddress,
  paymentMethod,
}) => {
  const { data, isLoading, isError } = useGetAddToCartQuery();

  // skip lines whose product is missing / not populated (they show "AED 0")
  const cartItems = useMemo(
    () => ((data ?? []) as CartItem[]).filter((i) => i.product),
    [data],
  );

  const [couponInput, setCouponInput] = useState("");
  const [appliedCodes, setAppliedCodes] = useState<string[]>([]);
  const [couponError, setCouponError] = useState("");

  /* ---------- coupon entries (ALL coupons of cart products) ---------- */
  const couponEntries: CouponEntry[] = useMemo(() => {
    const list = cartItems.flatMap((item) => {
      const lineTotal = getUnitPrice(item) * item.quantity;
      return getCoupons(item).map((coupon) => {
        const unavailable = getUnavailableReason(coupon, lineTotal);
        return {
          key: `${item._id}-${coupon._id}`,
          coupon,
          productName: item.product?.productName ?? "",
          lineTotal,
          savings: unavailable ? 0 : calcCouponDiscount(coupon, lineTotal),
          unavailable,
          isApplied:
            !unavailable && appliedCodes.includes(coupon.code.toUpperCase()),
        };
      });
    });
    // usable coupons first
    return list.sort(
      (a, b) => Number(!!a.unavailable) - Number(!!b.unavailable),
    );
  }, [cartItems, appliedCodes]);

  // coupons exist on products but the API sent only ids (not populated)
  const hasUnpopulated = useMemo(
    () =>
      cartItems.some((i) =>
        getRawCoupons(i).some((c) => typeof c === "string"),
      ),
    [cartItems],
  );

  /* ---------- per product rows ---------- */
  const rows: CartRow[] = useMemo(
    () =>
      cartItems.map((item) => {
        const v = getVariant(item);
        const unitPrice = getUnitPrice(item);
        const lineTotal = unitPrice * item.quantity;

        // best applied coupon for this product
        const applied = couponEntries
          .filter((e) => e.isApplied && e.key.startsWith(`${item._id}-`))
          .sort((a, b) => b.savings - a.savings)[0];
        const discount = applied?.savings ?? 0;

        return {
          id: item._id,
          name: item.product?.productName ?? "",
          brand: nameOf(item.product?.brand),
          image: getImage(item),
          color: nameOf(item.color ?? v?.color),
          size: nameOf(item.size ?? v?.size),
          material: nameOf(
            item.material ?? v?.material ?? item.product?.material,
          ),
          quantity: item.quantity,
          unitPrice,
          lineTotal,
          discount,
          payable: lineTotal - discount,
          appliedCode: applied?.coupon.code ?? null,
        };
      }),
    [cartItems, couponEntries],
  );

  /* ---------- totals ---------- */
  const subtotal = rows.reduce((s, r) => s + r.lineTotal, 0);
  const totalDiscount = rows.reduce((s, r) => s + r.discount, 0);
  const afterDiscount = subtotal - totalDiscount;
  const shipping = afterDiscount === 0 || afterDiscount >= 500 ? 0 : 25;
  const total = Math.max(afterDiscount + shipping, 0);

  /* ---------- coupon actions ---------- */

  // core logic: validates + applies. Returns true on success.
  // (does NOT touch the input field, callers decide what to do with it)
  const applyCoupon = (rawCode: string): boolean => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return false;

    const match = couponEntries.filter(
      (e) => e.coupon.code.toUpperCase() === code,
    );

    if (match.length === 0) {
      setCouponError("This coupon is not valid for any product in your cart");
      return false;
    }

    if (match.every((e) => e.unavailable)) {
      setCouponError(`Coupon unavailable: ${match[0].unavailable}`);
      return false;
    }

    setCouponError("");
    setAppliedCodes((prev) => (prev.includes(code) ? prev : [...prev, code]));
    return true;
  };

  // Apply button on a coupon card -> also fills the "Have a coupon?" field
  const applyFromCard = (code: string) => {
    setCouponInput(code);
    applyCoupon(code);
  };

  // Apply button / Enter inside the "Have a coupon?" field
  const applyFromInput = () => {
    if (applyCoupon(couponInput)) setCouponInput("");
  };

  const removeCoupon = (code: string) => {
    setAppliedCodes((prev) => prev.filter((c) => c !== code.toUpperCase()));
    // clear the field if it still holds the removed code
    setCouponInput((cur) =>
      cur.toUpperCase() === code.toUpperCase() ? "" : cur,
    );
  };

  return (
    <aside className="min-w-0">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_5px_24px_rgba(0,0,0,0.04)] sm:p-5 lg:sticky lg:top-25 dark:border-gray-800 dark:bg-[#181818]">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-[15px] font-extrabold text-black sm:text-[17px] dark:text-white">
            Order Summary
          </h2>

          <Link
            href="/cart"
            className="rounded-lg bg-green-500 px-2 py-1 text-[10px] font-bold text-white hover:underline"
          >
            Edit Cart
          </Link>
        </div>

        {isLoading && (
          <p className="py-6 text-center text-[11px] text-gray-400">
            Loading...
          </p>
        )}

        {isError && (
          <p className="py-6 text-center text-[11px] text-red-500">
            Unable to load cart
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {/* PRODUCTS */}
            <div className="mt-4 space-y-3 border-b border-gray-100 pb-4 dark:border-gray-800">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-gray-100 p-2.5 dark:border-gray-800"
                >
                  <div className="flex gap-2.5">
                    <div className="relative h-15 w-15 shrink-0 overflow-hidden rounded-lg bg-[#f8f8f8] p-1.5 dark:bg-[#222]">
                      <ProductImage src={row.image} alt={row.name} />
                      <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffd83d] px-1 text-[8px] font-bold text-black">
                        {row.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      {row.brand && (
                        <p className="truncate text-[8px] font-bold uppercase tracking-wider text-gray-400">
                          {row.brand}
                        </p>
                      )}
                      <h3 className="line-clamp-2 font-serif text-[10px] font-bold leading-4 text-black dark:text-white">
                        {row.name}
                      </h3>

                      {/* material / size / color */}
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Chip label="Material" value={row.material} />
                        <Chip label="Size" value={row.size} />
                        <Chip label="Color" value={row.color} />
                      </div>
                    </div>
                    <div className="mt-1.5 flex flex-col items-center gap-2 text-[10px]">
                      <div>
                        <span className="font-bold text-black dark:text-white">
                          {formatAED(row.payable)}
                        </span>
                        {row.discount > 0 && (
                          <span className="text-gray-400 line-through">
                            {formatAED(row.lineTotal)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-900 font-semibold">
                          {formatAED(row.unitPrice)} × {row.quantity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {row.appliedCode && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 px-2 py-1.5 text-[10px] font-semibold text-green-600 dark:bg-green-950/30">
                      <span className="flex items-center gap-1">
                        <FiTag size={10} />
                        {row.appliedCode}
                      </span>
                      <span>- {formatAED(row.discount)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* COUPON INPUT */}
            <div className="border-b border-gray-100 py-4 dark:border-gray-800">
              <label className="mb-1.5 block text-[10px] font-semibold text-gray-900 dark:text-gray-300">
                Have a coupon?
              </label>

              <div className="flex h-10 overflow-hidden rounded-lg border border-gray-200 focus-within:border-[#ffd83d] dark:border-gray-700">
                <div className="flex min-w-0 flex-1 items-center">
                  <FiTag className="ml-3 shrink-0 text-gray-400" size={12} />
                  <input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && applyFromInput()}
                    placeholder="Enter coupon code"
                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-[11px] text-black outline-none placeholder:text-gray-400 dark:text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={applyFromInput}
                  className="shrink-0 cursor-pointer bg-[#ffd83d] px-3 text-[10px] font-bold text-black transition hover:bg-[#ffcf12]"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="mt-2 text-[10px] font-semibold text-red-500">
                  {couponError}
                </p>
              )}
            </div>

            {/* PRODUCT COUPONS — all coupons with Apply button */}
            {couponEntries.length > 0 && (
              <div className="border-b border-gray-100 py-4 dark:border-gray-800">
                <p className="mb-2 text-[10px] font-semibold text-gray-900 dark:text-gray-300">
                  Available coupons
                </p>

                <div className="max-h-80 space-y-2.5 overflow-y-auto pr-1">
                  {couponEntries.map((entry) => (
                    <CouponCard
                      key={entry.key}
                      entry={entry}
                      onApply={applyFromCard}
                      onRemove={removeCoupon}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PRICE BREAKDOWN */}
            <div className="space-y-3 border-b border-gray-100 py-4 dark:border-gray-800">
              <SummaryRow label="Subtotal" value={formatAED(subtotal)} />

              {rows
                .filter((r) => r.discount > 0)
                .map((r) => (
                  <SummaryRow
                    key={r.id}
                    label={`${r.appliedCode} on ${r.name}`}
                    value={`- ${formatAED(r.discount)}`}
                    green
                  />
                ))}

              {totalDiscount > 0 && (
                <SummaryRow
                  label="Total Discount"
                  value={`- ${formatAED(totalDiscount)}`}
                  green
                />
              )}

              <SummaryRow
                label="Shipping"
                value={shipping === 0 ? "Free" : formatAED(shipping)}
                green={shipping === 0}
              />
            </div>

            {/* TOTAL */}
            <div className="flex items-end justify-between gap-3 py-4">
              <div>
                <p className="text-[14px] font-bold text-black dark:text-white">
                  Total
                </p>
                <p className="mt-0.5 text-[10px] text-gray-900 dark:text-gray-400">
                  Inclusive of VAT
                </p>
              </div>

              <div className="text-right">
                {totalDiscount > 0 && (
                  <p className="text-[11px] text-gray-400 line-through">
                    {formatAED(subtotal + shipping)}
                  </p>
                )}
                <p className="font-serif text-[20px] font-extrabold text-black dark:text-white">
                  {formatAED(total)}
                </p>
              </div>
            </div>

            {/* PLACE ORDER */}
            <PlaceOrderButton
              shippingAddress={shippingAddress}
              paymentMethod={paymentMethod}
              disabled={cartItems.length === 0}
            />

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-900 dark:text-gray-400">
              <FiLock size={9} />
              Secure encrypted checkout
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#f8f8f8] p-3 dark:bg-[#202020]">
              <FiShield size={16} className="mt-0.5 shrink-0 text-[#a17b00]" />
              <div>
                <p className="text-[10px] font-bold text-black dark:text-white">
                  Secure Checkout
                </p>
                <p className="mt-0.5 text-[9px] leading-3 text-gray-400">
                  Your personal and payment information is protected.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default OrderSummary;
