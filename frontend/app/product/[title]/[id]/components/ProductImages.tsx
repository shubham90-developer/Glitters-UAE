"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";

type VariantColor = string | { _id?: string; colorName?: string };

type ProductVariant = {
  _id?: string;
  images?: string[]; // new: multiple images per variant
  image?: string; // legacy single image
  color?: VariantColor | null;
};

type ProductImagesProps = {
  product?: {
    productName?: string;
    variants?: ProductVariant[];
  } | null;
  selectedColorId?: string | null;
};

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
};

type ActiveState = {
  colorId: string | null | undefined;
  index: number;
};

const getColorId = (color?: VariantColor | null): string | undefined => {
  if (!color) return undefined;

  return typeof color === "string" ? color : color._id;
};

const getColorName = (color?: VariantColor | null): string | undefined =>
  color && typeof color === "object" ? color.colorName : undefined;

// Supports new `images[]` and old single `image`
const getVariantImages = (variant: ProductVariant): string[] => {
  if (Array.isArray(variant.images) && variant.images.length > 0) {
    return variant.images.filter(Boolean);
  }

  return variant.image ? [variant.image] : [];
};

const ProductImages = ({ product, selectedColorId }: ProductImagesProps) => {
  // The index is stored together with the color it belongs to.
  // When the color changes, the stored index is ignored (falls back to 0),
  // so no effect/setState is needed to reset it.
  const [active, setActive] = useState<ActiveState>({
    colorId: selectedColorId,
    index: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // All images of the selected color's variants
  const productImages = useMemo<GalleryImage[]>(() => {
    const variants = (product?.variants ?? []).filter(
      (variant) => getVariantImages(variant).length > 0,
    );

    const byColor = variants.filter(
      (variant) => getColorId(variant.color) === selectedColorId,
    );

    // if no variant matches the color, show every image
    const list = byColor.length ? byColor : variants;

    // same color with different sizes shares images, so drop duplicates
    const seen = new Set<string>();
    const gallery: GalleryImage[] = [];

    list.forEach((variant, variantIndex) => {
      const colorName = getColorName(variant.color);
      const altBase = `${product?.productName ?? "Product"}${colorName ? ` - ${colorName}` : ""}`;

      getVariantImages(variant).forEach((src, imageIndex) => {
        if (seen.has(src)) return;

        seen.add(src);

        gallery.push({
          id: `${variant._id ?? variantIndex}-${imageIndex}`,
          src,
          alt: `${altBase} ${gallery.length + 1}`,
        });
      });
    });

    return gallery;
  }, [product, selectedColorId]);

  const total = productImages.length;

  const rawIndex = active.colorId === selectedColorId ? active.index : 0;
  const activeIndex = total > 0 ? Math.min(rawIndex, total - 1) : 0;
  const activeImage = productImages[activeIndex];

  const setActiveIndex = useCallback(
    (index: number) => {
      setActive({ colorId: selectedColorId, index });
    },
    [selectedColorId],
  );

  const showPrevious = useCallback(() => {
    if (total === 0) return;

    setActiveIndex(activeIndex === 0 ? total - 1 : activeIndex - 1);
  }, [activeIndex, total, setActiveIndex]);

  const showNext = useCallback(() => {
    if (total === 0) return;

    setActiveIndex(activeIndex === total - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, total, setActiveIndex]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, showPrevious, showNext]);

  // No image: don't crash
  if (!activeImage) {
    return (
      <div className="flex min-h-95 w-full items-center justify-center rounded-2xl border border-gray-200 bg-[#f8f8f8] text-sm text-gray-400 dark:border-white/10 dark:bg-[#0d0d0d]">
        No image available
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Main Gallery */}
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Main Image */}
          <div
            className="group relative order-1 flex min-h-95 flex-1 cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[#f8f8f8] dark:border-white/10 dark:bg-[#0d0d0d] sm:min-h-120 lg:min-h-140"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03] sm:p-8 lg:p-10"
            />

            {/* Zoom Icon */}
            <button
              type="button"
              aria-label="Open image"
              onClick={(event) => {
                event.stopPropagation();
                setIsModalOpen(true);
              }}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-[#ffd83d] hover:text-black dark:border-white/10 dark:bg-black/75 dark:text-white"
            >
              <FiMaximize2 size={17} />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
              {activeIndex + 1} / {total}
            </div>
          </div>

          {/* Thumbnail Slider */}
          <div className="order-2 flex w-full gap-2 overflow-x-auto pb-1 md:h-140 md:w-22 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pb-0 md:pr-1">
            {productImages.map((image, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`relative h-19 w-19 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-[#f8f8f8] transition-all duration-200 dark:bg-[#0d0d0d] md:h-20.5 md:w-full ${
                    isActive
                      ? "border-[#ffd83d] shadow-[0_4px_14px_rgba(255,216,61,0.18)]"
                      : "border-gray-200 hover:border-gray-400 dark:border-white/10 dark:hover:border-white/30"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="90px"
                    className="object-contain p-2"
                  />

                  {isActive && (
                    <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-[#ffd83d]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <p className="mt-3 text-center text-[11px] font-medium text-gray-400 dark:text-gray-500">
          Click the image to view full screen
        </p>
      </div>

      {/* Full Screen Modal */}
      {isModalOpen &&
        createPortal(
        <div
          className="fixed inset-0 z-2147483647 flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="relative z-1000000000 flex h-full max-h-[min(900px,92dvh)] w-full max-w-205 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0c0c0c]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative z-1000000001 flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 dark:border-white/10 dark:bg-[#0c0c0c] sm:px-5">
              <div>
                <p className="text-xs font-extrabold text-gray-900 dark:text-white">
                  Product Gallery
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Image {activeIndex + 1} of {total}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close gallery"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-red-50 hover:text-red-500 dark:bg-white/10 dark:text-white dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <FiX size={19} />
              </button>
            </div>

            {/* Large Modal Image */}
            <div className="relative z-0 min-h-0 flex-1 bg-[#fafafa] dark:bg-[#080808]">
              <Image
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="100vw"
                className="object-contain p-5 sm:p-8 lg:p-12"
              />

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 z-1000000002 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-900 shadow-lg backdrop-blur transition hover:bg-[#ffd83d] dark:border-white/10 dark:bg-black/70 dark:text-white dark:hover:bg-[#ffd83d] dark:hover:text-black sm:left-5"
                  >
                    <FiChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 z-1000000002 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-900 shadow-lg backdrop-blur transition hover:bg-[#ffd83d] dark:border-white/10 dark:bg-black/70 dark:text-white dark:hover:bg-[#ffd83d] dark:hover:text-black sm:right-5"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Modal Bottom Thumbnails */}
            <div className="relative z-1000000001 shrink-0 border-t border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-[#0c0c0c]">
              <div className="mx-auto flex max-w-full justify-start gap-2 overflow-x-auto sm:justify-center">
                {productImages.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-gray-50 transition dark:bg-white/5 ${
                      activeIndex === index
                        ? "border-[#ffd83d]"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="56px"
                      className="object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default ProductImages;