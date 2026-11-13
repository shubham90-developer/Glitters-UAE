"use client";

import { useEffect, useMemo, useState } from "react";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import {
  FiCheck,
  FiHeart,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "@/store/addToCartApi";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ApiVariant = {
  _id: string;
  price: number;
  delPrice?: number;
  stock?: number;
  color?: { _id: string; colorName?: string; hexCode?: string };
  size?: { _id: string; size?: string };
};

type ApiProduct = {
  _id?: string;
  productName?: string;
  brand?: { name?: string } | null;
  material?: { name?: string } | null;
  shortDesc?: string;
  status?: string;
  reviews?: { rating?: number | string }[];
  variants?: ApiVariant[];
};

type ColorOption = { id: string; name: string; hex: string };
type SizeOption = { id: string; label: string; inStock: boolean };

type ProductInfoProps = {
  product?: ApiProduct | null;
  // Optional: lets the parent know which color is currently active
  onColorChange?: (colorId: string | null) => void;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const LOW_STOCK_LIMIT = 5;

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").trim();

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
};

const getAverageRating = (reviews: ApiProduct["reviews"] = []) => {
  const ratings = reviews
    .map((r) => Number(r.rating))
    .filter((n) => Number.isFinite(n) && n > 0);

  return ratings.length
    ? ratings.reduce((sum, n) => sum + n, 0) / ratings.length
    : 0;
};

const getColorOptions = (variants: ApiVariant[]): ColorOption[] => {
  const map = new Map<string, ColorOption>();

  variants.forEach(({ color }) => {
    if (color?._id && !map.has(color._id)) {
      map.set(color._id, {
        id: color._id,
        name: color.colorName ?? "Color",
        hex: color.hexCode ?? "#d1d5db",
      });
    }
  });

  return [...map.values()];
};

const getSizeOptions = (variants: ApiVariant[]): SizeOption[] => {
  const map = new Map<string, SizeOption>();

  variants.forEach(({ size, stock }) => {
    if (size?._id && !map.has(size._id)) {
      map.set(size._id, {
        id: size._id,
        label: size.size ?? "-",
        inStock: (stock ?? 0) > 0,
      });
    }
  });

  return [...map.values()];
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const ProductInfo = ({ product, onColorChange }: ProductInfoProps) => {
  const [colorId, setColorId] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const [addToCart, { isLoading: isBuying }] = useAddToCartMutation();

  const variants = useMemo(() => product?.variants ?? [], [product]);

  /* ----- colors ----- */
  const colorOptions = useMemo(() => getColorOptions(variants), [variants]);

  const activeColorId =
    colorId && colorOptions.some((c) => c.id === colorId)
      ? colorId
      : (variants.find((v) => (v.stock ?? 0) > 0)?.color?._id ??
        colorOptions[0]?.id ??
        null);

  /* ----- tell parent the active color (drives the image gallery) ----- */
  useEffect(() => {
    onColorChange?.(activeColorId);
  }, [activeColorId, onColorChange]);

  /* ----- sizes (only those that exist for the active color) ----- */
  const colorVariants = useMemo(
    () => variants.filter((v) => (v.color?._id ?? null) === activeColorId),
    [variants, activeColorId],
  );

  const sizeOptions = useMemo(
    () => getSizeOptions(colorVariants),
    [colorVariants],
  );

  const activeSizeId =
    sizeId && sizeOptions.some((s) => s.id === sizeId)
      ? sizeId
      : (sizeOptions.find((s) => s.inStock)?.id ?? sizeOptions[0]?.id ?? null);

  /* ----- selected variant ----- */
  const variant =
    colorVariants.find((v) => (v.size?._id ?? null) === activeSizeId) ??
    colorVariants[0];

  if (!product) return <ProductInfoSkeleton />;

  const activeColorName =
    colorOptions.find((c) => c.id === activeColorId)?.name ?? "";

  /* ----- price (per item) ----- */
  const price = variant?.price ?? 0;
  const oldPrice = variant?.delPrice ?? price;

  /* ----- stock ----- */
  const stock = variant?.stock ?? 0;
  const isActive = product.status === "active";
  const inStock = isActive && stock > 0;
  const quantityValue = Math.min(quantity, Math.max(stock, 1));

  /* ----- totals (price x quantity) ----- */
  const totalPrice = price * quantityValue;
  const totalOldPrice = oldPrice * quantityValue;
  const saving = Math.max(0, totalOldPrice - totalPrice);

  const stockLabel = !isActive
    ? "Unavailable"
    : stock <= 0
      ? "Out of Stock"
      : stock <= LOW_STOCK_LIMIT
        ? `Only ${stock} left`
        : "In Stock";

  const stockTone = !inStock
    ? "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
    : stock <= LOW_STOCK_LIMIT
      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
      : "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400";

  const stockDot = !inStock
    ? "bg-red-500"
    : stock <= LOW_STOCK_LIMIT
      ? "bg-amber-500"
      : "bg-green-500";

  /* ----- rating / description ----- */
  const reviewCount = product.reviews?.length ?? 0;
  const rating = getAverageRating(product.reviews);
  const description = stripHtml(product.shortDesc);
  const cleanDescription = description.replace(/&nbsp;/g, " ").trim();

  /* ----- handlers ----- */
  const handleColorChange = (id: string) => {
    setColorId(id);
    setSizeId(null);
    setQuantity(1);
  };

  const handleSizeChange = (id: string) => {
    setSizeId(id);
    setQuantity(1);
  };

  // Buy Now: add the selected variant to the cart, then go to checkout
  const productId = product._id;
  const variantId = variant?._id;

  const handleBuyNow = async () => {
    if (!productId || !variantId) {
      toast.error("Please select a color and size");
      return;
    }

    if (!inStock) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      await addToCart({
        product: productId,
        variantId,
        quantity: quantityValue,
      }).unwrap();

      router.push("/checkout");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Unable to continue. Please try again."),
      );
    }
  };

  return (
    <div className="w-full">
      {/* Brand + Material + Stock */}
      <div className="flex flex-wrap items-center justify-between gap-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.brand?.name && (
            <span className="rounded-md bg-[#fff7d6] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#9b7900] dark:bg-[#ffd83d]/10 dark:text-[#ffd83d]">
              {product.brand.name}
            </span>
          )}

          {product.material?.name && (
            <span className="rounded-md bg-[#1e1a0a] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.16em] text-white dark:bg-[#ffd83d]/10 dark:text-[#ffd83d]">
              {product.material.name}
            </span>
          )}
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${stockTone}`}
        >
          <span className={`h-2 w-2 rounded-full ${stockDot}`} />
          <span className="text-[11px] font-bold">{stockLabel}</span>
        </div>
      </div>

      {/* Product Name */}
      <h1 className="mt-2 font-serif text-2xl font-black leading-tight tracking-tight text-gray-950 sm:text-3xl dark:text-white">
        {product.productName}
      </h1>

      {/* Rating */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={15}
              className={
                star <= Math.round(rating)
                  ? "fill-[#f5b301] text-[#f5b301]"
                  : "text-gray-300 dark:text-gray-600"
              }
            />
          ))}
        </div>

        {rating > 0 && (
          <span className="text-[12px] font-extrabold text-gray-900 dark:text-white">
            {rating.toFixed(1)}
          </span>
        )}

        <span className="h-4 w-px bg-gray-200 dark:bg-white/10" />

        <button
          type="button"
          className="cursor-pointer text-xs font-semibold text-gray-500 transition hover:text-[#a88400] dark:text-gray-400 dark:hover:text-[#ffd83d]"
        >
          {reviewCount > 0
            ? `${reviewCount} customer ${reviewCount === 1 ? "review" : "reviews"}`
            : "No reviews yet"}
        </button>
      </div>

      {/* Price Box */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-white/10 dark:bg-white/3">
        <div className="flex items-start justify-between gap-3">
          {/* Price Details */}
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <span className="font-serif text-xl font-black tracking-tight text-gray-950 dark:text-white">
              AED {totalPrice.toLocaleString()}
            </span>

            {saving > 0 && totalOldPrice > 0 && (
              <>
                <del className="pb-1 text-sm font-semibold text-gray-400">
                  AED {totalOldPrice.toLocaleString()}
                </del>

                <span className="mb-0.5 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-extrabold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                  Save AED {saving.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* % OFF - Right Corner (same % for any quantity) */}
          {saving > 0 && oldPrice > 0 && (
            <span className="shrink-0 rounded-full bg-red-100 px-3 py-1.5 text-[10px] font-extrabold text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Per-item breakdown, only when quantity > 1 */}
        {quantityValue > 1 && (
          <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
            AED {price.toLocaleString()} × {quantityValue}
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Inclusive of all taxes
        </p>
      </div>

      {/* Description */}
      {cleanDescription && (
        <p className="mt-5 w-full max-w-full wrap-break-word text-[12px] leading-7 text-gray-500 dark:text-gray-400">
          {cleanDescription}
        </p>
      )}

      <div className="my-6 h-px bg-gray-100 dark:bg-white/10" />

      {/* Color */}
      {colorOptions.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-gray-950 dark:text-white">
              Select Color
            </h3>

            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {activeColorName}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => {
              const active = activeColorId === color.id;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorChange(color.id)}
                  title={color.name}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
                    active
                      ? "border-[#ffd83d] bg-[#fffbea] ring-2 ring-[#ffd83d]/20 dark:bg-[#ffd83d]/5"
                      : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-[#151515]"
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />

                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {color.name}
                  </span>

                  {active && (
                    <FiCheck
                      size={13}
                      className="text-[#a88400] dark:text-[#ffd83d]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      {sizeOptions.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-gray-950 dark:text-white">
              Select Size
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => {
              const active = activeSizeId === size.id;

              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => handleSizeChange(size.id)}
                  disabled={!size.inStock}
                  aria-pressed={active}
                  className={`flex h-11 min-w-12 items-center justify-center rounded-xl border px-4 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through ${
                    active
                      ? "border-[#ffd83d] bg-[#ffd83d] text-black shadow-sm"
                      : "cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-[#ffd83d] dark:border-white/10 dark:bg-[#151515] dark:text-gray-300"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-extrabold text-gray-950 dark:text-white">
          Quantity
        </h3>

        <div className="inline-flex h-12 items-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#151515]">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantityValue - 1))}
            disabled={quantityValue <= 1}
            aria-label="Decrease quantity"
            className="flex h-full w-11 cursor-pointer items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <FiMinus size={15} />
          </button>

          <span className="flex h-full min-w-12 items-center justify-center border-x border-gray-200 px-3 text-sm font-extrabold text-gray-950 dark:border-white/10 dark:text-white">
            {quantityValue}
          </span>

          <button
            type="button"
            onClick={() => setQuantity(quantityValue + 1)}
            disabled={quantityValue >= stock}
            aria-label="Increase quantity"
            className="flex h-full w-11 cursor-pointer items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <FiPlus size={15} />
          </button>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="mt-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="mb-0 text-sm font-extrabold text-gray-950 dark:text-white">
              Delivery details
            </h3>

            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              Enter your pincode to check estimated delivery
            </p>
          </div>

          {/* Select Delivery Location */}
          {/* <Link
            href={"/my-account"}
            className="shrink-0 cursor-pointer text-[11px] font-serif text-blue-600 font-bold transition hover:underline"
          >
            Select delivery location
          </Link> */}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/2">
          {/* Pincode Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit pincode"
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#f25268] focus:ring-2 focus:ring-[#f25268]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <button
              type="button"
              className="h-11 cursor-pointer rounded-lg bg-black px-5 text-xs font-bold text-white transition hover:bg-[#df4057] active:scale-95 dark:bg-white/10"
            >
              Check
            </button>
          </div>

          {/* Delivery Result */}
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-400/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
              ✓
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Estimated delivery
              </p>

              <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-400">
                Delivery by{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  10 October 2026
                </span>
              </p>

              <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                Available for delivery at your location
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          sticky bottom-0 z-40 mt-6
          border-t border-gray-200 bg-white/95
          px-0 py-3 backdrop-blur
          pb-[max(0.75rem,env(safe-area-inset-bottom))]
          dark:border-white/10 dark:bg-[#0f0f0f]/95
          sm:mt-7 sm:py-3.5
        "
      >
        {/* Action Header */}
        <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-3">
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold leading-tight text-gray-950 dark:text-white sm:text-sm">
              Buy this product
            </h3>

            <p className="mt-0.5 truncate text-[9px] leading-tight text-gray-500 dark:text-gray-400 sm:text-[10px]">
              Choose your preferred purchase option
            </p>
          </div>

          {inStock && (
            <span
              className="
                shrink-0 rounded-full
                bg-emerald-50 px-2 py-1
                text-[8px] font-bold leading-none
                text-emerald-600
                dark:bg-emerald-400/10
                dark:text-emerald-400
                sm:px-2.5 sm:text-[9px]
              "
            >
              In Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {inStock ? (
          <div className="grid w-full grid-cols-12 gap-1.5 sm:gap-2 md:grid-cols-8 md:gap-2.5">
            {/* Buy Now */}
            <div className="col-span-12 min-w-0 md:col-span-4">
              <ThemeBtnOne
                text="Buy Now"
                subtitle={`at AED ${totalPrice.toLocaleString()}`}
                onClick={handleBuyNow}
                disabled={isBuying}
                icon={
                  <FiShoppingBag className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                }
                className="
                  flex h-10 w-full min-w-0 cursor-pointer
                  items-center justify-center
                  gap-1 overflow-hidden
                  whitespace-nowrap rounded-lg
                  bg-[#ffd83d]
                  px-1 font-serif
                  text-[9px] font-bold text-black
                  transition-all duration-200
                  hover:bg-[#ffcc00]
                  sm:h-11 sm:gap-1.5 sm:rounded-xl
                  sm:px-1.5 sm:text-[10px]
                  md:h-12 md:px-2.5 md:text-[12px]
                "
              />
            </div>

            {/* Add to Cart */}
            <div className="col-span-6 min-w-0 md:col-span-2">
              <ThemeBtnOne
                text=""
                url="/cart"
                icon={<FiShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
                className="
                  flex h-10 w-full min-w-0
                  items-center justify-center
                  rounded-lg bg-gray-100
                  p-0 text-black
                  transition-all duration-200
                  hover:bg-[#ffd83d]
                  dark:bg-white/10 dark:text-white
                  sm:h-11 sm:rounded-xl
                  md:h-12
                "
              />
            </div>

            {/* Wishlist */}
            <div className="col-span-6 min-w-0 md:col-span-2">
              <ThemeBtnOne
                text=""
                url="/wishlist"
                icon={<FiHeart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
                className="
                  flex h-10 w-full min-w-0
                  items-center justify-center
                  rounded-lg bg-gray-100
                  p-0 text-black
                  transition-all duration-200
                  hover:bg-[#ffd83d]
                  dark:bg-white/10 dark:text-white
                  sm:h-11 sm:rounded-xl
                  md:h-12
                "
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled
            className="
              flex h-10 w-full
              items-center justify-center gap-2
              rounded-lg bg-gray-200
              px-4 text-xs font-extrabold
              text-gray-500
              dark:bg-white/10 dark:text-gray-500
              sm:h-11 sm:rounded-xl
              md:h-12
            "
          >
            <FiShoppingBag size={16} />
            <span className="truncate">{stockLabel}</span>
          </button>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-6 sm:grid-cols-3 dark:border-white/10">
        <Benefit
          icon={<FiTruck size={16} />}
          title="Fast Delivery"
          text="Quick shipping"
        />
        <Benefit
          icon={<FiRefreshCw size={16} />}
          title="Easy Returns"
          text="Hassle-free"
        />
        <Benefit
          icon={<FiShield size={16} />}
          title="Secure Payment"
          text="100% protected"
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

type BenefitProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

const Benefit = ({ icon, title, text }: BenefitProps) => (
  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-white/3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm dark:bg-white/5 dark:text-gray-300">
      {icon}
    </div>

    <div>
      <p className="text-[11px] font-extrabold text-gray-900 dark:text-white">
        {title}
      </p>
      <p className="mt-0.5 text-[10px] text-gray-500">{text}</p>
    </div>
  </div>
);

const ProductInfoSkeleton = () => (
  <div className="w-full animate-pulse space-y-4">
    <div className="h-6 w-1/3 rounded bg-gray-100 dark:bg-white/10" />
    <div className="h-9 w-3/4 rounded bg-gray-100 dark:bg-white/10" />
    <div className="h-24 rounded-2xl bg-gray-100 dark:bg-white/10" />
    <div className="h-12 rounded-xl bg-gray-100 dark:bg-white/10" />
  </div>
);

export default ProductInfo;
