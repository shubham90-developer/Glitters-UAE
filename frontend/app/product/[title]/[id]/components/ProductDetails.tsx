"use client";

import React, { useState } from "react";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import { useParams } from "next/navigation";
import { useGetProductsByIdQuery } from "@/store/productsApi";

const ProductDetails = () => {
  const params = useParams();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // Selected color is owned here so ProductInfo and ProductImages stay in sync
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useGetProductsByIdQuery(id ?? "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <section className="bg-white py-8 dark:bg-[#0a0a0a]">
        <div className="mx-auto w-full max-w-362.5 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="h-125 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
            <div className="h-125 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !productResponse) {
    return (
      <section className="bg-white py-10 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-362.5 px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Unable to load product details.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-6 dark:bg-[#0a0a0a] sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-362.5 px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            PRODUCT IMAGE + INFORMATION
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-7
            lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]
            lg:gap-8
            xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]
            xl:gap-12
          "
        >
          {/* Product Images */}
          <div className="w-full min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="mx-auto w-full max-w-162.5">
              <ProductImages
                product={productResponse}
                selectedColorId={selectedColorId}
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="w-full min-w-0 lg:max-w-170">
            <ProductInfo
              product={
                productResponse as unknown as React.ComponentProps<
                  typeof ProductInfo
                >["product"]
              }
              onColorChange={setSelectedColorId}
            />
          </div>
        </div>

        {/* =====================================================
            PRODUCT TABS
        ====================================================== */}
        <div className="mt-8 pb-28 sm:mt-10 lg:mt-14 lg:pb-0">
          <ProductTabs product={productResponse} />
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
