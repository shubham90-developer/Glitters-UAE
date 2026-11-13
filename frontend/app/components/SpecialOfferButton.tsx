import React from "react";
import Link from "next/link";
import { FiArrowUpRight, FiZap } from "react-icons/fi";

const SpecialOfferButton = () => {
  return (
    <Link
      href="/product-list"
      className="
        group relative
        flex h-11.5
        min-w-45
        shrink-0 items-center
        overflow-hidden
        rounded-xl
        bg-[#181818]
        px-3
        text-white
        transition-all
        hover:-translate-y-px
        hover:shadow-[0_7px_20px_rgba(0,0,0,0.15)]
        dark:bg-[#ffd83d]
        dark:text-black
      "
    >
      {/* LIGHT EFFECT */}
      <span
        className="
          absolute -right-8 -top-10
          h-24 w-24 rounded-full
          bg-[#ffd83d]/15
          transition-transform
          group-hover:scale-125
          dark:bg-black/5
        "
      />

      {/* ICON */}
      <span
        className="
          relative z-10
          flex h-9 w-9
          shrink-0 items-center
          justify-center
          rounded-lg
          bg-[#ffd83d]
          text-black
          shadow-sm
          dark:bg-black
          dark:text-[#ffd83d]
        "
      >
        <FiZap size={17} fill="currentColor" />
      </span>

      {/* TEXT */}
      <div className="relative z-10 ml-2.5 flex-1">
        <p
          className="
            text-[9px] font-medium
            text-white/60
            dark:text-black/50
          "
        >
          Limited Time
        </p>

        <p className="mt-px text-[11px] font-bold">Special Offers</p>
      </div>

      {/* ARROW */}
      <FiArrowUpRight
        size={16}
        className="
          relative z-10 ml-2
          opacity-60
          transition-transform
          group-hover:translate-x-0.5
          group-hover:-translate-y-0.5
          group-hover:opacity-100
        "
      />
    </Link>
  );
};

export default SpecialOfferButton;
