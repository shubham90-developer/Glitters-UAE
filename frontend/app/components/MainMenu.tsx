"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetcategoryQuery } from "@/store/categoriesApi";

const MenuContent = () => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  // apis
  const { data: menuItems } = useGetcategoryQuery();

  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // drag-to-scroll (mouse only, touch already scrolls natively)
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* -------- show / hide arrows based on scroll position -------- */
  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();

    el.addEventListener("scroll", updateArrows, { passive: true });

    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    if (innerRef.current) observer.observe(innerRef.current);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows, menuItems]);

  /* -------- keep the active category visible -------- */
  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;
    if (!scroller || !inner || !activeCategory) return;
    if (scroller.scrollWidth <= scroller.clientWidth) return;

    const activeEl = Array.from(inner.children).find(
      (child) => (child as HTMLElement).dataset.catId === activeCategory,
    ) as HTMLElement | undefined;
    if (!activeEl) return;

    const s = scroller.getBoundingClientRect();
    const a = activeEl.getBoundingClientRect();
    const delta = a.left - s.left - (s.width - a.width) / 2;

    scroller.scrollBy({ left: delta, behavior: "smooth" });
  }, [activeCategory, menuItems]);

  /* -------- arrow buttons -------- */
  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollBy({
      left: (direction === "left" ? -1 : 1) * el.clientWidth * 0.6,
      behavior: "smooth",
    });
  };

  /* -------- mouse drag handlers -------- */
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;

    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: false,
    };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.down) return;

    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;

    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = () => {
    drag.current.down = false;
  };

  // stop the click that follows a drag from opening a category
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const arrowClass = `
    absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2
    items-center justify-center rounded-full
    border border-gray-200 bg-white text-gray-700
    shadow-md transition-all duration-200
    hover:bg-[#ffd83d] hover:text-black
    dark:border-gray-700 dark:bg-[#222] dark:text-gray-200
    dark:hover:bg-[#ffd83d] dark:hover:text-black
  `;

  return (
    <div className="relative min-w-0 flex-1">
      {/* LEFT FADE + ARROW */}
      {canScrollLeft && (
        <>
          <div
            className="
              pointer-events-none absolute inset-y-0 left-0 z-[5] w-12
              bg-gradient-to-r from-white to-transparent
              dark:from-[#111]
            "
          />
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollByAmount("left")}
            className={`${arrowClass} left-1`}
          >
            <FiChevronLeft size={16} />
          </button>
        </>
      )}

      {/* SCROLLER */}
      <div
        ref={scrollerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClickCapture={onClickCapture}
        className={`
          hide-scrollbar
          overflow-x-auto overflow-y-hidden
          whitespace-nowrap
          ${canScrollLeft || canScrollRight ? "cursor-grab active:cursor-grabbing" : ""}
        `}
      >
        {/* w-max + mx-auto = centered when it fits, starts from the left
            when it overflows (so nothing gets cut off on the left side) */}
        <div
          ref={innerRef}
          className="
            relative mx-auto flex w-max items-center gap-1
            select-none rounded-xl
            border border-gray-100
            bg-[#fafafa]
            p-1
            dark:border-gray-800
            dark:bg-[#181818]
          "
        >
          {menuItems?.map((item) => {
            const active = activeCategory === item._id;

            return (
              <Link
                key={item._id}
                data-cat-id={item._id}
                draggable={false}
                href={`/product-list?category=${item._id}`}
                className={`
                  relative shrink-0
                  rounded-lg
                  px-3 py-2 lg:px-3.5
                  text-[11px]
                  font-bold font-serif tracking-wider
                  transition-all duration-200
                  ${
                    active
                      ? `
                        bg-white
                        text-black
                        shadow-[0_2px_8px_rgba(0,0,0,0.07)]
                        dark:bg-[#292929]
                        dark:text-white
                      `
                      : `
                        text-black
                        hover:bg-white
                        hover:text-black
                        dark:text-gray-300
                        dark:hover:bg-[#252525]
                        dark:hover:text-white
                      `
                  }
                `}
              >
                {item.categoryName}

                {active && (
                  <span
                    className="
                      absolute bottom-0
                      left-1/2 h-0.5
                      w-5 -translate-x-1/2
                      rounded-full
                      bg-[#ffd83d]
                    "
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* RIGHT FADE + ARROW */}
      {canScrollRight && (
        <>
          <div
            className="
              pointer-events-none absolute inset-y-0 right-0 z-[5] w-12
              bg-gradient-to-l from-white to-transparent
              dark:from-[#111]
            "
          />
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollByAmount("right")}
            className={`${arrowClass} right-1`}
          >
            <FiChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
};

/* Suspense is required when using useSearchParams in Next.js */
const MainMenu = () => (
  <Suspense fallback={null}>
    <MenuContent />
  </Suspense>
);

export default MainMenu;
