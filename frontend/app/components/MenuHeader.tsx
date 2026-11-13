import React from "react";

import CategoryMenu from "./CategoryMenu";
import MainMenu from "./MainMenu";
import SpecialOfferButton from "./SpecialOfferButton";

const MenuHeader = () => {
  return (
    <nav
      className="
        relative z-50
        w-full
        border-b border-gray-100
        bg-white
        dark:border-gray-800
        dark:bg-[#111] hidden md:block
      "
    >
      <div
        className="
          mx-auto flex
          min-h-16.5
          max-w-[1600px]
          items-center
          gap-5
          px-6
          lg:px-10
        "
      >
        {/* LEFT */}
        <CategoryMenu />

        {/* CENTER */}
        <MainMenu />

        {/* RIGHT */}
        <SpecialOfferButton />
      </div>
    </nav>
  );
};

export default MenuHeader;
