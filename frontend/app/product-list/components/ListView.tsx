"use client";

import ListViewCard from "@/app/components/ListViewCard";
import type { Product } from "./filterUtils";

interface ListViewProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

const ListViewSkeleton = () => (
  <div className="h-48 w-full animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/5" />
);

const ListView = ({ products, isLoading, isError }: ListViewProps) => {
  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3 sm:gap-4">
        {[1, 2, 3].map((n) => (
          <ListViewSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-red-500">
        Failed to load products. Please try again.
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        No products found.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:gap-4">
      {products.map((product) => (
        <ListViewCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ListView;
