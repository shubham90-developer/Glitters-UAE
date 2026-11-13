"use client";

import React from "react";
import { FiChevronDown, FiGrid, FiList } from "react-icons/fi";

type ViewType = "grid" | "list";

interface TopFilterProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  total: number;
}

const TopFilter = ({
  view,
  onViewChange,
  sort,
  onSortChange,
  total,
}: TopFilterProps) => {
  const viewBtn = (active: boolean) =>
    `flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all duration-200 ${
      active
        ? "bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white"
        : "text-gray-400 hover:text-black dark:hover:text-white"
    }`;

  return (
    <div className="flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.04)] sm:min-h-11 sm:px-3 lg:px-4 dark:border-gray-800 dark:bg-[#181818]">
      {/* LEFT */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-[10px] font-semibold text-gray-500 sm:text-[11px] dark:text-gray-400">
          <span className="font-extrabold text-black dark:text-white">
            {total}
          </span>{" "}
          Products Found
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* SORT */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort products"
            className="h-8 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-[#fafafa] pl-2.5 pr-7 text-[9px] font-bold text-black outline-none transition hover:border-gray-300 focus:border-[#ffd83d] sm:h-9 sm:pl-3 sm:pr-8 sm:text-[10px] dark:border-gray-700 dark:bg-[#202020] dark:text-white"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-500" />
        </div>

        {/* VIEW SWITCH */}
        <div className="hidden items-center rounded-lg border border-gray-200 bg-[#fafafa] p-0.5 sm:flex dark:border-gray-700 dark:bg-[#202020]">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={viewBtn(view === "grid")}
          >
            <FiGrid size={14} />
          </button>

          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={viewBtn(view === "list")}
          >
            <FiList size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopFilter;
