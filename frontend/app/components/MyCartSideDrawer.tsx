/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

import {
  FiShoppingBag,
  FiX,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiPackage,
  FiTruck,
  FiShield,
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
import ThemeBtnOne from "./ThemeBtnOne";
import {
  useGetAddToCartQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  IAddToCart,
} from "@/store/addToCartApi";

/* ---------- same mapping as the /cart page ---------- */

type CartItem = {
  id: string; // cart item _id
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  color?: string;
  colorCode?: string;
  size?: string;
  href: string;
};

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 25;

const getLabel = (value: any, keys: string[] = ["name"]): string => {
  if (!value || typeof value !== "object") return "";
  for (const key of keys) {
    if (value[key]) return String(value[key]);
  }
  return "";
};

const mapCartItem = (cart: IAddToCart): CartItem | null => {
  const product: any = cart?.product;
  if (!product || typeof product !== "object") return null;

  const variant = product?.variants?.[0];
  const name: string = product?.productName || "Product";

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    id: cart._id,
    productId: product._id,
    name,
    image: variant?.image || "",
    price: Number(variant?.price || 0),
    quantity: cart.quantity || 1,
    stock: Number(variant?.stock || 0),
    color: getLabel(variant?.color, ["colorName", "name"]) || undefined,
    colorCode:
      getLabel(variant?.color, ["colorCode", "hexCode", "hex", "code"]) ||
      undefined,
    size: getLabel(variant?.size, ["size", "name"]) || undefined,
    href: `/product/${slug}/${product._id}`,
  };
};

const MyCartSideDrawer = () => {
  const [open, setOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // apis
  const { data: cartData = [], isLoading, isError } = useGetAddToCartQuery();
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation();

  const busy = isUpdating || isDeleting;

  const cartItems = useMemo(
    () =>
      cartData
        .map(mapCartItem)
        .filter((item): item is CartItem => item !== null),
    [cartData],
  );

  const totalQty = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const discount = 0;

  /* lock body scroll + close on Escape while drawer is open */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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

  const closeDrawer = () => setOpen(false);

  return (
    <>
      {/* CART HEADER BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        className="
          group flex min-h-10.5 items-center gap-2.5 cursor-pointer
          text-left text-[#202020]
          transition-all
          hover:text-[#d8a900]
          dark:text-white
        "
      >
        <div className="relative">
          <FiShoppingBag
            size={27}
            strokeWidth={1.6}
            className="transition-transform duration-200 group-hover:scale-105"
          />

          <span
            className="
              absolute -right-2.5 -top-2
              flex h-4.5 min-w-4.5
              items-center justify-center
              rounded-full
              bg-[#ffd83d]
              px-1
              text-[9px] font-bold text-black
              shadow-sm
            "
          >
            {totalQty}
          </span>
        </div>

        <div className="leading-tight">
          <p className="text-[11px] font-bold">My Cart</p>

          <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
            AED {subtotal + shipping - discount}
          </p>
        </div>
      </button>

      {/* OVERLAY */}
      <div
        onClick={closeDrawer}
        className={`
          fixed inset-0 z-9998
          bg-black/25 backdrop-blur-[2px]
          transition-all duration-300
          ${
            open
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }
        `}
      />

      {/* DRAWER */}
      <aside
        aria-hidden={!open}
        className={`
          fixed right-0 top-0 z-9999
          flex h-dvh w-full max-w-115
          flex-col
          bg-[#ffffff]
          shadow-[-16px_0_45px_rgba(0,0,0,0.08)]
          transition-transform duration-300 ease-out
          dark:bg-[#111]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div
          className="
            relative flex min-h-20.5
            shrink-0 items-center
            justify-between
            overflow-hidden
            border-b border-[#eeeeee]
            bg-linear-to-r
            from-[#fffdf3]
            via-white
            to-[#fff9df]
            px-6
            dark:border-gray-800
            dark:from-[#161616]
            dark:via-[#111]
            dark:to-[#181818]
          "
        >
          <FiShoppingBag
            className="
              pointer-events-none
              absolute -bottom-7 -right-3
              text-[#ffd83d]/15
              dark:text-white/5
            "
            size={110}
            strokeWidth={1}
          />

          <div className="relative z-10 flex items-center gap-3">
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                bg-[#fff4bc]
                text-[#bd8f00]
                dark:bg-[#25200e]
                dark:text-[#ffd83d]
              "
            >
              <FiShoppingBag size={21} />
            </div>

            <div>
              <h2 className="text-[16px] font-bold text-[#181818] dark:text-white">
                Shopping Cart
              </h2>

              <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                {totalQty} {totalQty === 1 ? "item" : "items"} added
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="
              relative z-10
              flex h-9 w-9
              cursor-pointer
              items-center justify-center
              rounded-full
              border border-gray-200
              bg-white
              text-gray-600
              shadow-sm
              transition-all
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-500
              dark:border-gray-700
              dark:bg-[#1d1d1d]
              dark:text-white
            "
          >
            <FiX size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-[#fcfcfc] px-5 py-4 dark:bg-[#111]">
          {isLoading ? (
            /* LOADING */
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-31 animate-pulse rounded-2xl border border-[#eeeeee] bg-gray-100 dark:border-gray-800 dark:bg-[#181818]"
                />
              ))}
            </div>
          ) : isError ? (
            /* ERROR */
            <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
              <h3 className="text-[17px] font-bold text-[#222] dark:text-white">
                Could not load your cart
              </h3>
              <p className="mt-2 max-w-62.5 text-[11px] leading-5 text-gray-500">
                Check your connection and try again.
              </p>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const hasImage =
                  Boolean(item.image?.trim()) && !imageErrors[item.id];

                return (
                  <div
                    key={item.id}
                    className="
                      rounded-2xl
                      border border-[#eeeeee]
                      bg-white
                      p-3.5
                      shadow-[0_3px_15px_rgba(0,0,0,0.025)]
                      transition
                      hover:border-[#eadb95]
                      hover:shadow-[0_5px_20px_rgba(0,0,0,0.045)]
                      dark:border-gray-800
                      dark:bg-[#171717]
                    "
                  >
                    <div className="flex gap-3.5">
                      {/* PRODUCT IMAGE */}
                      <Link
                        href={item.href}
                        onClick={closeDrawer}
                        className="
                          flex h-26.25 w-23
                          shrink-0 items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          border border-[#eeeeee]
                          bg-[#f8f8f8]
                          p-1.5
                          dark:border-gray-800
                          dark:bg-[#202020]
                        "
                      >
                        {hasImage ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={92}
                            height={105}
                            onError={() =>
                              setImageErrors((prev) => ({
                                ...prev,
                                [item.id]: true,
                              }))
                            }
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-gray-300 dark:text-gray-600">
                            <FiBox size={32} strokeWidth={1.3} />
                            <span className="text-[9px]">Product</span>
                          </div>
                        )}
                      </Link>

                      {/* PRODUCT DETAILS */}
                      <div className="min-w-0 flex-1">
                        {/* NAME + PRICE */}
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={item.href}
                            onClick={closeDrawer}
                            className="flex-1"
                          >
                            <h3
                              className="
                                line-clamp-2
                                text-[13px] font-bold
                                leading-4.75
                                text-[#222]
                                transition hover:text-[#b58b00]
                                dark:text-white
                              "
                            >
                              {item.name}
                            </h3>
                          </Link>

                          <div className="shrink-0 text-right">
                            <p className="text-[13px] font-bold text-[#111] dark:text-white">
                              AED{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </p>

                            {item.quantity > 1 && (
                              <p className="mt-0.5 text-[9px] font-semibold text-black dark:text-gray-400">
                                AED {item.price.toLocaleString()} each
                              </p>
                            )}
                          </div>
                        </div>

                        {/* VARIANTS */}
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {item.size && (
                            <div
                              className="
                                flex items-center gap-1.5
                                rounded-lg
                                border border-[#eeeeee]
                                bg-[#fafafa]
                                px-2 py-1.5
                                text-[10px]
                                text-gray-600
                                dark:border-gray-700
                                dark:bg-[#202020]
                                dark:text-gray-300
                              "
                            >
                              <FiPackage size={11} />
                              <span>
                                Size:
                                <strong className="ml-1 font-semibold text-[#333] dark:text-white">
                                  {item.size}
                                </strong>
                              </span>
                            </div>
                          )}

                          {item.color && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[8px] font-semibold text-gray-600 sm:text-[9px] dark:border-gray-700 dark:bg-[#202020] dark:text-gray-300">
                              <span
                                className="h-2 w-2 shrink-0 rounded-full border border-black/10"
                                style={{
                                  backgroundColor:
                                    typeof item.color === "string"
                                      ? item.color
                                      : item.color || "#000000",
                                }}
                              />

                              {typeof item.color === "string"
                                ? item.color
                                : item.color || ""}
                            </span>
                          )}

                          {item.stock <= 0 && (
                            <span className="inline-flex items-center rounded-lg bg-red-50 px-2 py-1.5 text-[10px] font-bold text-red-500">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* QTY & DELETE */}
                        <div className="mt-3.5 flex items-center justify-between">
                          {/* QTY */}
                          <div
                            className="
                              flex h-8
                              items-center
                              overflow-hidden
                              rounded-lg
                              border border-[#e5e5e5]
                              bg-white
                              dark:border-gray-700
                              dark:bg-[#1c1c1c]
                            "
                          >
                            <button
                              type="button"
                              disabled={busy || item.quantity <= 1}
                              onClick={() => updateQuantity(item, "decrease")}
                              aria-label="Decrease quantity"
                              className="
                                flex h-full w-8
                                cursor-pointer
                                items-center justify-center
                                text-gray-500
                                transition
                                hover:bg-[#fff8db]
                                hover:text-black
                                disabled:cursor-not-allowed disabled:opacity-40
                                dark:hover:bg-[#292929]
                              "
                            >
                              <FiMinus size={11} />
                            </button>

                            <span
                              className="
                                flex h-full min-w-9
                                items-center justify-center
                                border-x border-[#e5e5e5]
                                text-[11px] font-bold
                                text-[#222]
                                dark:border-gray-700
                                dark:text-white
                              "
                            >
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => updateQuantity(item, "increase")}
                              aria-label="Increase quantity"
                              className="
                                flex h-full w-8
                                cursor-pointer
                                items-center justify-center
                                text-gray-500
                                transition
                                hover:bg-[#fff8db]
                                hover:text-black
                                disabled:cursor-not-allowed disabled:opacity-40
                                dark:hover:bg-[#292929]
                              "
                            >
                              <FiPlus size={11} />
                            </button>
                          </div>

                          {/* REMOVE */}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove product"
                            className="
                              flex h-8 w-8
                              cursor-pointer
                              items-center justify-center
                              rounded-lg
                              bg-[#fff2f2]
                              text-[#e26a6a]
                              transition-all
                              hover:bg-[#ffe2e2]
                              hover:text-red-600
                              disabled:cursor-not-allowed disabled:opacity-60
                              dark:bg-red-500/10
                              dark:text-red-400
                            "
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* SHIPPING INFO (real, based on subtotal) */}
              <div
                className="
                  mt-4 flex items-center
                  gap-3 rounded-xl
                  border border-[#e8f4ec]
                  bg-[#f5fbf7]
                  p-3
                  dark:border-green-900/30
                  dark:bg-green-900/10
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    shrink-0 items-center
                    justify-center
                    rounded-full
                    bg-[#e6f6eb]
                    text-[#4b9b65]
                    dark:bg-green-500/10
                    dark:text-green-400
                  "
                >
                  <FiTruck size={17} />
                </div>

                <div>
                  {shipping === 0 ? (
                    <>
                      <p className="text-[11px] font-bold text-[#345d41] dark:text-green-300">
                        Free Shipping Unlocked
                      </p>
                      <p className="mt-0.5 text-[9px] text-[#71917b] dark:text-gray-400">
                        Your order qualifies for free delivery
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] font-bold text-[#345d41] dark:text-green-300">
                        Add AED {remainingForFree.toLocaleString()} more for
                        free shipping
                      </p>
                      <p className="mt-0.5 text-[9px] text-[#71917b] dark:text-gray-400">
                        Free delivery on orders over AED{" "}
                        {FREE_SHIPPING_THRESHOLD}
                      </p>
                    </>
                  )}
                </div>

                {shipping === 0 && (
                  <FiCheckCircle
                    size={17}
                    className="ml-auto shrink-0 text-[#5ba874]"
                  />
                )}
              </div>
            </div>
          ) : (
            /* EMPTY CART */
            <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
              <div className="relative">
                <div
                  className="
                    absolute inset-0
                    scale-125 rounded-full
                    bg-[#fff8d7]
                    blur-xl
                    dark:bg-yellow-500/5
                  "
                />

                <div
                  className="
                    relative flex h-24 w-24
                    items-center justify-center
                    rounded-full
                    bg-[#fff9df]
                    text-[#d3ad20]
                    dark:bg-[#201d12]
                    dark:text-yellow-400
                  "
                >
                  <FiShoppingBag size={40} strokeWidth={1.2} />
                </div>
              </div>

              <h3 className="mt-7 text-[17px] font-bold text-[#222] dark:text-white">
                Your cart is empty
              </h3>

              <p className="mt-2 max-w-62.5 text-[11px] leading-5 text-gray-500">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>

              <ThemeBtnOne
                url="/product-list"
                text="  Start Shopping"
                onClick={closeDrawer}
                className="
                  mt-6 flex h-10
                  items-center gap-2
                  rounded-lg
                  bg-[#ffd83d]
                  px-5
                  text-[11px] font-bold
                  text-black
                  transition
                  hover:bg-[#f6c900]
                "
                icon={<FiArrowRight size={14} />}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isLoading && !isError && cartItems.length > 0 && (
          <div
            className="
              shrink-0
              border-t border-[#eeeeee]
              bg-white
              px-5 pb-5 pt-4
              dark:border-gray-800
              dark:bg-[#151515]
            "
          >
            {/* PRICE SUMMARY */}
            <div className="rounded-xl bg-[#fafafa] p-3.5 dark:bg-[#1d1d1d]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold dark:text-gray-200">
                  Items
                </span>

                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                  {totalQty}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold dark:text-gray-200">
                  Shipping
                </span>

                {shipping === 0 ? (
                  <span className="text-[10px] font-bold text-green-600">
                    FREE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-black dark:text-white">
                    AED {shipping}
                  </span>
                )}
              </div>

              <div className="my-3 h-px bg-gray-200 dark:bg-gray-700" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="font-serif text-[13px] font-bold tracking-wider text-[#222] dark:text-white">
                    Subtotal
                  </p>

                  <p className="mt-0.5 text-[9px] text-black dark:text-gray-400">
                    VAT calculated at checkout
                  </p>
                </div>

                <p className="font-serif text-[18px] font-bold tracking-wider text-[#111] dark:text-white">
                  AED {subtotal + shipping - discount}
                </p>
              </div>
            </div>

            {/* CHECKOUT */}
            <ThemeBtnOne
              text="Proceed to Checkout"
              url="/checkout"
              icon={<FiArrowRightCircle size={16} />}
              className="
                group mt-4
                flex h-12 w-full
                items-center justify-center
                gap-2 rounded-xl
                bg-[#ffd83d]
                text-[11px] font-bold
                capitalize
                text-black
                shadow-[0_5px_15px_rgba(255,216,61,0.22)]
                transition font-serif
                hover:bg-[#f8cb00]
              "
            />

            {/* VIEW CART */}
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="
                mt-2.5 flex h-11 w-full
                items-center justify-center
                rounded-xl
                border border-[#e5e5e5]
                bg-white
                text-[11px] font-bold
                text-[#333]
                transition
                hover:border-gray-300
                hover:bg-[#fafafa]
                dark:border-gray-700
                dark:bg-[#1b1b1b]
                dark:text-white font-serif tracking-wider
              "
            >
              View Shopping Cart
            </Link>

            {/* SECURE CHECKOUT */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] tracking-wider dark:text-gray-400">
              <FiShield size={12} />
              Secure & protected checkout
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default MyCartSideDrawer;
