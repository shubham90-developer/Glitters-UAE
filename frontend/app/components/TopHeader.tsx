/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Select, { SingleValue, StylesConfig } from "react-select";
import {
  FaEnvelope,
  FaLocationDot,
  FaCircleQuestion,
  FaSun,
  FaMoon,
} from "react-icons/fa6";
import Link from "next/link";
import { useGetSettingsQuery } from "@/store/settingApi";
import { useGetStoreLocatorQuery } from "@/store/storeLocatorApi";

type LocationOption = {
  value: string;
  label: string;
};

type FooterSettings = {
  topHeaderTitle?: string;
  mail?: string;
};

const TopHeader = () => {
  const router = useRouter();

  const { data } = useGetSettingsQuery();

  const { data: stores } = useGetStoreLocatorQuery();

  const locationOptions: LocationOption[] =
    stores?.map((store: any) => ({
      value: store._id,
      label: store.storeName,
    })) ?? [];

  // The settings endpoint returns an array; use the first document.
  const settings: FooterSettings = (Array.isArray(data) ? data[0] : data) ?? {};

  const [dark, setDark] = useState(false);
  const [location, setLocation] = useState<LocationOption | null>(null);

  const toggleTheme = () => {
    const next = !dark;

    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleLocation = (option: SingleValue<LocationOption>) => {
    if (!option) {
      setLocation(null);
      return;
    }

    setLocation(option);

    router.push(`/stores/${option.value}`);
  };

  const customStyles: StylesConfig<LocationOption, false> = {
    control: (base) => ({
      ...base,
      width: "140px",
      minHeight: "28px",
      height: "28px",
      border: "none",
      backgroundColor: "transparent",
      boxShadow: "none",
      cursor: "pointer",
      paddingLeft: "21px",
    }),

    valueContainer: (base) => ({
      ...base,

      height: "28px",
      padding: "0 4px",
    }),

    input: (base) => ({
      ...base,

      margin: 0,
      padding: 0,

      color: dark ? "#ffffff" : "#111111",
    }),

    placeholder: (base) => ({
      ...base,

      margin: 0,

      color: dark ? "#ffffff" : "#111111",

      fontSize: "11px",
      fontWeight: 700,
    }),

    singleValue: (base) => ({
      ...base,

      margin: 0,

      color: dark ? "#ffffff" : "#111111",

      fontSize: "11px",
      fontWeight: 700,
    }),

    indicatorsContainer: (base) => ({
      ...base,

      height: "28px",
    }),

    dropdownIndicator: (base, selectState) => ({
      ...base,
      padding: "2px",
      marginLeft: "2px",
      marginRight: "0px",
      color: dark ? "#ffffff" : "#111111",
      transform: selectState.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "0.2s",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    clearIndicator: () => ({
      display: "none",
    }),

    menuPortal: (base) => ({
      ...base,

      zIndex: 99999,
    }),

    menu: (base) => ({
      ...base,

      marginTop: "6px",

      borderRadius: "10px",

      overflow: "hidden",

      border: dark ? "1px solid #333333" : "1px solid #e5e7eb",

      backgroundColor: dark ? "#181818" : "#ffffff",

      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    }),

    menuList: (base) => ({
      ...base,

      padding: "5px",

      maxHeight: "220px",
    }),

    option: (base, state) => ({
      ...base,

      borderRadius: "7px",

      padding: "8px 10px",

      fontSize: "11px",
      fontWeight: 600,

      cursor: "pointer",

      color: dark ? "#ffffff" : "#111111",

      backgroundColor: state.isSelected
        ? "#ffd83d"
        : state.isFocused
          ? dark
            ? "#282828"
            : "#f5f5f5"
          : "transparent",

      "&:active": {
        backgroundColor: "#ffd83d",
      },
    }),

    noOptionsMessage: (base) => ({
      ...base,

      fontSize: "11px",

      color: dark ? "#a3a3a3" : "#6b7280",
    }),
  };

  return (
    <div
      className="
        hidden
        w-full
        bg-[#f7f7f7]
        text-black
        transition-colors

        md:block

        dark:bg-[#181818]
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          flex
          h-10
          max-w-8xl
          items-center
          justify-between
          px-10
          text-xs
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <span className="font-bold">🛡️ {settings?.topHeaderTitle}</span>

          <span className="text-gray-300 dark:text-gray-600">|</span>

          {/* EMAIL */}
          <Link
            href={`mailto:${settings?.mail}`}
            className="
              flex
              items-center
              gap-1.5
              font-bold
              transition
              hover:opacity-60
            "
          >
            <FaEnvelope className="text-sm" />
            {settings?.mail}
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* LOCATION */}
          <div className="relative flex items-center">
            <FaLocationDot
              className="
                pointer-events-none
                absolute
                left-2
                z-10
                text-sm
                text-black
                dark:text-white
              "
            />

            <Select<LocationOption, false>
              instanceId="store-locator-select"
              value={location}
              onChange={handleLocation}
              options={locationOptions}
              placeholder="Store Locations"
              isSearchable
              isClearable={false}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : undefined
              }
              menuPosition="fixed"
              styles={customStyles}
              noOptionsMessage={() => "No location found"}
            />
          </div>

          <span className="text-gray-300 dark:text-gray-600">|</span>

          {/* HELP */}
          <button
            type="button"
            onClick={() => router.push("/contact-us")}
            className="
              flex
              cursor-pointer
              items-center
              gap-1.5
              font-bold
              transition
              hover:opacity-60
            "
          >
            <FaCircleQuestion className="text-sm" />
            Need Help?
          </button>

          <span className="text-gray-300 dark:text-gray-600">|</span>

          {/* THEME */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              flex
              h-6
              w-11
              cursor-pointer
              items-center
              rounded-full
              bg-gray-300
              p-0.5
              transition

              dark:bg-gray-600
            "
          >
            <span
              className={`
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-white
                text-[10px]
                text-black
                shadow
                transition-transform
                duration-200

                ${dark ? "translate-x-5" : "translate-x-0"}
              `}
            >
              {dark ? <FaMoon /> : <FaSun />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
