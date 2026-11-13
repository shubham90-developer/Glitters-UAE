import React from "react";

/* Shared building blocks */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

const Bone = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700/60 ${className}`}
  />
);

const MiniCardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-[#181818]">
    <Bone className="h-8 w-8 rounded-lg" />
    <Bone className="mt-3 h-4 w-14" />
    <Bone className="mt-2 h-3 w-20" />
  </div>
);

const StatSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-[#181818] sm:p-4">
    <Bone className="h-5 w-16" />
    <Bone className="mt-2 h-3 w-24" />
    <Bone className="mt-2 h-3 w-full" />
  </div>
);

const IconCardSkeleton = ({ center = false }: { center?: boolean }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-[#fafafa] p-3 dark:border-gray-700 dark:bg-[#202020] sm:p-4 ${
      center ? "flex flex-col items-center" : ""
    }`}
  >
    <Bone className={`h-9 w-9 ${center ? "rounded-full" : "rounded-lg"}`} />
    <Bone className="mt-3 h-4 w-24" />
    <Bone className="mt-2 h-3 w-full" />
    <Bone className="mt-1.5 h-3 w-4/5" />
  </div>
);

const StoryPointSkeleton = () => (
  <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-[#fafafa] p-3 dark:border-gray-700 dark:bg-[#202020]">
    <Bone className="h-5 w-5 shrink-0 rounded-full" />
    <div className="w-full">
      <Bone className="h-3.5 w-28" />
      <Bone className="mt-2 h-3 w-full" />
    </div>
  </div>
);

/* Page skeleton — mirrors the AboutUs layout */

const AboutUsSkeleton = () => (
  <main
    className="min-h-screen bg-[#f7f7f8] py-4 dark:bg-[#0f0f0f] sm:py-6 lg:py-8"
    aria-busy="true"
    aria-label="Loading about us"
  >
    <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
      {/* HERO */}
      <section
        className={`${CARD} px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-14`}
      >
        <div className="grid grid-cols-1 items-center gap-7 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_480px]">
          <div className="max-w-180">
            <Bone className="h-5 w-32 rounded-full" />
            <Bone className="mt-4 h-8 w-4/5 sm:h-10" />
            <Bone className="mt-2 h-8 w-3/5 sm:h-10" />
            <Bone className="mt-4 h-3 w-full max-w-162.5" />
            <Bone className="mt-2 h-3 w-5/6 max-w-162.5" />
            <div className="mt-5 flex gap-2">
              <Bone className="h-10 w-36 rounded-xl" />
              <Bone className="h-10 w-28 rounded-xl" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4 dark:border-gray-700 dark:bg-[#202020] sm:p-5">
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <MiniCardSkeleton key={i} />
              ))}
            </div>
            <Bone className="mt-3 h-16 w-full rounded-xl" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </section>

      {/* STORY */}
      <section
        className={`${CARD} mt-4 grid grid-cols-1 overflow-hidden lg:grid-cols-[420px_minmax(0,1fr)] xl:grid-cols-[480px_minmax(0,1fr)]`}
      >
        <div className="min-h-65 animate-pulse bg-gray-200 dark:bg-gray-700/60 sm:min-h-80 lg:min-h-full" />

        <div className="p-4 sm:p-6 lg:p-8">
          <Bone className="h-3 w-24" />
          <Bone className="mt-3 h-6 w-2/3" />
          <Bone className="mt-4 h-3 w-full" />
          <Bone className="mt-2 h-3 w-full" />
          <Bone className="mt-2 h-3 w-3/4" />
          <Bone className="mt-4 h-3 w-full" />
          <Bone className="mt-2 h-3 w-5/6" />
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <StoryPointSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
        <Bone className="h-3 w-20" />
        <Bone className="mt-2 h-5 w-56" />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <IconCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
        <div className="flex flex-col items-center">
          <Bone className="h-3 w-24" />
          <Bone className="mt-2 h-5 w-64" />
          <Bone className="mt-2 h-3 w-80 max-w-full" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <IconCardSkeleton key={i} center />
          ))}
        </div>
      </section>

      {/* PROMISE + SUPPORT */}
      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={`${CARD} p-4 sm:p-5 lg:p-6`}>
          <Bone className="h-9 w-9 rounded-lg" />
          <Bone className="mt-3 h-5 w-48" />
          <Bone className="mt-3 h-3 w-full" />
          <Bone className="mt-2 h-3 w-4/5" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Bone className="h-5 w-5 shrink-0 rounded-full" />
                <Bone className="h-3 w-48" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#181818] p-4 sm:p-5 lg:p-6">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-700/60" />
          <div className="mt-3 h-5 w-40 animate-pulse rounded-md bg-gray-700/60" />
          <div className="mt-3 h-3 w-full max-w-125 animate-pulse rounded-md bg-gray-700/60" />
          <div className="mt-2 h-3 w-3/4 animate-pulse rounded-md bg-gray-700/60" />
          <div className="mt-5 h-10 w-40 animate-pulse rounded-xl bg-gray-700/60" />
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-5 dark:border-gray-800 dark:bg-[#181818] sm:flex-row sm:px-6 lg:px-8">
        <div>
          <Bone className="h-5 w-48" />
          <Bone className="mt-2 h-3 w-72 max-w-full" />
        </div>
        <Bone className="h-10 w-28 rounded-xl" />
      </section>
    </div>
  </main>
);

export default AboutUsSkeleton;