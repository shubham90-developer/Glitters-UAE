/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRightCircle,
  FiBox,
  FiCheck,
  FiChevronLeft,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { toast } from "react-toastify";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import {
  IAddToCart,
  useClearCartMutation,
  useDeleteCartMutation,
  useGetAddToCartQuery,
  useUpdateCartMutation,
} from "@/store/addToCartApi";
import CouponsList from "./CouponsList";
import { getProductName } from "./Coupon";
import { useCartCoupon } from "./Usecartcoupon";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 25;

type CartItem = {
  id: string; // cart item _id
  productId: string;
  name: string;
  brand: string;
  material: string;
  image: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  stock: number;
  color?: string;
  colorCode?: string;
  size?: string;
  href: string;
};

/** Reads a label from a populated object; returns "" for plain ObjectId strings. */
const getLabel = (value: any, keys: string[] = ["name"]): string => {
  if (!value || typeof value !== "object") return "";
  for (const key of keys) {
    if (value[key]) return String(value[key]);
  }
  return "";
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapCartItem = (cart: IAddToCart): CartItem | null => {
  const product: any = cart?.product;

  // product deleted or not populated
  if (!product || typeof product !== "object") return null;

  const variant = product.variants?.[0];
  const name: string = product.productName || "Product";

  return {
    id: cart._id,
    productId: String(product._id),
    name,
    brand: getLabel(product.brand),
    material: getLabel(product.material),
    image: variant?.image || "",
    price: Number(variant?.price || 0),
    oldPrice: Number(variant?.delPrice || 0) || undefined,
    quantity: cart.quantity || 1,
    stock: Number(variant?.stock || 0),
    color: getLabel(variant?.color, ["colorName", "name"]) || undefined,
    colorCode: getLabel(variant?.color, ["hexCode"]) || undefined,
    size: getLabel(variant?.size, ["size", "name"]) || undefined,
    href: `/product/${slugify(name)}/${product._id}`,
  };
};

const pillBase =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[8px] font-semibold sm:text-[9px]";
const qtyBtn =
  "flex h-full w-8 cursor-pointer items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-9 dark:hover:bg-[#292929] dark:hover:text-white";

const BENEFITS = [
  { icon: FiTruck, title: "Fast Delivery", text: "Quick & secure shipping" },
  { icon: FiShield, title: "Secure Payment", text: "Protected checkout" },
  {
    icon: FiShoppingBag,
    title: "Original Products",
    text: "100% genuine items",
  },
];

const Cart = () => {
  const { data: cartData = [], isLoading, isError } = useGetAddToCartQuery();
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const cartItems = useMemo(
    () =>
      cartData
        .map(mapCartItem)
        .filter((item): item is CartItem => item !== null),
    [cartData],
  );

  const {
    code,
    changeCode,
    applyCode,
    applyCoupon,
    removeCoupon,
    activeCoupon,
    feedback,
    discount,
    setAvailableCoupons,
  } = useCartCoupon(cartItems);

  const busy = isUpdating || isDeleting || isClearing;

  const { subtotal, totalItems } = useMemo(
    () => ({
      subtotal: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalItems: cartItems.reduce((sum, i) => sum + i.quantity, 0),
    }),
    [cartItems],
  );

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal + shipping - discount);

  const updateQuantity = async (
    item: CartItem,
    type: "increase" | "decrease",
  ) => {
    const nextQuantity =
      type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    if (nextQuantity === item.quantity) return;

    if (type === "increase" && item.stock > 0 && nextQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }

    try {
      await updateCart({ id: item.id, quantity: nextQuantity }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (id: string) => {
    try {
      const res = await deleteCart(id).unwrap();
      toast.success(res?.message || "Item removed from cart");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await clearCart().unwrap();
      toast.success(res?.message || "Cart cleared");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to clear cart");
    }
  };

  return (
    <main className="min-h-screen py-4 sm:py-6 lg:py-8 dark:bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8 xl:px-10">
        {/* HEADER */}
        <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <h1 className="font-serif text-[20px] font-extrabold text-black sm:text-[24px] lg:text-[28px] dark:text-white">
              Shopping Cart
            </h1>
            <p className="mt-1 text-[10px] text-gray-500 sm:text-[11px] dark:text-gray-400">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            {cartItems.length > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={handleClearCart}
                className="cursor-pointer text-[10px] font-bold text-rose-500 transition hover:text-rose-600 disabled:opacity-60 sm:text-[11px]"
              >
                Clear Cart
              </button>
            )}

            <Link
              href="/products"
              className="flex items-center gap-1 text-[10px] font-bold text-black transition hover:text-[#b58b00] sm:text-[11px] dark:text-white dark:hover:text-[#ffd83d]"
            >
              <FiChevronLeft size={14} />
              Continue Shopping
            </Link>
          </div>
        </div>

        {isLoading ? (
          /* LOADING */
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-[#181818]"
              />
            ))}
          </div>
        ) : isError ? (
          /* ERROR */
          <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-4 text-center dark:border-gray-800 dark:bg-[#181818]">
            <h2 className="font-serif text-[18px] font-extrabold text-black dark:text-white">
              Could not load your cart
            </h2>
            <p className="mt-1 max-w-[320px] text-[10px] leading-4 text-gray-400">
              Check your connection and refresh the page.
            </p>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
            {/* LEFT */}
            <div className="min-w-0">
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const hasImage =
                    Boolean(item.image?.trim()) && !imageErrors[item.id];

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_4px_18px_rgba(0,0,0,0.04)] sm:p-4 dark:border-gray-800 dark:bg-[#181818]"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* IMAGE */}
                        <Link
                          href={item.href}
                          className="relative flex h-26.25 w-23.75 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f8f8f8] p-2 sm:h-32.5 sm:w-31.25 lg:h-36.25 lg:w-35 dark:bg-[#222]"
                        >
                          {hasImage ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={160}
                              height={160}
                              onError={() =>
                                setImageErrors((prev) => ({
                                  ...prev,
                                  [item.id]: true,
                                }))
                              }
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <FiBox className="h-8 w-8 text-[#cbd2dc]" />
                          )}
                        </Link>

                        {/* CONTENT */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          {item.brand && (
                            <p className="text-[8px] font-bold uppercase tracking-[0.7px] text-gray-400 sm:text-[9px]">
                              {item.brand}
                            </p>
                          )}

                          <Link href={item.href}>
                            <h2 className="mt-1 line-clamp-2 font-serif text-[11px] font-bold leading-4 text-black transition hover:text-[#b58b00] sm:text-[14px] sm:leading-5 dark:text-white">
                              {item.name}
                            </h2>
                          </Link>

                          {/* ATTRIBUTES */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {item.material && (
                              <span
                                className={`${pillBase} border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-[#202020] dark:text-gray-300`}
                              >
                                Material: {item.material}
                              </span>
                            )}

                            {item.color && (
                              <span
                                className={`${pillBase} gap-1.5 border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-[#202020] dark:text-gray-300`}
                              >
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full border border-black/10"
                                  style={{
                                    backgroundColor:
                                      item.colorCode || item.color,
                                  }}
                                />
                                {item.color}
                              </span>
                            )}

                            {item.size && (
                              <span
                                className={`${pillBase} border-[#ffe177] bg-[#fff9df] font-bold text-[#8c6b00] dark:border-[#6b5813] dark:bg-[#29240f] dark:text-[#ffd83d]`}
                              >
                                Size: {item.size}
                              </span>
                            )}

                            {item.stock <= 0 && (
                              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[8px] font-bold text-red-500 sm:text-[9px]">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          {/* PRICE / QTY */}
                          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
                            <div>
                              <div className="flex flex-wrap items-baseline gap-1.5">
                                <span className="font-serif text-[14px] font-extrabold text-black sm:text-[17px] dark:text-white">
                                  AED {item.price.toLocaleString()}
                                </span>

                                {item.oldPrice &&
                                  item.oldPrice > item.price && (
                                    <span className="text-[8px] text-gray-400 line-through sm:text-[9px]">
                                      AED {item.oldPrice.toLocaleString()}
                                    </span>
                                  )}
                              </div>

                              {item.quantity > 1 && (
                                <p className="mt-0.5 text-[8px] text-gray-400">
                                  Total: AED {itemTotal.toLocaleString()}
                                </p>
                              )}
                            </div>

                            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-10 dark:border-gray-700 dark:bg-[#202020]">
                              <button
                                type="button"
                                disabled={busy || item.quantity <= 1}
                                onClick={() => updateQuantity(item, "decrease")}
                                aria-label="Decrease quantity"
                                className={qtyBtn}
                              >
                                <FiMinus size={12} />
                              </button>

                              <span className="flex h-full min-w-8 items-center justify-center border-x border-gray-200 px-1 text-[10px] font-bold text-black sm:min-w-9 dark:border-gray-700 dark:text-white">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => updateQuantity(item, "increase")}
                                aria-label="Increase quantity"
                                className={qtyBtn}
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                          </div>

                          {/* ACTIONS */}
                          <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                            <Link
                              href="/wishlist"
                              className="flex cursor-pointer items-center gap-1 text-[8px] font-semibold text-gray-500 transition hover:text-red-500 sm:text-[9px]"
                            >
                              <FiHeart size={12} />
                              Save for later
                            </Link>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => removeItem(item.id)}
                              className="flex cursor-pointer items-center gap-1 rounded-full bg-rose-400 px-2 py-1 text-[8px] font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[9px]"
                            >
                              <FiTrash2 size={12} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* BENEFITS */}
              <div className="mt-4 hidden grid-cols-3 gap-3 md:grid">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-[#181818]"
                  >
                    <Icon className="shrink-0 text-[#b58b00]" />
                    <div>
                      <p className="font-serif text-[12px] font-bold text-black dark:text-white">
                        {title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-gray-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <aside className="min-w-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_5px_24px_rgba(0,0,0,0.05)] sm:p-5 lg:sticky lg:top-27.5 dark:border-gray-800 dark:bg-[#181818]">
                <h2 className="font-serif text-[16px] font-extrabold text-black sm:text-[18px] dark:text-white">
                  Order Summary
                </h2>

                {/* COUPON INPUT */}
                <div className="mt-4">
                  <label
                    htmlFor="coupon-input"
                    className="mb-1.5 block text-[9px] font-bold text-gray-600 dark:text-gray-300"
                  >
                    Have a coupon?
                  </label>

                  <div className="flex h-10 overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#ffd83d] dark:border-gray-700">
                    <div className="flex min-w-0 flex-1 items-center">
                      <FiTag
                        className="ml-3 shrink-0 text-gray-400"
                        size={14}
                      />
                      <input
                        id="coupon-input"
                        type="text"
                        value={code}
                        onChange={(e) => changeCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyCode();
                          }
                        }}
                        placeholder="Enter coupon code"
                        className="h-full min-w-0 flex-1 bg-transparent px-2 text-[10px] text-black outline-none placeholder:text-gray-400 dark:text-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={applyCode}
                      className="shrink-0 bg-[#ffd83d] px-3 text-[9px] font-bold text-black hover:bg-[#ffcf12]"
                    >
                      Apply
                    </button>
                  </div>

                  {feedback && (
                    <p
                      className={`mt-2 text-[10px] ${
                        feedback.isError ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {feedback.text}
                    </p>
                  )}

                  {activeCoupon && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 p-2 dark:bg-green-500/10">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold text-green-700 dark:text-green-400">
                          <FiCheck className="mr-1 inline" />
                          {activeCoupon.coupon.couponCode}
                        </p>
                        <p className="text-[9px] text-green-600">
                          {getProductName(activeCoupon.product)} ·{" "}
                          {activeCoupon.coupon.couponAmount}% OFF
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="ml-2 text-[10px] font-bold text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* PRODUCT COUPONS */}
                <div className="mt-5">
                  <CouponsList
                    onApply={applyCoupon}
                    onCouponsLoaded={setAvailableCoupons}
                    selectedCouponCode={activeCoupon?.coupon.couponCode || ""}
                  />
                </div>

                {/* BREAKDOWN */}
                <dl className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-[10px] text-gray-600 dark:border-gray-800 dark:text-gray-300">
                  <div className="flex justify-between">
                    <dt className="text-gray-900 text-sm font-semibold">
                      Subtotal
                    </dt>
                    <dd className="text-gray-900 text-sm font-semibold">
                      AED {subtotal.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-900 text-sm font-semibold">
                      Shipping
                    </dt>
                    <dd className="text-gray-900 text-sm font-semibold">
                      {shipping === 0 ? "Free" : `AED ${shipping}`}
                    </dd>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <dt className="text-gray-900 text-sm font-semibold">
                        Coupon discount
                      </dt>
                      <dd className="text-green-900 text-sm font-semibold">
                        - AED {discount.toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>

                {/* TOTAL */}
                <div className="flex items-end justify-between py-4">
                  <div>
                    <p className="text-[16px] font-bold text-black dark:text-white">
                      Total
                    </p>
                    <p className="mt-0.5 text-[8px] text-gray-900 dark:text-gray-400">
                      Inclusive of VAT
                    </p>
                  </div>

                  <span className="font-serif text-[20px] font-extrabold text-black dark:text-white">
                    AED {total.toLocaleString()}
                  </span>
                </div>

                {/* CHECKOUT */}
                <ThemeBtnOne
                  text="Proceed to Checkout"
                  url="/checkout"
                  icon={<FiArrowRightCircle />}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ffd83d] text-[11px] font-extrabold text-black transition-all hover:bg-[#ffcf12] hover:shadow-[0_6px_18px_rgba(255,216,61,0.28)] active:scale-[0.99] sm:h-12"
                />

                <p className="mt-3 text-center text-[8px] leading-4 text-gray-400">
                  Secure checkout. Your payment information is protected.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          /* EMPTY CART */
          <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-4 text-center dark:border-gray-800 dark:bg-[#181818]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d1] text-black">
              <FiShoppingBag size={26} />
            </div>

            <h2 className="mt-4 font-serif text-[18px] font-extrabold text-black dark:text-white">
              Your cart is empty
            </h2>

            <p className="mt-1 max-w-[320px] text-[10px] leading-4 text-gray-400">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>

            <Link
              href="/products"
              className="mt-5 flex h-10 items-center justify-center rounded-xl bg-[#ffd83d] px-5 text-[10px] font-extrabold text-black"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
