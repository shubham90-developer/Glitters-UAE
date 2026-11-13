"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  FiBox,
  FiCheckCircle,
  FiHeart,
  FiShoppingBag,
  FiStar,
  FiXCircle,
} from "react-icons/fi";

import { useAddToCartMutation } from "@/store/addToCartApi";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistByProductMutation,
} from "@/store/wishlistApi";
import { useAuthUser } from "@/hooks/useAuthUser";
import { openAccountMenu } from "@/lib/authPopover";

/* ---------- types ---------- */

type NamedRef = { _id?: string; name?: string };

type Product = {
  _id: string;
  productName?: string;
  brand?: NamedRef | string;
  material?: NamedRef | string;
  variants?: {
    _id?: string;
    image?: string;
    price?: number | string;
    delPrice?: number | string;
    stock?: number | string;
  }[];
  reviews?: { rating?: number | string }[];
};

type ProductCardProps = {
  product: Product;
};

/* ---------- helpers ---------- */

const getRefName = (value?: NamedRef | string): string =>
  typeof value === "object" ? (value?.name ?? "") : (value ?? "");

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatAED = (amount: number): string => `AED ${amount.toLocaleString()}`;

const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max).trim()}...` : text;

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
};

/* ---------- component ---------- */

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const router = useRouter();

  // cart
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // wishlist
  const { data: wishlistItems = [] } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] =
    useRemoveWishlistByProductMutation();

  const { user, authLoading } = useAuthUser();

  // product data
  const variant = product.variants?.[0];

  const name = product.productName || "Product Name";
  const image = variant?.image ?? "";
  const price = Number(variant?.price || 0);
  const oldPrice = Number(variant?.delPrice || 0);
  const stock = Number(variant?.stock || 0);

  const brand = getRefName(product.brand);
  const material = getRefName(product.material);

  const reviews = product.reviews ?? [];
  const rating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";
  const filledStars = Math.round(Number(rating));

  // derived values
  const savingAmount = oldPrice > price ? oldPrice - price : 0;
  const hasSaving = savingAmount > 0;
  const discount = hasSaving ? Math.round((savingAmount / oldPrice) * 100) : 0;

  const inStock = stock > 0;
  const hasImage = Boolean(image.trim()) && !imageError;
  const productHref = `/product/${slugify(name)}/${product._id}`;

  const isWishlisted = wishlistItems.some(
    (item) => item.product._id === product._id,
  );
  const isWishlistBusy = isAddingToWishlist || isRemovingFromWishlist;

  // handlers
  const handleWishlistToggle = async () => {
    if (authLoading) return;

    if (!user) {
      toast.info("Please login to use your wishlist");
      openAccountMenu();
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({ product: product._id }).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Please login to use wishlist"));
    }
  };

  const handleAddToCart = async () => {
    if (!inStock) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      const res = await addToCart({
        product: product._id,
        quantity: 1,
      }).unwrap();
      toast.success(res?.message ?? "Product added to cart", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to add product to cart. Try again."),
      );
    }
  };

  // Buy Now: add this variant to the cart, then go to checkout
  const handleBuyNow = async () => {
    if (!inStock) {
      toast.error("This product is out of stock");
      return;
    }

    setIsBuyingNow(true);

    try {
      await addToCart({
        product: product._id,
        variantId: variant?._id,
        quantity: 1,
      }).unwrap();

      router.push("/checkout");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Unable to continue. Please try again."),
      );
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <article
      className="
        group flex h-full w-full min-w-0 flex-col overflow-hidden
        rounded-xl border border-[#ededed] bg-white
        transition-all duration-300
        hover:border-[#ffe27a] hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)]
        sm:rounded-2xl
        dark:border-gray-800 dark:bg-[#171717]
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f8f8f8] dark:bg-[#202020]">
        {/* Discount */}
        {discount > 0 && (
          <span
            className="
              absolute left-2 top-2 z-20 rounded bg-[#ffd83d]
              px-1.5 py-0.5 text-[8px] font-bold text-black
              sm:left-3 sm:top-3 sm:rounded-md sm:px-2.5 sm:py-1 sm:text-[9px]
            "
          >
            {discount}% OFF
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isWishlistBusy}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`
            absolute right-2 top-2 z-20
            flex h-7 w-7 cursor-pointer items-center justify-center
            rounded-full border border-white bg-white
            shadow-[0_3px_12px_rgba(0,0,0,0.08)]
            transition-all duration-200 hover:scale-105
            disabled:cursor-not-allowed disabled:opacity-60
            sm:right-3 sm:top-3 sm:h-9 sm:w-9
            dark:border-gray-700 dark:bg-[#292929]
            ${isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"}
          `}
        >
          <FiHeart
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Product image */}
        <Link
          href={productHref}
          className="absolute inset-0 flex items-center justify-center"
        >
          {hasImage ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
              onError={() => setImageError(true)}
              className="
                object-contain p-3 transition-transform duration-500
                group-hover:scale-[1.04]
                min-[380px]:p-4 sm:p-5 lg:p-6
              "
            />
          ) : (
            <div
              className="
                flex h-[46%] w-[46%] flex-col items-center justify-center
                rounded-xl border border-[#e5e7eb] bg-[#fafafa] text-[#cbd2dc]
                sm:rounded-2xl
                dark:border-gray-700 dark:bg-[#242424]
              "
            >
              <FiBox className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="mt-1 text-[8px] font-medium sm:mt-2 sm:text-[10px]">
                Product
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">
        {/* Brand + material + stock */}
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
            <span className="min-w-0 max-w-[45%] truncate text-[7px] font-bold uppercase tracking-[0.8px] text-gray-400 sm:text-[9px]">
              {brand || "Brand"}
            </span>

            <span className="shrink-0 text-[7px] text-gray-300 sm:text-[8px]">
              |
            </span>

            <span className="min-w-0 max-w-[45%] truncate text-[7px] font-bold uppercase tracking-[0.8px] text-gray-400 sm:text-[9px]">
              {material || "Material"}
            </span>
          </div>

          <span
            className={`
              flex shrink-0 items-center gap-1 whitespace-nowrap
              text-[7px] font-semibold sm:text-[9px]
              ${inStock ? "text-green-600" : "text-red-500"}
            `}
          >
            {inStock ? (
              <FiCheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            ) : (
              <FiXCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            )}

            <span className="hidden min-[340px]:inline">
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </span>
        </div>

        {/* Product name */}
        <Link href={productHref} className="block min-w-0">
          <h3
            title={name}
            className="
              mt-1.5 line-clamp-2  font-serif text-[10px] font-bold
              leading-4 tracking-wide text-[#202020] hover:text-[#b58b00]
              min-[380px]:text-[11px]
              sm:mt-2 sm:min-h-1 sm:text-[13px] sm:leading-5
              dark:text-white
            "
          >
            {truncate(name, 25)}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-1.5 flex min-w-0 items-center gap-1 sm:gap-1.5">
          <div
            className="
              flex shrink-0 items-center gap-1 rounded bg-[#fff7d5]
              px-1.5 py-0.5 text-[#be9100]
              sm:rounded-md sm:px-2 sm:py-1
            "
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className="h-2.5 w-2.5"
                  fill={star <= filledStars ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-[8px] font-bold sm:text-[9px]">{rating}</span>
          </div>

          <span className="truncate text-[7px] text-black sm:text-[9px] dark:text-gray-300">
            {reviews.length} Reviews
          </span>
        </div>

        {/* Divider */}
        <div className="my-2 border-b border-dashed border-gray-200 sm:my-3 dark:border-gray-700" />

        {/* Price */}
        <div className="mt-auto flex min-w-0 flex-col gap-1.5 sm:gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[7px] text-black sm:text-[9px] dark:text-gray-300">
              Special Price
            </p>

            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2">
              <span
                className="
                  whitespace-nowrap font-serif text-[13px] font-bold text-black
                  min-[380px]:text-[15px] sm:text-[17px]
                  dark:text-white
                "
              >
                {formatAED(price)}
              </span>

              {hasSaving && (
                <span className="whitespace-nowrap font-serif text-[8px] text-gray-400 line-through sm:text-[10px]">
                  {formatAED(oldPrice)}
                </span>
              )}
            </div>
          </div>

          {hasSaving && (
            <span
              className="
                w-fit shrink-0 rounded bg-green-50 px-1.5 py-0.5
                text-[7px] font-bold text-green-600
                min-[380px]:text-[8px]
                sm:rounded-md sm:px-2 sm:py-1 sm:text-[9px]
                dark:bg-green-500/10
              "
            >
              Save {formatAED(savingAmount)}
            </span>
          )}
        </div>

        {/* Buy now + add to cart */}
        <div className="mt-3 flex w-full min-w-0 items-center gap-1.5 sm:mt-4 sm:gap-2.5">
          {/* BUY NOW (plain button so it can shrink) */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            className="
              flex h-9 min-w-0 flex-1 cursor-pointer items-center
              justify-center gap-1 overflow-hidden whitespace-nowrap
              rounded-lg bg-[#ffd83d] px-1 font-serif text-[9px] font-bold
              text-black transition-all duration-200
              hover:bg-[#ffcc00] hover:shadow-[0_6px_18px_rgba(255,216,61,0.28)]
              disabled:cursor-not-allowed disabled:opacity-60
              min-[380px]:px-2 min-[380px]:text-[10px]
              sm:h-11 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-[11px]
            "
          >
            <FiShoppingBag className="hidden h-4 w-4 shrink-0 sm:block" />
            <span className="truncate">
              {isBuyingNow ? "Please wait..." : "Buy Now"}
            </span>
          </button>

          {/* ADD TO CART */}
          <button
            type="button"
            disabled={isAddingToCart}
            onClick={handleAddToCart}
            title="Add to cart"
            aria-label="Add to cart"
            className="
              flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center
              rounded-lg border border-gray-300
              transition-all duration-200
              hover:border-[#ffd83d] hover:bg-[#fff7d5]
              disabled:cursor-not-allowed disabled:opacity-60
              sm:h-11 sm:w-11 sm:rounded-xl
              dark:border-gray-700
            "
          >
            {isAddingToCart ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent sm:h-4 sm:w-4" />
            ) : (
              <FiShoppingBag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
