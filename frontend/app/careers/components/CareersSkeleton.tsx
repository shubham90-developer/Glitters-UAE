import React from "react";

/* Shared building blocks */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

const Bone = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700/60 ${className}`}
  />
);

const DarkBone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-700/60 ${className}`} />
);

const BenefitSkeleton = () => (
  <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-[#fafafa] p-3 dark:border-gray-700 dark:bg-[#202020]">
    <Bone className="h-8 w-8 shrink-0 rounded-lg" />
    <Bone className="h-3 w-28" />
  </div>
);

const JobCardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4 dark:border-gray-700 dark:bg-[#202020]">
    <Bone className="h-9 w-9 rounded-lg" />
    <Bone className="mt-3 h-3 w-20" />
    <Bone className="mt-2 h-4 w-48" />
    <Bone className="mt-3 h-3 w-full" />
    <Bone className="mt-1.5 h-3 w-4/5" />
    <div className="mt-3 flex flex-wrap gap-1.5">
      <Bone className="h-6 w-20 rounded-full" />
      <Bone className="h-6 w-16 rounded-full" />
      <Bone className="h-6 w-24 rounded-full" />
    </div>
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
      <Bone className="h-3 w-28" />
      <Bone className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

const ProcessStepSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4 dark:border-gray-700 dark:bg-[#202020]">
    <Bone className="h-8 w-8 rounded-lg" />
    <Bone className="mt-3 h-4 w-24" />
    <Bone className="mt-2 h-3 w-full" />
    <Bone className="mt-1.5 h-3 w-3/4" />
  </div>
);

/* Page skeleton — mirrors the Careers layout */

const CareersSkeleton = () => (
  <main
    className="min-h-screen bg-[#f7f7f8] py-4 dark:bg-[#0f0f0f] sm:py-6 lg:py-8"
    aria-busy="true"
    aria-label="Loading careers"
  >
    <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
      {/* HERO */}
      <section
        className={`${CARD} px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14`}
      >
        <div className="max-w-180">
          <Bone className="h-5 w-32 rounded-full" />
          <Bone className="mt-4 h-8 w-4/5 sm:h-10" />
          <Bone className="mt-2 h-8 w-1/2 sm:h-10" />
          <Bone className="mt-4 h-3 w-full max-w-162.5" />
          <Bone className="mt-2 h-3 w-5/6 max-w-162.5" />
          <Bone className="mt-5 h-10 w-44 rounded-xl" />
        </div>
      </section>

      {/* BENEFITS + CULTURE */}
      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={`${CARD} p-4 sm:p-5 lg:p-6`}>
          <Bone className="h-3 w-24" />
          <Bone className="mt-2 h-5 w-48" />
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <BenefitSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#181818] p-4 sm:p-5 lg:p-6">
          <DarkBone className="h-9 w-9 rounded-lg" />
          <DarkBone className="mt-3 h-5 w-44" />
          <DarkBone className="mt-3 h-3 w-full" />
          <DarkBone className="mt-2 h-3 w-4/5" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <DarkBone className="h-5 w-5 shrink-0 rounded-full" />
                <DarkBone className="h-3 w-48" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Bone className="h-3 w-16" />
            <Bone className="mt-2 h-5 w-40" />
            <Bone className="mt-2 h-3 w-24" />
          </div>
          <Bone className="h-10 w-full rounded-lg sm:w-70" />
        </div>

        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={i} className="h-9 w-24 shrink-0 rounded-lg" />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
        <div className="flex flex-col items-center">
          <Bone className="h-3 w-24" />
          <Bone className="mt-2 h-5 w-56" />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProcessStepSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#181818] px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
        <div>
          <DarkBone className="h-5 w-52" />
          <DarkBone className="mt-2 h-3 w-72 max-w-full" />
        </div>
        <DarkBone className="h-10 w-36 rounded-xl" />
      </section>
    </div>
  </main>
);

export default CareersSkeleton;