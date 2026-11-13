"use client";

import { useGetBlogByIdQuery, useGetBlogQuery } from "@/store/blogApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiFacebook,
  FiFileText,
  FiLinkedin,
  FiShare2,
  FiTwitter,
  FiUser,
} from "react-icons/fi";

/* ============================================================
   TYPES
============================================================ */

interface BlogCategory {
  _id?: string;
  categoryName?: string;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

interface Blog {
  _id: string;

  category?: BlogCategory | string | null;

  title?: string | null;
  shortDesc?: string | null;
  author?: string | null;

  featured?: boolean;

  image?: string | null;

  description?: string | null;
  QuickTips?: string | null;
  blackQuote?: string | null;

  tags?: string[] | string | null;

  writtenBy?: string | null;
  writtenByImage?: string | null;
  writtenByDesc?: string | null;

  metaTitle?: string | null;
  metaDesc?: string | null;
  metaTags?: string[] | string | null;

  isDeleted?: boolean;

  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}
type DateInput = string | Date | null | undefined;
const getCategoryName = (category?: BlogCategory | string | null): string => {
  if (!category) {
    return "";
  }

  if (typeof category === "string") {
    return category;
  }

  return category.categoryName ?? "";
};

/**
 * Safely convert API date into Date.
 */
const parseDate = (value: DateInput): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = value.trim();

  /* DD/MM/YYYY or DD-MM-YYYY (optionally followed by a time) */
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);

  if (match) {
    const [, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return Number.isNaN(date.getTime()) ? null : date;
  }

  /* ISO strings like 2026-10-01T07:04:45.659Z */
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

const normalizeTags = (tags?: string[] | string | null): string[] => {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

/* plain text from editor html (for comparing / counting words) */
const htmlToText = (html: string): string =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Editor html cleanup:
 * - &nbsp; -> normal space (otherwise words are glued together and never wrap)
 * - drop a leading heading that only repeats the page title
 */
const cleanHtml = (html?: string | null, title?: string | null): string => {
  if (!html) return "";

  let out = html.replace(/&nbsp;/gi, " ").replace(/\u00a0/g, " ");

  const first = out.match(/^\s*<h[1-2][^>]*>([\s\S]*?)<\/h[1-2]>/i);

  if (
    first &&
    title &&
    htmlToText(first[1]).toLowerCase() === title.trim().toLowerCase()
  ) {
    out = out.slice(first[0].length);
  }

  return out;
};

const getReadMinutes = (html?: string | null): number => {
  if (!html) return 1;

  const words = htmlToText(html).split(" ").filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
};

/* Styles for the article body (html coming from the admin editor) */
const PROSE = [
  "break-words text-[16px] leading-[1.8] text-gray-700 dark:text-gray-300",

  /* paragraphs */
  "[&_p]:mb-4",

  /* headings */
  "[&_:is(h1,h2,h3,h4)]:font-extrabold [&_:is(h1,h2,h3,h4)]:tracking-tight [&_:is(h1,h2,h3,h4)]:text-gray-950 dark:[&_:is(h1,h2,h3,h4)]:text-white",
  "[&_h1]:mb-5 [&_h1]:mt-10 [&_h1]:text-[30px] [&_h1]:leading-tight",
  "[&_h2]:mb-3 [&_h2]:mt-9 [&_h2]:scroll-mt-28 [&_h2]:text-[24px] [&_h2]:leading-tight",
  "[&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:scroll-mt-28 [&_h3]:text-[19px] [&_h3]:leading-snug",
  "[&_h4]:mb-2 [&_h4]:mt-7 [&_h4]:text-[17px]",
  "[&>:first-child]:mt-0",

  /* lists */
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:mb-1.5 [&_li]:pl-1 [&_li::marker]:font-bold [&_li::marker]:text-[#d4a900]",

  /* inline */
  "[&_strong]:font-bold [&_strong]:text-gray-950 dark:[&_strong]:text-white",
  "[&_a]:font-semibold [&_a]:text-gray-950 [&_a]:underline [&_a]:decoration-[#ffd83d] [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:bg-[#ffd83d]/30 dark:[&_a]:text-white",

  /* quotes */
  "[&_blockquote]:my-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#ffd83d] [&_blockquote]:bg-[#fffbea] [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic dark:[&_blockquote]:bg-[#ffd83d]/5",

  /* media */
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl",
  "[&_iframe]:my-8 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-2xl",
  "[&_video]:my-8 [&_video]:w-full [&_video]:rounded-2xl",

  /* tables scroll sideways instead of breaking the page */
  "[&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-sm",
  "[&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-bold dark:[&_th]:border-white/10 dark:[&_th]:bg-white/5",
  "[&_td]:border [&_td]:border-gray-200 [&_td]:px-4 [&_td]:py-2.5 dark:[&_td]:border-white/10",

  /* misc */
  "[&_hr]:my-10 [&_hr]:border-gray-200 dark:[&_hr]:border-white/10",
  "[&_code]:rounded-md [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[14px] dark:[&_code]:bg-white/10",
  "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-gray-950 [&_pre]:p-5 [&_pre]:text-sm [&_pre]:text-gray-100",
].join(" ");

/* ============================================================
   TABLE OF CONTENTS
============================================================ */

type TocItem = { id: string; text: string; level: 2 | 3 };

/* adds an id to every h2 / h3 of the article and returns the list */
const buildToc = (html: string): { html: string; toc: TocItem[] } => {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match: string, level: string, attrs: string, inner: string) => {
      const text = htmlToText(inner);

      if (!text) return match;

      const base =
        text
          .toLowerCase()
          .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
          .replace(/^-+|-+$/g, "") || "section";

      let id = base;
      let count = 2;

      while (used.has(id)) {
        id = `${base}-${count++}`;
      }

      used.add(id);
      toc.push({ id, text, level: Number(level) as 2 | 3 });

      const cleanAttrs = attrs.replace(/\sid=("[^"]*"|'[^']*')/i, "");

      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: out, toc };
};

const TableOfContents = ({
  items,
  onNavigate,
}: {
  items: TocItem[];
  onNavigate?: () => void;
}) => {
  const [activeId, setActiveId] = React.useState("");

  /* highlight the section that is currently being read */
  React.useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-110px 0px -65% 0px" },
    );

    headings.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  const goTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const go = () =>
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (onNavigate) {
      // article may be collapsed: open it first, then jump after it re-renders
      onNavigate();
      requestAnimationFrame(() => requestAnimationFrame(go));
    } else {
      go();
    }
  };

  return (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = activeId === item.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={goTo(item.id)}
                className={`block rounded-lg border-l-2 py-1.5 pr-2 text-xs leading-5 transition-colors ${
                  item.level === 3 ? "pl-6" : "pl-3"
                } ${
                  active
                    ? "border-[#ffd83d] bg-[#fffbea] font-bold text-gray-950 dark:bg-[#ffd83d]/10 dark:text-white"
                    : "border-transparent font-medium text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/* thin yellow bar at the top of the screen showing how much is read */
const ReadingProgress = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;

      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        className="h-full bg-[#ffd83d] transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

/* ============================================================
   READ MORE (collapses long article content)
============================================================ */

const COLLAPSED_HEIGHT = 560; // px of article shown before "Read more"

const CollapsibleContent = ({
  expanded,
  onToggle,
  children,
}: {
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = React.useState(false);

  /* only collapse when the content is really long (also reacts to image loads) */
  React.useEffect(() => {
    const el = innerRef.current;

    if (!el) return;

    const check = () =>
      setOverflowing(el.offsetHeight > COLLAPSED_HEIGHT + 120);

    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const collapsed = overflowing && !expanded;

  return (
    <div id="article-body" className="scroll-mt-28">
      <div
        className="relative overflow-hidden"
        style={collapsed ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
      >
        <div ref={innerRef} className="space-y-6">
          {children}
        </div>

        {/* fade-out at the bottom while collapsed */}
        {collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-white via-white/90 to-transparent dark:from-[#111111] dark:via-[#111111]/90" />
        )}
      </div>

      {overflowing && (
        <div
          className={`flex justify-center ${collapsed ? "relative z-10 -mt-3" : "mt-6"}`}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#ffd83d] px-7 py-3 text-xs font-extrabold text-black shadow-[0_8px_24px_rgba(255,216,61,0.35)] transition hover:bg-[#f5cb22] active:scale-[0.97]"
          >
            {expanded ? "Show less" : "Read more"}

            <FiChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   COMPONENT
============================================================ */

const BlogDetails = () => {
  const params = useParams();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  /* which blog has its full article opened (resets when another blog opens) */
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const expanded = !!id && expandedId === id;

  /* ============================================================
     SINGLE BLOG
  ============================================================ */

  const {
    data: blogResponse,
    isLoading,
    isError,
  } = useGetBlogByIdQuery(id ?? "", {
    skip: !id,
  });

  /* ============================================================
     ALL BLOGS
  ============================================================ */

  const { data: recentResponse } = useGetBlogQuery();

  /* ============================================================
     NORMALIZE SINGLE BLOG RESPONSE
  ============================================================ */

  const blogs: Blog | null = React.useMemo(() => {
    if (!blogResponse) {
      return null;
    }

    const response = blogResponse as unknown;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = (response as { data?: unknown }).data;

      if (data && typeof data === "object" && "_id" in data) {
        return data as Blog;
      }
    }

    if (
      typeof response === "object" &&
      response !== null &&
      "blog" in response
    ) {
      const blog = (response as { blog?: unknown }).blog;

      if (blog && typeof blog === "object" && "_id" in blog) {
        return blog as Blog;
      }
    }

    if (
      typeof response === "object" &&
      response !== null &&
      "_id" in response
    ) {
      return response as Blog;
    }

    return null;
  }, [blogResponse]);

  /* ============================================================
     NORMALIZE ALL BLOGS
  ============================================================ */

  const recentPosts: Blog[] = React.useMemo(() => {
    if (!recentResponse) {
      return [];
    }

    const response = recentResponse as unknown;

    /* Response: [] */
    if (Array.isArray(response)) {
      return response.filter(
        (item): item is Blog =>
          typeof item === "object" && item !== null && "_id" in item,
      );
    }

    /* Response: { data: [] } */
    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = (response as { data?: unknown }).data;

      if (Array.isArray(data)) {
        return data.filter(
          (item): item is Blog =>
            typeof item === "object" && item !== null && "_id" in item,
        );
      }
    }

    /* Response: { blogs: [] } */
    if (
      typeof response === "object" &&
      response !== null &&
      "blogs" in response
    ) {
      const data = (response as { blogs?: unknown }).blogs;

      if (Array.isArray(data)) {
        return data.filter(
          (item): item is Blog =>
            typeof item === "object" && item !== null && "_id" in item,
        );
      }
    }

    return [];
  }, [recentResponse]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#f7f7f8] py-16 dark:bg-[#080808] lg:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white lg:col-span-8 dark:border-white/10 dark:bg-[#111]">
              <div className="h-80 bg-gray-200 dark:bg-gray-800 sm:h-[450px]" />

              <div className="p-8">
                <div className="mb-6 flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                </div>

                <div className="mb-6 h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-3">
                  <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#111]">
                <div className="mb-6 h-8 w-40 rounded bg-gray-200 dark:bg-gray-800" />

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="mb-4 flex gap-4 border-b border-gray-200 pb-4 dark:border-white/10"
                  >
                    <div className="h-20 w-22 rounded bg-gray-200 dark:bg-gray-800" />

                    <div className="flex-1">
                      <div className="mb-2 h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (isError || !blogs) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#f7f7f8] px-4 dark:bg-[#080808]">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
            <FiFileText size={25} />
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Blog not found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The article you are looking for does not exist or has been removed.
          </p>

          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ffd83d] px-5 py-3 text-xs font-extrabold text-black transition hover:bg-[#f5cb22]"
          >
            <FiArrowLeft size={14} />
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  /* ============================================================
     DATE
  ============================================================ */

  const date = formatDate(blogs.createdAt);

  /* ============================================================
     CATEGORY
  ============================================================ */

  const categoryName = getCategoryName(blogs.category) || "General";

  /* ============================================================
     TAGS
  ============================================================ */

  const blogTags = normalizeTags(blogs.tags);

  /* ============================================================
     ARTICLE BODY / READING TIME / AUTHOR
  ============================================================ */

  const cleanDescription = cleanHtml(blogs.description, blogs.title);
  const { html: articleHtml, toc } = buildToc(cleanDescription);
  const showToc = toc.length >= 2;

  const expandArticle = () => {
    if (id) setExpandedId(id);
  };

  const toggleArticle = () => {
    if (expanded) {
      setExpandedId(null);

      // bring the reader back to the start of the article
      requestAnimationFrame(() =>
        document
          .getElementById("article-body")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } else {
      expandArticle();
    }
  };
  const readMinutes = getReadMinutes(blogs.description);
  const authorName = blogs.author || blogs.writtenBy || "";

  /* ============================================================
     RELATED BLOGS
  ============================================================ */

  const relatedBlogs = recentPosts
    .filter((post) => String(post._id) !== String(blogs._id))
    .slice(0, 3);

  /* ============================================================
     CURRENT URL
  ============================================================ */

  const getCurrentUrl = (): string => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  };

  /* ============================================================
     SHARE
  ============================================================ */

  const shareFacebook = () => {
    if (typeof window === "undefined") return;

    const currentUrl = getCurrentUrl();

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl,
      )}`,
      "_blank",
      "width=600,height=500",
    );
  };

  const shareTwitter = () => {
    if (typeof window === "undefined") return;

    const currentUrl = getCurrentUrl();

    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl,
      )}&text=${encodeURIComponent(blogs.title ?? "")}`,
      "_blank",
      "width=600,height=500",
    );
  };

  const shareLinkedIn = () => {
    if (typeof window === "undefined") return;

    const currentUrl = getCurrentUrl();

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl,
      )}`,
      "_blank",
      "width=600,height=500",
    );
  };

  const shareNative = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      return shareLinkedIn(); // fallback when the native share sheet isn't supported
    }

    try {
      await navigator.share({
        title: blogs.title ?? "",
        text: blogs.shortDesc ?? "",
        url: getCurrentUrl(),
      });
    } catch {
      // user cancelled the share sheet
    }
  };

  /* ============================================================
     MAIN
  ============================================================ */

  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-16 pt-5 transition-colors duration-300 dark:bg-[#080808] lg:pb-24 lg:pt-8">
      <ReadingProgress />

      <div className="mx-auto w-full max-w-300 px-4 sm:px-6 lg:px-8">
        {/* BACK */}

        <Link
          href="/blog"
          className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-gray-500 transition hover:text-[#b18d00] dark:text-gray-400 dark:hover:text-[#ffd83d]"
        >
          <FiArrowLeft size={15} />
          Back to Blog
        </Link>

        {/* HERO: text on the left, image on the right (stacked on mobile) */}

        <section
          className={`mb-8 grid items-center gap-6 lg:mb-10 lg:gap-12 ${
            blogs.image ? "lg:grid-cols-2" : ""
          }`}
        >
          <header
            className={`text-center ${
              blogs.image ? "lg:text-left" : "mx-auto max-w-3xl"
            }`}
          >
            {/* CATEGORY */}

            <span className="inline-flex rounded-full bg-[#fff3bd] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#967600] dark:bg-[#ffd83d]/10 dark:text-[#ffd83d]">
              {categoryName}
            </span>

            {/* TITLE */}

            <h1 className="mt-4 text-balance text-3xl font-black leading-[1.15] tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-[40px]">
              {blogs.title ?? "Untitled Blog"}
            </h1>

            {/* SHORT DESCRIPTION */}

            {blogs.shortDesc && (
              <p
                className={`mt-4 text-base leading-7 text-gray-500 dark:text-gray-400 ${
                  blogs.image ? "lg:mx-0" : ""
                } mx-auto max-w-xl`}
              >
                {blogs.shortDesc}
              </p>
            )}

            {/* META */}

            <div
              className={`mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-500 dark:text-gray-400 ${
                blogs.image ? "lg:justify-start" : ""
              }`}
            >
              {authorName && (
                <span className="flex items-center gap-2">
                  <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-500 dark:bg-white/10">
                    {blogs.writtenByImage ? (
                      <Image
                        src={blogs.writtenByImage}
                        alt={authorName}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    ) : (
                      <FiUser size={13} />
                    )}
                  </span>

                  <span className="text-gray-900 dark:text-white">
                    {authorName}
                  </span>
                </span>
              )}

              {date && (
                <>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />

                  <span className="flex items-center gap-1.5">
                    <FiCalendar size={13} />
                    {date}
                  </span>
                </>
              )}

              <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />

              <span className="flex items-center gap-1.5">
                <FiClock size={13} />
                {readMinutes} min read
              </span>
            </div>
          </header>

          {/* HERO IMAGE */}

          {blogs.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-gray-100 shadow-[0_20px_60px_rgba(15,23,42,0.12)] ring-1 ring-black/5 dark:bg-[#111] dark:shadow-none dark:ring-white/10">
              <Image
                src={blogs.image}
                alt={blogs.title ?? "Blog image"}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </section>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_290px]">
          {/* ARTICLE */}

          <article className="min-w-0 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#111111] dark:shadow-none sm:p-8 lg:p-10">
            <div className="space-y-6 text-[15px] leading-8 text-gray-600 dark:text-gray-300">
              {/* TABLE OF CONTENTS (mobile / tablet) */}

              {showToc && (
                <details className="group rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/3 lg:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-[#997900] dark:text-[#ffd83d]">
                    In this article
                    <span className="text-base leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="mt-3">
                    <TableOfContents items={toc} onNavigate={expandArticle} />
                  </div>
                </details>
              )}

              <CollapsibleContent expanded={expanded} onToggle={toggleArticle}>
                {/* DESCRIPTION */}

                {articleHtml && (
                  <div
                    className={PROSE}
                    dangerouslySetInnerHTML={{ __html: articleHtml }}
                  />
                )}

                {/* QUICK TIPS */}

                {blogs.QuickTips && (
                  <div className="rounded-2xl border border-[#f0d770] bg-[#fffbea] p-5 dark:border-[#ffd83d]/20 dark:bg-[#ffd83d]/5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd83d] text-black">
                        <FiShare2 size={14} />
                      </div>

                      <p className="text-sm font-bold leading-6 text-gray-800 dark:text-gray-200">
                        Quick Tip
                      </p>
                    </div>

                    <div
                      className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_a]:text-blue-600 [&_a]:underline [&_strong]:font-bold"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtml(blogs.QuickTips),
                      }}
                    />
                  </div>
                )}

                {/* BLACK QUOTE */}

                {blogs.blackQuote && (
                  <blockquote className="relative overflow-hidden rounded-2xl bg-gray-950 px-6 py-7 text-white dark:bg-[#1a1a1a]">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-[#ffd83d]" />

                    <div className="pl-3 text-lg font-bold leading-8 sm:text-xl">
                      <span className="mr-1 text-[#ffd83d]">“</span>
                      <span
                        className="[&_p]:inline"
                        dangerouslySetInnerHTML={{
                          __html: cleanHtml(blogs.blackQuote),
                        }}
                      />
                      <span className="ml-1 text-[#ffd83d]">”</span>
                    </div>
                  </blockquote>
                )}
              </CollapsibleContent>

              {/* KEY POINTS */}

              {/* TAGS */}

              {blogTags.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-6 dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-extrabold text-gray-800 dark:text-gray-200">
                      Tags:
                    </span>

                    {blogTags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-500 dark:border-white/10 dark:bg-white/3 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SHARE */}

              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-white/3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  {/* <FiShare2
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />

                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Share this article
                  </span> */}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Share on Facebook"
                    onClick={shareFacebook}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-[#ffd83d] hover:bg-[#ffd83d] hover:text-black dark:border-white/10 dark:bg-[#151515] dark:text-gray-400"
                  >
                    <FiFacebook size={14} />
                  </button>

                  <button
                    type="button"
                    aria-label="Share on Twitter"
                    onClick={shareTwitter}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-[#ffd83d] hover:bg-[#ffd83d] hover:text-black dark:border-white/10 dark:bg-[#151515] dark:text-gray-400"
                  >
                    <FiTwitter size={14} />
                  </button>

                  <button
                    type="button"
                    aria-label="Share on LinkedIn"
                    onClick={shareLinkedIn}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-[#ffd83d] hover:bg-[#ffd83d] hover:text-black dark:border-white/10 dark:bg-[#151515] dark:text-gray-400"
                  >
                    <FiLinkedin size={14} />
                  </button>

                  <button
                    type="button"
                    aria-label="Share article"
                    onClick={shareNative}
                    className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-xs font-bold text-gray-600 transition hover:border-[#ffd83d] hover:bg-[#ffd83d] hover:text-black dark:border-white/10 dark:bg-[#151515] dark:text-gray-300"
                  >
                    <FiShare2 size={14} />
                    Share
                  </button>
                </div>
              </div>

              {/* AUTHOR */}

              <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 dark:border-white/10 sm:flex-row sm:items-center">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                  {blogs.writtenByImage ? (
                    <Image
                      src={blogs.writtenByImage}
                      alt={blogs.writtenBy ?? blogs.author ?? "Author"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <FiUser size={24} />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-400">
                    Written By
                  </p>

                  <h3 className="mt-1 text-base font-black text-gray-950 dark:text-white">
                    {blogs.writtenBy ?? blogs.author ?? "Admin"}
                  </h3>

                  {blogs.writtenByDesc && (
                    <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {blogs.writtenByDesc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* SIDEBAR */}

          <aside className="flex flex-col gap-5">
            {/* ARTICLE INFO */}

            <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111111]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#997900] dark:text-[#ffd83d]">
                Article Info
              </p>

              <div className="mt-4 space-y-4">
                {/* AUTHOR */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    <FiUser size={15} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400">
                      Author
                    </p>

                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {blogs.author ?? blogs.writtenBy ?? "Admin"}
                    </p>
                  </div>
                </div>

                {/* PUBLISHED */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    <FiCalendar size={15} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400">
                      Published
                    </p>

                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {date || "-"}
                    </p>
                  </div>
                </div>

                {/* CATEGORY */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    #
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400">
                      Category
                    </p>

                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {categoryName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ON THIS PAGE (desktop, stays visible while reading) */}

            {showToc && (
              <div className="hidden rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111111] lg:sticky lg:top-28 lg:block">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#997900] dark:text-[#ffd83d]">
                  On this page
                </p>

                <div className="max-h-[50vh] overflow-y-auto pr-1">
                  <TableOfContents items={toc} onNavigate={expandArticle} />
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* RELATED POSTS */}

        {relatedBlogs.length > 0 && (
          <section className="mt-12">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ffd83d]" />

                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#997900] dark:text-[#ffd83d]">
                  Keep Reading
                </span>
              </div>

              <h2 className="text-2xl font-black text-gray-950 dark:text-white">
                Related Articles
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((post) => {
                const postDate = formatDate(post.createdAt);

                const postCategory =
                  getCategoryName(post.category) || "Article";

                return (
                  <article
                    key={post._id}
                    className="group overflow-hidden rounded-[20px] border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
                  >
                    {/* IMAGE */}

                    <Link
                      href={`/blog/${post._id}`}
                      className="relative block h-47.5 overflow-hidden bg-gray-100 dark:bg-[#151515]"
                    >
                      {post.image && (
                        <Image
                          src={post.image}
                          alt={post.title ?? "Related article"}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-extrabold text-gray-800 shadow-sm dark:bg-black/80 dark:text-white">
                        {postCategory}
                      </span>
                    </Link>

                    {/* CONTENT */}

                    <div className="p-5">
                      {postDate && (
                        <p className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                          <FiCalendar size={12} />
                          {postDate}
                        </p>
                      )}

                      <Link href={`/blog/${post._id}`}>
                        <h3 className="mt-2 line-clamp-2 text-base font-black leading-6 text-gray-950 transition group-hover:text-[#a48200] dark:text-white dark:group-hover:text-[#ffd83d]">
                          {post.title ?? "Untitled Article"}
                        </h3>
                      </Link>

                      {post.shortDesc && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                          {post.shortDesc}
                        </p>
                      )}

                      <Link
                        href={`/blog/${post._id}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-gray-900 transition hover:text-[#a48200] dark:text-white dark:hover:text-[#ffd83d]"
                      >
                        Read Article
                        <FiArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default BlogDetails;
