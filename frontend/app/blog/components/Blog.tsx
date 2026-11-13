"use client";

import { useGetBlogQuery } from "@/store/blogApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiArrowRight, FiCalendar, FiFileText, FiUser } from "react-icons/fi";

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
  isDeleted?: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

type DateInput = string | Date | null | undefined;

/* ============================================================
   HELPERS
============================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isBlog = (value: unknown): value is Blog =>
  isRecord(value) && "_id" in value;

/** Supports: Blog[] | { data: Blog[] } | { blogs: Blog[] } */
const extractBlogList = (response: unknown): Blog[] => {
  if (Array.isArray(response)) return response.filter(isBlog);

  if (isRecord(response)) {
    if (Array.isArray(response.data)) return response.data.filter(isBlog);
    if (Array.isArray(response.blogs)) return response.blogs.filter(isBlog);
  }

  return [];
};

const getCategoryName = (category?: BlogCategory | string | null): string => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.categoryName ?? "";
};

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

/* ============================================================
   SMALL COMPONENTS
============================================================ */

const ImagePlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
    <FiFileText size={36} />
  </div>
);

const PageState = ({ message }: { message: string }) => (
  <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 dark:bg-[#080808]">
    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
  </main>
);

const FeaturedCard = ({ post }: { post: Blog }) => {
  const category = getCategoryName(post.category);
  const date = formatDate(post.createdAt);

  return (
    <Link
      href={`/blog/${post._id}`}
      className="group grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition hover:shadow-[0_14px_40px_rgba(15,23,42,0.09)] dark:border-white/10 dark:bg-[#111111] dark:shadow-none lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="relative min-h-70 overflow-hidden bg-gray-100 dark:bg-[#151515] sm:min-h-82.5">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title ?? "Featured article"}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <ImagePlaceholder />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

        {post.featured && (
          <span className="absolute left-5 top-5 rounded-full bg-[#ffd83d] px-3 py-1.5 text-[11px] font-extrabold text-black">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        {category && (
          <span className="w-fit rounded-full bg-[#fff6cd] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9a7900] dark:bg-[#ffd83d]/10 dark:text-[#ffd83d]">
            {category}
          </span>
        )}

        <h2 className="mt-4 text-2xl font-black leading-tight text-gray-950 transition group-hover:text-[#b18d00] dark:text-white dark:group-hover:text-[#ffd83d] sm:text-3xl">
          {post.title ?? "Untitled Article"}
        </h2>

        {post.shortDesc && (
          <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
            {post.shortDesc}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400 dark:text-gray-500">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <FiUser size={14} />
              {post.author}
            </span>
          )}

          {date && (
            <span className="flex items-center gap-1.5">
              <FiCalendar size={14} />
              {date}
            </span>
          )}
        </div>

        <div className="mt-7 flex items-center gap-2 text-sm font-extrabold text-gray-950 dark:text-white">
          Read Article
          <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

const BlogCard = ({ post }: { post: Blog }) => {
  const category = getCategoryName(post.category);
  const date = formatDate(post.createdAt);
  const href = `/blog/${post._id}`;

  return (
    <article className="group overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111111] dark:shadow-none dark:hover:border-white/20">
      <Link
        href={href}
        className="relative block h-55 overflow-hidden bg-gray-100 dark:bg-[#151515]"
      >
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title ?? "Blog image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

        {category && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-gray-800 shadow-sm backdrop-blur dark:bg-black/75 dark:text-white">
            {category}
          </span>
        )}
      </Link>

      <div className="p-5">
        {date && (
          <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <FiCalendar size={13} />
              {date}
            </span>
          </div>
        )}

        <Link href={href}>
          <h3 className="line-clamp-2 text-lg font-black leading-6 text-gray-950 transition-colors group-hover:text-[#b18d00] dark:text-white dark:group-hover:text-[#ffd83d]">
            {post.title ?? "Untitled Article"}
          </h3>
        </Link>

        {post.shortDesc && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {post.shortDesc}
          </p>
        )}

        <div className="my-4 h-px bg-gray-100 dark:bg-white/10" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
              <FiUser size={14} />
            </div>

            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
              {post.author ?? "Admin"}
            </span>
          </div>

          <Link
            href={href}
            className="flex items-center gap-1.5 text-xs font-extrabold text-gray-950 transition hover:text-[#b18d00] dark:text-white dark:hover:text-[#ffd83d]"
          >
            Read More
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ============================================================
   PAGE
============================================================ */

const Blog = () => {
  const { data, isLoading, isError } = useGetBlogQuery();

  const posts = React.useMemo(
    () => extractBlogList(data).filter((post) => !post.isDeleted),
    [data],
  );

  if (isLoading) return <PageState message="Loading..." />;
  if (isError) return <PageState message="Failed to load articles." />;

  /* Featured = first post marked featured, otherwise the first post */
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const otherPosts = posts.filter((post) => post._id !== featuredPost?._id);

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-8 transition-colors duration-300 dark:bg-[#080808] sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ffd83d]" />

              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a98400] dark:text-[#ffd83d]">
                Latest Articles
              </span>
            </div>

            <h1 className="font-serif text-2xl font-black tracking-tight text-gray-950 dark:text-white sm:text-3xl lg:text-[34px]">
              Blog & Articles
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              Discover useful guides, shopping tips, product insights and the
              latest trends.
            </p>
          </div>

          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-500 shadow-sm dark:border-white/10 dark:bg-[#111111] dark:text-gray-400">
            {posts.length} {posts.length === 1 ? "Article" : "Articles"}
          </div>
        </div>

        {/* EMPTY STATE */}
        {!featuredPost ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
              <FiFileText size={25} />
            </div>

            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              No articles yet
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please check back soon for new posts.
            </p>
          </div>
        ) : (
          <>
            {/* FEATURED */}
            <section className="mb-8">
              <FeaturedCard post={featuredPost} />
            </section>

            {/* GRID */}
            {otherPosts.length > 0 && (
              <section>
                <div className="mb-5">
                  <h2 className="text-xl font-black text-gray-950 dark:text-white sm:text-2xl">
                    Latest Posts
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Explore our latest stories and helpful guides.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {otherPosts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Blog;
