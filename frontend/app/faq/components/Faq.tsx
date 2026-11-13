"use client";

import React, { useMemo, useState } from "react";

import {
  FiChevronDown,
  FiHelpCircle,
  FiMessageCircle,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiRefreshCw,
  FiShield,
  FiPackage,
} from "react-icons/fi";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { useGetFaqQuery } from "@/store/faqApi";

/* ====================================================== */
/* SHARED STYLES */
/* ====================================================== */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

const ICON_BOX =
  "flex items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]";

const BONE = "animate-pulse rounded-md bg-gray-200 dark:bg-[#2a2a2a]";

/* ====================================================== */
/* TYPES + HELPERS */
/* ====================================================== */

type FaqItem = {
  _id: string;
  category: string;
  question: string;
  answer: string;
  status?: string;
  isDeleted?: boolean;
};

// Icons for known categories; anything new from the backend gets the fallback.
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  orders: <FiShoppingBag size={13} />,
  shipping: <FiTruck size={13} />,
  payments: <FiCreditCard size={13} />,
  returns: <FiRefreshCw size={13} />,
  products: <FiPackage size={13} />,
};

const categoryIcon = (id: string) =>
  CATEGORY_ICONS[id] ?? <FiHelpCircle size={13} />;

const categoryLabel = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

/* ====================================================== */
/* PAGE */
/* ====================================================== */

const Faq = () => {
  const { data, isLoading, isError, refetch } = useGetFaqQuery();

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  // Only show live entries on the public page.
  const items = useMemo(
    () =>
      ((Array.isArray(data) ? data : []) as FaqItem[]).filter(
        (item) => !item.isDeleted && (item.status ?? "active") === "active",
      ),
    [data],
  );

  // Categories come from the data, so new ones appear without a code change.
  const categories = useMemo(() => {
    const ids = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean)),
    );

    return [
      { id: "all", label: "All", icon: <FiHelpCircle size={13} /> },
      ...ids.map((id) => ({
        id,
        label: categoryLabel(id),
        icon: categoryIcon(id),
      })),
    ];
  }, [items]);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const categoryMatch =
        activeCategory === "all" || item.category === activeCategory;

      const searchMatch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [items, activeCategory, search]);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-4 sm:py-6 lg:py-8 dark:bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
        {/* HERO */}
        <section
          className={`${CARD} relative overflow-hidden px-4 py-7 text-center sm:px-6 sm:py-9 lg:py-11`}
        >
          <div className="absolute left-1/2 -top-25 h-65 w-65 -translate-x-1/2 rounded-full bg-[#ffd83d]/15 blur-3xl" />

          <div className="relative mx-auto max-w-175">
            <div
              className={`${ICON_BOX} mx-auto h-10 w-10 rounded-xl sm:h-11 sm:w-11`}
            >
              <FiHelpCircle size={20} />
            </div>

            <h1 className="mt-3 font-serif text-[22px] font-extrabold text-black sm:text-[28px] lg:text-[34px] dark:text-white">
              Frequently Asked Questions
            </h1>

            <p className="mx-auto mt-2 max-w-140 text-[11px] leading-5 text-gray-500 lg:text-[12px] dark:text-gray-400">
              Find quick answers about orders, delivery, payments, returns and
              products.
            </p>

            {/* SEARCH */}
            <div className="mx-auto mt-5 flex h-11 max-w-140 items-center rounded-xl border border-gray-200 bg-white px-3 shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition focus-within:border-[#ffd83d] sm:h-12 dark:border-gray-700 dark:bg-[#202020]">
              <FiSearch size={15} className="shrink-0 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your question..."
                aria-label="Search questions"
                className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[12px] text-black outline-none placeholder:text-gray-400 dark:text-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="cursor-pointer text-[10px] font-bold text-gray-400 hover:text-black dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* CATEGORY FILTER */}
        <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-1">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`${BONE} h-9 w-24 shrink-0 rounded-lg sm:h-10`}
                />
              ))
            : categories.map((category) => {
                const active = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenId(null);
                    }}
                    className={`flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-[11px] font-bold transition-all sm:h-10 sm:px-4 ${
                      active
                        ? "border-[#ffd83d] bg-[#ffd83d] text-black"
                        : "border-gray-200 bg-white text-gray-900 hover:border-[#ffd83d] hover:text-black dark:border-gray-700 dark:bg-[#181818] dark:text-gray-300"
                    }`}
                  >
                    {category.icon}
                    {category.label}
                  </button>
                );
              })}
        </div>

        {/* CONTENT */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)] xl:gap-6">
          {/* LEFT INFO */}
          <aside className="hidden lg:block">
            <div className={`${CARD} sticky top-25 p-4`}>
              <div className={`${ICON_BOX} h-9 w-9`}>
                <FiMessageCircle size={16} />
              </div>

              <h2 className="mt-3 font-serif text-[13px] font-bold tracking-wider text-black dark:text-white">
                Still need help?
              </h2>

              <p className="mt-1.5 text-[11px] leading-4 text-gray-900 dark:text-gray-400">
                Can&apos;t find the answer you need? Contact our support team
                and we&apos;ll help you.
              </p>

              <ThemeBtnOne
                text="Contact Support"
                icon={<FiMessageCircle size={11} />}
                url="/contact-us"
                className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#ffd83d] font-serif text-[12px] text-black transition hover:bg-[#ffcf12]"
              />

              <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                <SupportInfo
                  icon={<FiTruck size={13} />}
                  title="Fast Delivery"
                />
                <SupportInfo
                  icon={<FiShield size={13} />}
                  title="Secure Payments"
                />
                <SupportInfo
                  icon={<FiRefreshCw size={13} />}
                  title="Easy Returns"
                />
              </div>
            </div>
          </aside>

          {/* FAQ LIST */}
          <section className="min-w-0" aria-busy={isLoading}>
            <div className="mb-3">
              <h2 className="font-serif text-[15px] font-extrabold text-black sm:text-[17px] dark:text-white">
                Common Questions
              </h2>

              {isLoading ? (
                <div className={`${BONE} mt-1.5 h-3 w-32`} />
              ) : (
                !isError && (
                  <p className="mt-0.5 text-[12px] text-gray-900 dark:text-gray-400">
                    {filteredFaqs.length}{" "}
                    {filteredFaqs.length === 1 ? "question" : "questions"} found
                  </p>
                )
              )}
            </div>

            {isLoading ? (
              <FaqSkeleton />
            ) : isError ? (
              <EmptyState
                title="Unable to load questions"
                text="Something went wrong while loading the FAQs. Please try again."
                actionLabel="Try Again"
                onAction={refetch}
              />
            ) : items.length === 0 ? (
              <EmptyState
                title="No questions yet"
                text="Check back soon. We're adding answers to common questions."
              />
            ) : filteredFaqs.length === 0 ? (
              <EmptyState
                title="No questions found"
                text="Try another keyword or select a different category."
                actionLabel="View All Questions"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-2.5">
                {filteredFaqs.map((item) => {
                  const open = openId === item._id;

                  return (
                    <article
                      key={item._id}
                      className={`overflow-hidden rounded-xl border bg-white transition-all dark:bg-[#181818] ${
                        open
                          ? "border-[#ffd83d] shadow-[0_4px_18px_rgba(255,216,61,0.08)] dark:border-[#665816]"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenId(open ? null : item._id)}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 p-3 text-left sm:p-4"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${
                              open
                                ? "bg-[#ffd83d] text-black"
                                : "bg-[#f5f5f5] text-gray-500 dark:bg-[#242424]"
                            }`}
                          >
                            Q
                          </span>

                          <span className="text-[12px] font-bold leading-4 text-black sm:text-[13px] dark:text-white">
                            {item.question}
                          </span>
                        </div>

                        <FiChevronDown
                          size={15}
                          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                            open ? "rotate-180 text-black dark:text-white" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="whitespace-pre-line border-t border-gray-100 px-3 py-3 pl-12 text-[12px] leading-5 text-gray-500 sm:px-4 sm:py-4 sm:pl-13.5 dark:border-gray-800 dark:text-gray-400">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* BOTTOM CTA */}
        <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#181818] px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div>
            <h2 className="font-serif text-[15px] font-extrabold text-white sm:text-[17px]">
              Didn&apos;t find your answer?
            </h2>

            <p className="mt-1 text-[12px] text-gray-400">
              Our support team is available to assist you.
            </p>
          </div>

          <ThemeBtnOne
            text="Contact Us"
            url="/contact-us"
            icon={<FiMessageCircle />}
            className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#ffd83d] px-5 font-serif text-[12px] text-black transition hover:bg-[#ffcf12]"
          />
        </section>
      </div>
    </main>
  );
};

/* ====================================================== */
/* SKELETON */
/* ====================================================== */

const SKELETON_WIDTHS = ["w-3/4", "w-2/3", "w-4/5", "w-1/2", "w-3/5"];

const FaqSkeleton = () => (
  <div className="space-y-2.5" aria-hidden="true">
    {SKELETON_WIDTHS.map((width) => (
      <div
        key={width}
        className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-[#181818]"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className={`${BONE} h-7 w-7 shrink-0 rounded-lg`} />
          <div className={`${BONE} h-3.5 ${width}`} />
        </div>

        <div className={`${BONE} h-4 w-4 shrink-0 rounded-full`} />
      </div>
    ))}
  </div>
);

/* ====================================================== */
/* EMPTY / ERROR STATE */
/* ====================================================== */

const EmptyState = ({
  title,
  text,
  actionLabel,
  onAction,
}: {
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-4 text-center dark:border-gray-800 dark:bg-[#181818]">
    <FiSearch size={22} className="text-gray-300" />

    <h3 className="mt-3 font-serif text-[13px] font-extrabold text-black dark:text-white">
      {title}
    </h3>

    <p className="mt-1 max-w-70 text-[11px] leading-4 text-gray-400">{text}</p>

    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 h-9 cursor-pointer rounded-lg bg-[#ffd83d] px-4 text-[11px] font-bold text-black transition hover:bg-[#ffcf12]"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

/* ====================================================== */
/* SUPPORT INFO */
/* ====================================================== */

const SupportInfo = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-2 py-1.5">
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f7f7f7] text-gray-500 dark:bg-[#242424] dark:text-gray-400">
      {icon}
    </span>

    <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-300">
      {title}
    </span>
  </div>
);

export default Faq;
