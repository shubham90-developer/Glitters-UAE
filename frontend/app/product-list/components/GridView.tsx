"use client";

import React from "react";
import ProductCard from "@/app/components/ProductCard";
import type { Product } from "./filterUtils";
import Image from "next/image";

interface GridViewProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

const GridView = ({ products, isLoading, isError }: GridViewProps) => {
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Unable to load products</div>;

  if (products.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <Image
            src="/img/noproduct.jpg"
            alt="No product found"
            width={400}
            height={400}
          />
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default GridView;
