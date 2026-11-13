/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart, FiStar, FiShoppingBag, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

import { useAddToCartMutation } from "@/store/addToCartApi";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Variant = {
  image?: string;
  price?: number | string;
  delPrice?: number | string;
  stock?: number | string;
};

type Product = {
  _id?: string;
  productName?: string;
  shortDesc?: string;
  status?: string;
  brand?: { name?: string } | string | null;
  material?: { name?: string } | null;
  reviews?: { rating?: number | string }[];
  variants?: Variant[];
};

type ProductCardProps = {
  product: Product;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").trim();

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const ListViewCard = ({ product }: ProductCardProps) => {
  const router = useRouter();

  // api add to cart
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const [imageError, setImageError] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const variant = product?.variants?.[0];

  const id = product?._id;
  const name = product?.productName || "Product Name";
  const description = stripHtml(product?.shortDesc);

  /* ----- brand ----- */
  const brand =
    typeof product?.brand === "object"
      ? (product.brand?.name ?? "")
      : (product?.brand ?? "");

  /* ----- image ----- */
  const image = variant?.image?.trim() ?? "";
  const hasImage = Boolean(image) && !imageError;

  /* ----- price ----- */
  const price = Number(variant?.price || 0);
  const oldPrice = Number(variant?.delPrice || 0);
  const hasSaving = oldPrice > price;
  const savingAmount = hasSaving ? oldPrice - price : 0;
  const discount = hasSaving ? Math.round((savingAmount / oldPrice) * 100) : 0;

  /* ----- stock ----- */
  const stock = Number(variant?.stock || 0);
  const inStock = product?.status !== "inactive" && stock > 0;

  /* ----- rating (number, so comparisons and Math.round work) ----- */
  const reviewList = product?.reviews ?? [];
  const reviewCount = reviewList.length;
  const rating = reviewCount
    ? reviewList.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
      reviewCount
    : 0;

  /* ----- link ----- */
  const productHref = `/product/${slugify(name)}${id ? `/${id}` : ""}`;

  const busy = isAdding || buyingNow;

  /**
   * Adds the product to cart. Returns true on success so "Buy Now"
   * knows whether it can continue to checkout.
   */
  const addProductToCart = async (): Promise<boolean> => {
    if (!id) {
      toast.error("Product not found");
      return false;
    }

    if (!inStock) {
      toast.error("This product is out of stock");
      return false;
    }

    try {
      const res = await addToCart({
        product: id,
        quantity: 1,
      }).unwrap();

      toast.success(res?.message ?? "Product added to cart");
      return true;
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to add product to cart. Try again.",
      );
      return false;
    }
  };

  const handleAddToCart = async () => {
    await addProductToCart();
  };

  /**
   * Buy now = add to cart, then go to checkout
   */
  const handleBuyNow = async () => {
    setBuyingNow(true);
    const added = await addProductToCart();
    setBuyingNow(false);

    if (added) router.push("/checkout");
  };

  return (
    <article className="group relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_3px_16px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-gray-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] sm:p-4 dark:border-gray-800 dark:bg-[#181818]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        {/* PRODUCT IMAGE */}
        <div className="relative flex h-45 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fafafa] sm:h-42.5 sm:w-45 lg:h-47.5 lg:w-52.5 dark:bg-[#202020]">
          {/* Discount */}
          {discount > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-[#ffd83d] px-2 py-1 text-[9px] font-extrabold text-black">
              -{discount}%
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Add to wishlist"
            className="absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm transition hover:text-red-500 dark:border-gray-700 dark:bg-[#181818] dark:text-gray-300"
          >
            <FiHeart size={15} />
          </button>

          {/* Image */}
          <Link
            href={productHref}
            className="relative flex h-full w-full items-center justify-center p-4"
          >
            {hasImage ? (
              <Image
                src={image}
                alt={name}
                width={240}
                height={240}
                onError={() => setImageError(true)}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              />
            ) : (
              <span className="text-[11px] font-medium text-gray-400">
                No image
              </span>
            )}
          </Link>
        </div>

        {/* PRODUCT CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            {/* Brand + Material + Stock */}
            <div className="mb-1.5 flex w-full min-w-0 items-center justify-between gap-2">
              {/* Brand + Material */}
              <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                {brand && (
                  <span className="max-w-[45%] truncate text-[9px] font-bold uppercase tracking-[0.5px] text-gray-400">
                    {brand}
                  </span>
                )}

                {brand && product.material?.name && (
                  <span className="shrink-0 text-[8px] font-bold text-gray-300 dark:text-gray-600">
                    |
                  </span>
                )}

                {product.material?.name && (
                  <span className="max-w-[45%] truncate text-[9px] font-bold uppercase tracking-[0.5px] text-gray-400">
                    {product.material.name}
                  </span>
                )}
              </div>

              {/* Stock */}
              {inStock ? (
                <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[7px] font-semibold text-green-600 min-[380px]:text-[8px] sm:text-[9px] dark:text-green-400">
                  <FiCheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />

                  <span className="hidden min-[340px]:inline">In Stock</span>
                </span>
              ) : (
                <span className="shrink-0 whitespace-nowrap rounded bg-red-50 px-1.5 py-0.5 text-[8px] font-bold text-red-500 sm:text-[9px]">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Name */}
            <Link href={productHref}>
              <h3 className="line-clamp-2 font-serif text-[14px] font-bold leading-5 text-black transition hover:text-[#b58b00] sm:text-[15px] lg:text-[16px] dark:text-white">
                {name}
              </h3>
            </Link>

            {/* Rating */}
            {rating > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      size={12}
                      className={
                        star <= Math.round(rating)
                          ? "fill-[#f4b400] text-[#f4b400]"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                  {rating.toFixed(1)}
                </span>

                <span className="text-[9px] text-gray-400">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="mt-2 hidden max-w-275 text-[10px] leading-4.25 text-gray-500 md:line-clamp-2 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>

          {/* Bottom */}
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
            {/* Price */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-end gap-2">
                <span className="whitespace-nowrap font-serif text-[13px] font-bold text-black min-[380px]:text-[15px] sm:text-[17px] dark:text-white">
                  AED {price.toLocaleString()}
                </span>

                {hasSaving && (
                  <span className="whitespace-nowrap font-serif text-[8px] text-gray-400 line-through sm:text-[10px]">
                    AED {oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {hasSaving && (
                <span className="mt-1.5 inline-flex w-fit rounded bg-green-50 px-1.5 py-0.5 text-[7px] font-bold text-green-600 min-[380px]:text-[8px] sm:rounded-md sm:px-2 sm:py-1 sm:text-[9px] dark:bg-green-500/10">
                  Save AED {savingAmount.toLocaleString()}
                </span>
              )}
            </div>

            {/* Buy now + Add to cart */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={busy || !inStock}
                className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#ffd83d] px-4 font-serif text-[8px] font-bold text-black transition-all duration-200 hover:bg-[#ffcc00] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-[11px]"
              >
                <FiShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {buyingNow ? "Please wait..." : "Buy Now"}
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={busy || !inStock}
                title="Add To Cart"
                aria-label="Add to cart"
                className="flex h-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-3 transition-all duration-200 hover:border-[#ffd83d] hover:bg-[#fff7d5] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:rounded-xl sm:text-[11px] dark:border-gray-700 dark:text-white"
              >
                {isAdding ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent sm:h-4 sm:w-4" />
                ) : (
                  <FiShoppingBag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ListViewCard;
