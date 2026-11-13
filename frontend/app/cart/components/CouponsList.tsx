"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiPercent, FiLock, FiCheck, FiCopy, FiPackage } from "react-icons/fi";
import { useGetProductsQuery } from "@/store/productsApi";
import {
  Coupon,
  Product,
  ProductCoupon,
  getProductId,
  getProductName,
  isCouponUsable,
} from "./Coupon";

type CouponsListProps = {
  onApply?: (coupon: Coupon, product: Product) => void;
  onCouponsLoaded?: (coupons: ProductCoupon[]) => void;
  selectedCouponCode?: string;
};

const normalizeProducts = (data: any): Product[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

const getCouponForProduct = (product: Product): Coupon | null => {
  const productId = getProductId(product);
  const belongsToProduct = (coupon: Coupon) =>
    !coupon.productId || String(coupon.productId) === productId;

  if (product.coupon) {
    return belongsToProduct(product.coupon)
      ? { ...product.coupon, productId }
      : null;
  }

  const fromList = product.coupons?.find(belongsToProduct);
  if (fromList) return { ...fromList, productId };

  if (product.couponCode && product.couponAmount != null) {
    return {
      _id: `${productId}-coupon`,
      productId,
      couponName: product.couponName || "Product Discount",
      subTitle: product.subTitle || "",
      couponCode: product.couponCode,
      couponAmount: product.couponAmount,
      status: product.status || "active",
      eligible: product.eligible,
    };
  }

  return null;
};

const getCouponKey = (coupon: Coupon, product: Product) =>
  `${getProductId(product)}-${coupon._id || coupon.couponCode}`;

const getGap = (slider: HTMLElement) =>
  parseFloat(window.getComputedStyle(slider).columnGap || "10") || 10;

const CouponsList = ({
  onApply,
  onCouponsLoaded,
  selectedCouponCode = "",
}: CouponsListProps) => {
  const { data, isLoading, isError } = useGetProductsQuery();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const productCoupons = useMemo<ProductCoupon[]>(
    () =>
      normalizeProducts(data).flatMap((product) => {
        const coupon = getCouponForProduct(product);
        return coupon ? [{ product, coupon }] : [];
      }),
    [data],
  );

  useEffect(() => {
    onCouponsLoaded?.(productCoupons);
  }, [productCoupons, onCouponsLoaded]);

  const scrollToCoupon = useCallback((index: number) => {
    const slider = sliderRef.current;
    const card = slider?.firstElementChild as HTMLElement | null;
    if (!slider || !card) return;

    slider.scrollTo({
      left: index * (card.offsetWidth + getGap(slider)),
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  const handleScroll = () => {
    const slider = sliderRef.current;
    const card = slider?.firstElementChild as HTMLElement | null;
    if (!slider || !card) return;

    const index = Math.round(
      slider.scrollLeft / (card.offsetWidth + getGap(slider)),
    );
    setActiveIndex(Math.max(0, Math.min(index, productCoupons.length - 1)));
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      // Clipboard access may be unavailable in some browsers.
    }
  };

  if (isLoading) {
    return (
      <section className="w-full">
        <h2 className="mb-3 text-sm font-bold text-black dark:text-white">
          Product Coupons
        </h2>
        <div className="flex gap-2.5 overflow-hidden">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-36 min-w-65 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-[#181818]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Unable to load products. Please try again later.
      </section>
    );
  }

  if (!productCoupons.length) {
    return (
      <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="text-sm font-bold text-black dark:text-white">
          Product Coupons
        </h2>
        <p className="mt-2 text-xs text-gray-500">
          No product-specific coupons found.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-[14px] font-extrabold tracking-wide text-black sm:text-[15px] dark:text-white">
            Product Coupons
          </h2>
          <p className="mt-0.5 text-[8px] text-gray-900 sm:text-[10px]">
            Exclusive offers for your products
          </p>
        </div>

        <span className="rounded-full bg-[#fff8d7] px-2 py-1 text-[8px] font-bold text-[#8a6b00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
          {productCoupons.length} Offers
        </span>
      </div>

      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex w-full snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1"
      >
        {productCoupons.map(({ product, coupon }) => {
          const eligible = isCouponUsable(coupon);
          const applied =
            Boolean(selectedCouponCode) &&
            selectedCouponCode.toUpperCase() ===
              (coupon.couponCode || "").toUpperCase();
          const copied = copiedCode === coupon.couponCode;

          return (
            <article
              key={getCouponKey(coupon, product)}
              className="relative min-w-65 snap-start overflow-hidden rounded-xl border border-gray-200 bg-white p-3 transition-all min-[390px]:min-w-70 sm:min-w-75 md:min-w-78.75 lg:min-w-[320px] xl:min-w-82.5 dark:border-gray-700 dark:bg-[#181818]"
            >
              <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-gray-200 bg-[#f7f7f8] dark:border-gray-700 dark:bg-[#0f0f0f]" />
              <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-gray-200 bg-[#f7f7f8] dark:border-gray-700 dark:bg-[#0f0f0f]" />

              <div className="mb-3 flex items-center gap-2 border-b border-dashed border-gray-200 pb-2 dark:border-gray-700">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#181878]">
                  <FiPackage size={13} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-gray-900">Coupon for</p>
                  <h3 className="truncate text-[11px] font-bold text-black dark:text-white">
                    {getProductName(product)}
                  </h3>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffd83d] text-black">
                    <FiPercent size={13} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-serif text-[11px] font-bold text-black sm:text-[12px] dark:text-white">
                      {coupon.couponName || "Special Discount"}
                    </h4>
                    <p className="mt-1 line-clamp-2 min-h-4 text-[8px] leading-3.5 text-gray-900 sm:text-[10px] dark:text-gray-400">
                      {coupon.subTitle || ""}
                    </p>
                  </div>
                </div>

                {!eligible && (
                  <FiLock size={12} className="mt-1 shrink-0 text-gray-400" />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 dark:text-gray-900">
                  Your discount
                </span>
                <span className="rounded-md bg-[#fff8d7] px-2 py-1 text-[10px] font-extrabold text-[#8a6b00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
                  {coupon.couponAmount}% OFF
                </span>
              </div>

              <div className="mt-2">
                <span
                  className={`rounded-full px-2 py-1 text-[8px] font-bold ${
                    eligible
                      ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {eligible ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-gray-200 pt-2.5 dark:border-gray-700">
                <button
                  type="button"
                  disabled={!coupon.couponCode}
                  onClick={() => handleCopy(coupon.couponCode!)}
                  className="flex min-w-0 max-w-37.5 items-center gap-1.5 rounded-lg border border-dashed border-[#e3c437] bg-[#fff9dd] px-2 py-1.5 font-mono text-[8px] font-bold tracking-[0.5px] text-[#7a6100] disabled:opacity-50 dark:bg-[#2b260f] dark:text-[#ffd83d]"
                >
                  <span className="truncate">
                    {copied ? "COPIED" : coupon.couponCode || "NO CODE"}
                  </span>
                  {copied ? <FiCheck size={10} /> : <FiCopy size={10} />}
                </button>

                <button
                  type="button"
                  disabled={!eligible || applied}
                  onClick={() => onApply?.(coupon, product)}
                  className={`flex h-8 min-w-17 shrink-0 items-center justify-center gap-1 rounded-lg border px-2.5 text-[8px] font-extrabold transition-all sm:min-w-18 sm:text-[9px] ${
                    applied
                      ? "border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-500/10"
                      : eligible
                        ? "border-[#ffd83d] bg-[#ffd83d] text-black hover:bg-[#ffcf12] active:scale-95"
                        : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-[#222]"
                  }`}
                >
                  {applied ? (
                    <>
                      <FiCheck size={11} />
                      Applied
                    </>
                  ) : (
                    <>
                      {!eligible && <FiLock size={10} />}
                      Apply
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1">
        {productCoupons.map(({ product, coupon }, index) => (
          <button
            key={getCouponKey(coupon, product)}
            type="button"
            aria-label={`Go to product coupon ${index + 1}`}
            onClick={() => scrollToCoupon(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index ? "w-5 bg-gray-400" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default CouponsList;
