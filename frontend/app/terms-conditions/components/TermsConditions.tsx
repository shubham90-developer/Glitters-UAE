"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiChevronRight, FiMail, FiShield } from "react-icons/fi";

import { useGetTermsQuery } from "@/store/termsApi";

/* ============================================================
   TYPES
============================================================ */

interface TermsData {
  _id: string;
  badgeTitle?: string;
  title?: string;
  shortDesc?: string;
  content?: string;
  isDeleted?: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

interface TermsSection {
  id: string;
  title: string;
}

type DateInput = string | Date | null | undefined;

const DEFAULT_TITLE = "Terms & Conditions";

/* ============================================================
   HELPERS
============================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isTerms = (value: unknown): value is TermsData =>
  isRecord(value) && "_id" in value;

/** Supports: Terms[] | { data: Terms[] } | { data: Terms } | Terms */
const extractTerms = (response: unknown): TermsData | null => {
  let list: unknown[] = [];

  if (Array.isArray(response)) {
    list = response;
  } else if (isRecord(response)) {
    if (Array.isArray(response.data)) list = response.data;
    else if (isTerms(response.data)) list = [response.data];
    else if (isTerms(response)) list = [response];
  }

  return list.filter(isTerms).find((item) => !item.isDeleted) ?? null;
};

const parseDate = (value: DateInput): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = value.trim();

  /* DD/MM/YYYY or DD-MM-YYYY */
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);

  if (match) {
    const [, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(text);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value: DateInput): string => {
  const date = parseDate(value);

  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });

  return `${day} ${month} ${date.getFullYear()}`;
};

const stripTags = (html: string): string =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

/**
 * Adds an id to every <h2>/<h3> in the HTML
 * and returns the list of headings for the sidebar.
 */
const processContent = (
  html?: string,
): { html: string; sections: TermsSection[] } => {
  if (!html?.trim()) return { html: "", sections: [] };

  const sections: TermsSection[] = [];
  const used = new Map<string, number>();

  const result = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string, inner: string) => {
      const title = stripTags(inner);

      if (!title) return match;

      const base = slugify(title);
      const count = used.get(base) ?? 0;

      used.set(base, count + 1);

      const id = count === 0 ? base : `${base}-${count + 1}`;
      const cleanAttrs = attrs.replace(/\sid\s*=\s*("[^"]*"|'[^']*')/i, "");

      sections.push({ id, title });

      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: result, sections };
};

/* ============================================================
   SHARED STYLES
============================================================ */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

/** Styles the raw HTML coming from the database. */
const PROSE = [
  "min-w-0 text-[15px] leading-7 text-gray-600 dark:text-gray-300",
  "break-words [overflow-wrap:anywhere]",

  /* headings */
  "[&_h1]:mt-8 [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-black dark:[&_h1]:text-white sm:[&_h1]:text-3xl",
  "[&_h2]:mt-8 [&_h2]:scroll-mt-28 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-black dark:[&_h2]:text-white sm:[&_h2]:text-2xl",
  "[&_h3]:mt-6 [&_h3]:scroll-mt-28 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-black dark:[&_h3]:text-white",
  "[&_h1:first-child]:mt-0 [&_h2:first-child]:mt-0 [&_h3:first-child]:mt-0",

  /* text + lists */
  "[&_p]:mt-3",
  "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
  "[&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
  "[&_li::marker]:text-[#d4aa00]",
  "[&_a]:font-semibold [&_a]:text-[#967200] [&_a]:underline dark:[&_a]:text-[#ffd83d]",
  "[&_strong]:font-bold [&_strong]:text-gray-900 dark:[&_strong]:text-white",
  "[&_blockquote]:mt-4 [&_blockquote]:rounded-xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#ffd83d] [&_blockquote]:bg-[#fffdf3] [&_blockquote]:p-4 dark:[&_blockquote]:bg-[#29260f]",
  "[&_hr]:my-6 [&_hr]:border-gray-200 dark:[&_hr]:border-gray-700",

  /* things that cause horizontal overflow */
  "[&_img]:mt-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
  "[&_table]:mt-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-sm",
  "[&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_th]:text-left dark:[&_th]:border-gray-700 dark:[&_th]:bg-[#202020]",
  "[&_td]:border [&_td]:border-gray-200 [&_td]:p-2 dark:[&_td]:border-gray-700",
  "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:text-sm dark:[&_pre]:bg-[#202020]",
  "[&_iframe]:max-w-full",
].join(" ");

/* ============================================================
   SKELETON
============================================================ */

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`rounded bg-gray-200 dark:bg-neutral-800 ${className}`} />
);

const TermsSkeleton = () => (
  <main className="min-h-screen bg-[#f7f7f8] py-4 dark:bg-[#0f0f0f] sm:py-6 lg:py-8">
    <div
      className="mx-auto w-full max-w-375 animate-pulse px-3 sm:px-5 lg:px-8 xl:px-10"
      aria-busy="true"
      aria-label="Loading terms and conditions"
    >
      {/* HERO */}
      <section className={`${CARD} px-4 py-8 sm:px-6 lg:px-8 lg:py-10`}>
        <Bar className="h-6 w-40 rounded-full" />
        <Bar className="mt-4 h-9 w-2/3 max-w-md" />
        <Bar className="mt-4 h-4 w-full max-w-2xl" />
        <Bar className="mt-2 h-4 w-3/4 max-w-xl" />
        <Bar className="mt-5 h-3 w-48" />
      </section>

      {/* CONTENT */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-6">
        <aside className="hidden lg:block">
          <div className={`${CARD} p-3`}>
            <Bar className="mb-4 ml-2 h-4 w-28" />

            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Bar key={item} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </aside>

        <section className={`${CARD} min-w-0 p-5 sm:p-6 lg:p-8`}>
          {[1, 2, 3].map((item) => (
            <div key={item} className={item > 1 ? "mt-8" : ""}>
              <Bar className="h-6 w-1/2" />
              <Bar className="mt-4 h-4 w-full" />
              <Bar className="mt-2 h-4 w-full" />
              <Bar className="mt-2 h-4 w-5/6" />
              <Bar className="mt-2 h-4 w-2/3" />
            </div>
          ))}
        </section>
      </div>
    </div>
  </main>
);

/* ============================================================
   PAGE
============================================================ */

const TermsConditions = () => {
  const { data, isLoading, isError } = useGetTermsQuery();

  const [activeSection, setActiveSection] = useState("");

  const terms = useMemo(() => extractTerms(data), [data]);

  const { html, sections } = useMemo(
    () => processContent(terms?.content),
    [terms?.content],
  );

  /* Active link: the clicked / scrolled section, or the first one by default */
  const currentSection = sections.some(
    (section) => section.id === activeSection,
  )
    ? activeSection
    : (sections[0]?.id ?? "");

  /* Highlight the sidebar link of the section being read */
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);

      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleNavigate = (id: string) => {
    setActiveSection(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ---------- STATES ---------- */

  if (isLoading) return <TermsSkeleton />;

  if (isError || !terms) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 dark:bg-[#0f0f0f]">
        <p className="text-base text-gray-500 dark:text-gray-400">
          Terms and conditions are not available right now.
        </p>
      </main>
    );
  }

  /* ---------- DERIVED ---------- */

  const title = terms.title ?? DEFAULT_TITLE;
  const updatedOn = formatDate(terms.updatedAt ?? terms.createdAt);
  const hasSections = sections.length > 0;

  /* ---------- RENDER ---------- */

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-4 dark:bg-[#0f0f0f] sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
        {/* ================= HERO ================= */}
        <section
          className={`${CARD} relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12`}
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ffd83d]/10 blur-3xl" />

          <div className="relative max-w-190">
            {terms.badgeTitle && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6ce] px-3 py-1.5 text-[11px] font-bold text-[#806300] dark:bg-[#2b260f] dark:text-[#ffd83d] sm:text-xs">
                <FiShield size={13} />
                {terms.badgeTitle}
              </span>
            )}

            <h1 className="mt-4 font-serif text-3xl font-extrabold text-black dark:text-white sm:text-4xl lg:text-[42px]">
              {title}
            </h1>

            {terms.shortDesc && (
              <p className="mt-3 max-w-162.5 text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base sm:leading-7">
                {terms.shortDesc}
              </p>
            )}

            {updatedOn && (
              <p className="mt-5 text-xs text-gray-400 sm:text-[13px]">
                Last updated: {updatedOn}
              </p>
            )}
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div
          className={`mt-4 grid grid-cols-1 gap-4 xl:gap-6 ${
            hasSections
              ? "lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]"
              : ""
          }`}
        >
          {/* SIDEBAR */}
          {hasSections && (
            <aside className="hidden lg:block">
              <div className={`${CARD} sticky top-25 p-3`}>
                <div className="px-2 pb-3">
                  <p className="font-serif text-sm font-extrabold text-black dark:text-white">
                    {title}
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Jump to a section
                  </p>
                </div>

                <nav className="max-h-[60vh] space-y-1 overflow-y-auto">
                  {sections.map((section) => {
                    const active = currentSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => handleNavigate(section.id)}
                        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition-all ${
                          active
                            ? "bg-[#fff7d5] text-[#8a6900] dark:bg-[#2b260f] dark:text-[#ffd83d]"
                            : "text-gray-500 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-[#222] dark:hover:text-white"
                        }`}
                      >
                        <span className="truncate">{section.title}</span>

                        <FiChevronRight size={13} className="shrink-0" />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* TERMS CONTENT */}
          <section className="min-w-0">
            {/* MOBILE NAV */}
            {hasSections && (
              <div className="scrollbar-hide mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleNavigate(section.id)}
                    className={`shrink-0 cursor-pointer rounded-lg border px-3.5 py-2.5 text-xs font-bold transition ${
                      currentSection === section.id
                        ? "border-[#ffd83d] bg-[#ffd83d] text-black"
                        : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-[#181818] dark:text-gray-300"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}

            <div className={`${CARD} min-w-0 p-5 sm:p-6 lg:p-8`}>
              {html ? (
                <div
                  className={PROSE}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No terms and conditions have been added yet.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#181818] px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div>
            <h2 className="font-serif text-lg font-extrabold text-white sm:text-xl">
              Have questions about our terms?
            </h2>

            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              Our support team is available to help.
            </p>
          </div>

          <Link
            href="/contact-us"
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-6 text-xs font-extrabold text-black transition hover:bg-[#ffcf12] sm:text-sm"
          >
            <FiMail size={14} />
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
};

export default TermsConditions;