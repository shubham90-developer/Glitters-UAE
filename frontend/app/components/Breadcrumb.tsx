"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronRight, FiHome } from "react-icons/fi";

type BreadcrumbProps = {
  customLabels?: Record<string, string>;
  className?: string;
};

/* Change this to your actual product list route (e.g. "/products") */
const PRODUCT_LIST_HREF = "/product-list";

const formatLabel = (value: string) => {
  return decodeURIComponent(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* Mongo ObjectId, e.g. 6ae8a0b619e1b02cac5a5999 */
const OBJECT_ID = /^[a-f0-9]{24}$/i;

const Breadcrumb = ({ customLabels = {}, className = "" }: BreadcrumbProps) => {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/") return null;

  /* /product/<name>/<id>: hide the id, and make the product name link to
     the full product details url (the name is the last crumb then) */
  const isProductDetail =
    segments[0] === "product" &&
    segments.length >= 3 &&
    OBJECT_ID.test(segments[segments.length - 1]);

  const visibleSegments = isProductDetail ? segments.slice(0, -1) : segments;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`
        w-full
        border-b
        border-gray-100
        bg-white
        dark:border-gray-800
        dark:bg-[#111]    bg-linear-to-r
            from-[#fff8d9]
            via-[#fffdf1]
            to-[#fff3c7]
        ${className}
      `}
    >
      <div
        className="
          mx-auto
          flex
          min-h-11
          w-full
          max-w-[1600px]
          items-center
          overflow-x-auto
          px-3
          sm:px-5
          lg:min-h-12
          lg:px-8
          xl:px-10
        "
      >
        <div className="flex min-w-max items-center gap-1.5">
          {/* HOME */}
          <Link
            href="/"
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              font-semibold
              text-gray-500
              transition
              hover:text-[#b58b00]

              sm:text-[11px]

              dark:text-gray-400
              dark:hover:text-[#ffd83d]
            "
          >
            <FiHome className="h-3.5 w-3.5" />

            <span>Home</span>
          </Link>

          {visibleSegments.map((segment, index) => {
            const isLast = index === visibleSegments.length - 1;

            /* The "product" crumb goes to the product list, not /product (404) */
            const href =
              isProductDetail && isLast
                ? pathname
                : segment === "product" && !isLast
                  ? PRODUCT_LIST_HREF
                  : "/" + segments.slice(0, index + 1).join("/");

            const label = customLabels[segment] || formatLabel(segment);

            return (
              <React.Fragment key={`${index}-${segment}`}>
                <FiChevronRight
                  className="
                    h-3
                    w-3
                    shrink-0
                    text-gray-300

                    dark:text-gray-600
                  "
                />

                {isLast && isProductDetail ? (
                  <Link
                    href={href}
                    aria-current="page"
                    title={label}
                    className="
                      max-w-45
                      truncate
                      text-[10px]
                      font-bold
                      text-black
                      transition
                      hover:text-[#b58b00]

                      sm:max-w-70
                      sm:text-[11px]

                      lg:max-w-100

                      dark:text-white
                      dark:hover:text-[#ffd83d]
                    "
                  >
                    {label}
                  </Link>
                ) : isLast ? (
                  <span
                    className="
                      max-w-45
                      truncate
                      text-[10px]
                      font-bold
                      text-black

                      sm:max-w-70
                      sm:text-[11px]

                      lg:max-w-100

                      dark:text-white
                    "
                    title={label}
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="
                      max-w-35
                      truncate
                      text-[10px]
                      font-semibold
                      text-gray-500
                      transition
                      hover:text-[#b58b00]

                      sm:max-w-50
                      sm:text-[11px]

                      dark:text-gray-400
                      dark:hover:text-[#ffd83d]
                    "
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
