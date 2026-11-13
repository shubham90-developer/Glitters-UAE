"use client";

import { useGetBlogQuery } from "@/store/blogApi";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

type BlogItem = {
  _id: string;
  title: string;
  shortDesc: string;
  createdAt: string;
  image: string;
};
type DateInput = string | Date | null | undefined;
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

const HomeBlog = () => {
  const { data: blogs = [], isLoading, isError } = useGetBlogQuery();

  return (
    <section className="w-full bg-white py-5 dark:bg-[#111]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h2
              className="
                font-serif
                text-[14px]
                font-extrabold
                text-[#151515]
                sm:text-[22px]
                dark:text-white
              "
            >
              Blog & Article
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Explore the latest tech news, buying guides, tips, and expert
              insights.
            </p>
          </div>

          <Link
            href="/blog"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              bg-yellow-200
              px-4
              py-2
              text-[9px]
              font-bold
              text-black
              transition
              hover:text-[#b58b00]
              sm:text-[12px]
            "
          >
            View All Articles
            <FiArrowRight size={12} />
          </Link>
        </div>

        {/* CONTENT */}
        {isError ? (
          <p className="py-5 text-center text-sm text-red-500">
            Unable to load blogs.
          </p>
        ) : isLoading ? (
          /* SKELETON */
          <div
            className="
              no-scrollbar
              flex
              gap-3
              overflow-x-auto
              pb-1
              lg:grid
              lg:grid-cols-3
              lg:overflow-visible
            "
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        ) : blogs?.length > 0 ? (
          /* BLOGS */
          <div
            className="
              no-scrollbar
              flex
              gap-3
              overflow-x-auto
              pb-1
              lg:grid
              lg:grid-cols-3
              lg:overflow-visible
            "
          >
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="py-5 text-center text-sm text-gray-500">
            No blogs available.
          </p>
        )}
      </div>
    </section>
  );
};

/* BLOG SKELETON */
const BlogSkeleton = () => {
  return (
    <div
      className="
        flex
        min-h-20.5
        w-77.5
        shrink-0
        overflow-hidden
        rounded-xl
        border
        border-[#ededed]
        bg-white
        p-1
        sm:w-90
        md:w-100
        lg:w-auto
        dark:border-gray-800
        dark:bg-[#171717]
      "
    >
      {/* IMAGE */}
      <div
        className="
          h-18.5
          w-25
          shrink-0
          animate-pulse
          rounded-lg
          bg-gray-200
          sm:w-27.5
          dark:bg-gray-800
        "
      />

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-1">
        {/* DATE */}
        <div
          className="
            h-2
            w-12
            animate-pulse
            rounded
            bg-gray-200
            dark:bg-gray-800
          "
        />

        {/* TITLE */}
        <div
          className="
            mt-2
            h-3
            w-[85%]
            animate-pulse
            rounded
            bg-gray-200
            dark:bg-gray-800
          "
        />

        {/* DESCRIPTION */}
        <div
          className="
            mt-2
            h-2
            w-[70%]
            animate-pulse
            rounded
            bg-gray-200
            dark:bg-gray-800
          "
        />
      </div>
    </div>
  );
};

/* BLOG CARD */
const BlogCard = ({ blog }: { blog: BlogItem }) => {
  const description =
    blog.shortDesc?.length > 50
      ? `${blog.shortDesc.slice(0, 50)}...`
      : blog.shortDesc;

  return (
    <Link
      href={`/blog/${blog._id}`}
      className="
    group flex min-h-25 w-77.5 shrink-0
    items-center gap-2 overflow-hidden rounded-xl
    border border-[#ededed] bg-white p-1.5
    transition-all duration-300
    hover:border-[#ffe178]
    hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)]
    sm:w-90 md:w-100 lg:w-auto
    dark:border-gray-800 dark:bg-[#171717]
  "
    >
      {/* IMAGE */}
      <div
        className="
    relative h-20.5 w-25 shrink-0
    overflow-hidden rounded-lg bg-[#f5f5f5]
    sm:w-27.5
  "
      >
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="110px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-1">
        <span className="text-[10px] leading-tight font-medium text-gray-900 sm:text-[12px]">
          {formatDate(blog.createdAt)}
        </span>

        <h3
          className="
      line-clamp-2 text-[12px] leading-4
      font-bold text-[#1c1c1c]
      transition group-hover:text-[#b58b00]
      sm:text-[14px] sm:leading-4.5
      dark:text-white
    "
        >
          {blog.title}
        </h3>

        <p
          className="
      line-clamp-1 text-[10px] leading-3.5
      text-gray-600 sm:text-[12px]
      dark:text-gray-400
    "
        >
          {description}
        </p>
      </div>
    </Link>
  );
};

export default HomeBlog;
