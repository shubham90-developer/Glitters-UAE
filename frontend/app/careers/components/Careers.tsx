"use client";

import React, { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiCoffee,
} from "react-icons/fi";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { useGetCareerInfoQuery } from "@/store/careerinfoApi";
import { useGetCurrentOpeningsQuery } from "@/store/currentOpeningsApi";
import CareersSkeleton from "./CareersSkeleton";

/* ============================================================
   TYPES
============================================================ */

type RawItem =
  | string
  | {
      title?: string;
      name?: string;
      text?: string;
      description?: string;
      desc?: string;
    }
  | null
  | undefined;

interface CareerInfo {
  _id: string;
  badgeText?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroDescription?: string;
  benefitsLabel?: string;
  benefitsTitle?: string;
  employeeBenefits?: RawItem[];
  cultureTitle?: string;
  cultureDescription?: string;
  culturePoints?: RawItem[];
  hiringProcessLabel?: string;
  hiringProcessTitle?: string;
  hiringProcess?: RawItem[];
  isDeleted?: boolean;
}

interface Job {
  _id: string;
  jobID?: string;
  jobTitle?: string;
  shortDesc?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  dept?: string;
  roles?: string;
  salary?: string;
  openings?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  isDeleted?: boolean;
  createdAt?: string | Date | null;
}

interface Item {
  title: string;
  text: string;
}

/* ============================================================
   HELPERS
============================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasId = (value: unknown): boolean => isRecord(value) && "_id" in value;

/** Supports: T[] | { data: T[] } | { data: T } | T */
const extractList = <T,>(response: unknown): T[] => {
  if (Array.isArray(response)) return response.filter(hasId) as T[];

  if (isRecord(response)) {
    if (Array.isArray(response.data)) return response.data.filter(hasId) as T[];
    if (hasId(response.data)) return [response.data as T];
    if (hasId(response)) return [response as T];
  }

  return [];
};

/** Converts a string or object item from the API into { title, text }. */
const toItem = (raw: RawItem): Item | null => {
  if (!raw) return null;

  if (typeof raw === "string") {
    return raw.trim() ? { title: raw.trim(), text: "" } : null;
  }

  const title = raw.title ?? raw.name ?? "";
  const text = raw.text ?? raw.description ?? raw.desc ?? "";

  return title || text ? { title, text } : null;
};

const toItems = (list?: RawItem[]): Item[] =>
  (list ?? []).map(toItem).filter((item): item is Item => item !== null);

const parseDate = (value?: string | Date | null): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = value.trim();

  /* DD/MM/YYYY or DD-MM-YYYY */
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);

  if (match) {
    const [, day, month, year] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(text);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value?: string | Date | null): string => {
  const date = parseDate(value);

  if (!date || Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });

  return `${day} ${month} ${date.getFullYear()}`;
};

/* ============================================================
   SHARED STYLES
============================================================ */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

const SECTION_LABEL =
  "text-[12px] font-bold uppercase tracking-[1px] text-[#9b7600] dark:text-[#ffd83d]";

const YELLOW_BTN =
  "flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#ffd83d] px-5 font-serif text-[9px] font-extrabold text-black transition hover:bg-[#ffcf12]";

const BENEFIT_ICONS = [
  <FiDollarSign key="d" size={14} />,
  <FiClock key="c" size={14} />,
  <FiShield key="s" size={14} />,
  <FiCoffee key="co" size={14} />,
  <FiTrendingUp key="t" size={14} />,
  <FiStar key="st" size={14} />,
];

/* ============================================================
   PAGE
============================================================ */

const Careers = () => {
  const {
    data: careerResponse,
    isLoading: careerLoading,
    isError: careerError,
  } = useGetCareerInfoQuery();

  const {
    data: jobsResponse,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useGetCurrentOpeningsQuery();

  const [department, setDepartment] = useState("All");
  const [search, setSearch] = useState("");

  const career = useMemo(
    () =>
      extractList<CareerInfo>(careerResponse).find((item) => !item.isDeleted) ??
      null,
    [careerResponse],
  );

  const jobs = useMemo(
    () => extractList<Job>(jobsResponse).filter((job) => !job.isDeleted),
    [jobsResponse],
  );

  const departments = useMemo(() => {
    const unique = new Set<string>();

    jobs.forEach((job) => {
      if (job.dept?.trim()) unique.add(job.dept.trim());
    });

    return ["All", ...Array.from(unique)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const departmentMatch =
        department === "All" || job.dept?.trim() === department;

      const searchMatch =
        !query ||
        (job.jobTitle ?? "").toLowerCase().includes(query) ||
        (job.dept ?? "").toLowerCase().includes(query) ||
        (job.location ?? "").toLowerCase().includes(query);

      return departmentMatch && searchMatch;
    });
  }, [jobs, department, search]);

  /* ---------- STATES ---------- */

  if (careerLoading || jobsLoading) return <CareersSkeleton />;

  if (careerError || !career) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] dark:bg-[#0f0f0f]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Careers information is not available right now.
        </p>
      </main>
    );
  }

  /* ---------- DERIVED DATA ---------- */

  const benefits = toItems(career.employeeBenefits);
  const culturePoints = toItems(career.culturePoints);
  const hiringSteps = toItems(career.hiringProcess);

  /* ---------- RENDER ---------- */

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-4 dark:bg-[#0f0f0f] sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
        {/* ================= HERO ================= */}
        <section
          className={`${CARD} relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14`}
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffd83d]/15 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-7 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="max-w-180">
              {career.badgeText && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6ce] px-2.5 py-1 text-[8px] font-bold text-[#806300] dark:bg-[#2b260f] dark:text-[#ffd83d] sm:text-[9px]">
                  <FiBriefcase size={11} />
                  {career.badgeText}
                </span>
              )}

              <h1 className="mt-3 font-serif text-[24px] font-extrabold leading-tight text-black dark:text-white sm:text-[30px] lg:text-[38px]">
                {career.heroTitle}{" "}
                {career.heroHighlight && (
                  <span className="text-[#b38900] dark:text-[#ffd83d]">
                    {career.heroHighlight}
                  </span>
                )}
              </h1>

              {career.heroDescription && (
                <p className="mt-3 max-w-162.5 text-[9px] leading-5 text-gray-900 dark:text-gray-400 sm:text-[10px] lg:text-[12px]">
                  {career.heroDescription}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <ThemeBtnOne
                  text="View Open Positions"
                  icon={<FiArrowRight size={11} />}
                  url="#open-positions"
                  className={YELLOW_BTN}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= BENEFITS + CULTURE ================= */}
        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* BENEFITS */}
          <div className={`${CARD} p-4 sm:p-5 lg:p-6`}>
            {career.benefitsLabel && (
              <span className={SECTION_LABEL}>{career.benefitsLabel}</span>
            )}

            {career.benefitsTitle && (
              <h2 className="mt-1 font-serif text-[17px] font-extrabold text-black dark:text-white">
                {career.benefitsTitle}
              </h2>
            )}

            {benefits.length > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {benefits.map((item, index) => (
                  <SmallBenefit
                    key={`${item.title}-${index}`}
                    icon={BENEFIT_ICONS[index % BENEFIT_ICONS.length]}
                    title={item.title || item.text}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CULTURE */}
          <div className="relative overflow-hidden rounded-2xl bg-[#181818] p-4 sm:p-5 lg:p-6">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#ffd83d]/15 blur-3xl" />

            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffd83d] text-black">
                <FiUsers size={17} />
              </div>

              {career.cultureTitle && (
                <h2 className="mt-3 font-serif text-[17px] font-extrabold text-white">
                  {career.cultureTitle}
                </h2>
              )}

              {career.cultureDescription && (
                <p className="mt-2 text-[8px] leading-4 text-gray-400 sm:text-[12px]">
                  {career.cultureDescription}
                </p>
              )}

              {culturePoints.length > 0 && (
                <div className="mt-4 space-y-2">
                  {culturePoints.map((item, index) => (
                    <CultureItem
                      key={`${item.title}-${index}`}
                      text={item.title || item.text}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= OPEN POSITIONS ================= */}
        <section
          id="open-positions"
          className={`${CARD} mt-4 scroll-mt-25 p-4 sm:p-5 lg:p-6`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className={SECTION_LABEL}>Careers</span>

              <h2 className="mt-1 font-serif text-[17px] font-extrabold text-black dark:text-white sm:text-[20px]">
                Open Positions
              </h2>

              <p className="mt-1 text-[10px] text-gray-400">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "role" : "roles"} available
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex h-10 w-full items-center rounded-lg border border-gray-200 bg-[#fafafa] px-3 focus-within:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020] sm:w-70">
              <FiSearch size={13} className="shrink-0 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-[9px] text-black outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </div>

          {/* DEPARTMENTS */}
          {departments.length > 1 && (
            <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-1">
              {departments.map((item) => {
                const active = item === department;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDepartment(item)}
                    className={`h-9 shrink-0 cursor-pointer rounded-lg border px-3 text-[12px] font-bold transition ${
                      active
                        ? "border-[#ffd83d] bg-[#ffd83d] text-black"
                        : "border-gray-200 bg-white text-gray-500 hover:border-[#ffd83d] hover:text-black dark:border-gray-700 dark:bg-[#202020] dark:text-gray-300"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          )}

          {/* JOB LIST */}
          {jobsError ? (
            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Failed to load job openings.
            </p>
          ) : filteredJobs.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="mt-5 flex min-h-62.5 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-[#fafafa] text-center dark:border-gray-700 dark:bg-[#202020]">
              <FiSearch size={22} className="text-gray-300" />

              <p className="mt-3 font-serif text-[13px] font-bold text-black dark:text-white">
                No jobs found
              </p>

              <p className="mt-1 text-[8px] text-gray-400">
                Try another department or keyword.
              </p>
            </div>
          )}
        </section>

        {/* ================= HIRING PROCESS ================= */}
        {hiringSteps.length > 0 && (
          <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
            <div className="text-center">
              {career.hiringProcessLabel && (
                <span className={SECTION_LABEL}>
                  {career.hiringProcessLabel}
                </span>
              )}

              {career.hiringProcessTitle && (
                <h2 className="mt-1 font-serif text-[17px] font-extrabold text-black dark:text-white sm:text-[20px]">
                  {career.hiringProcessTitle}
                </h2>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {hiringSteps.map((step, index) => (
                <ProcessStep
                  key={`${step.title}-${index}`}
                  number={String(index + 1).padStart(2, "0")}
                  title={step.title}
                  text={step.text}
                />
              ))}
            </div>
          </section>
        )}

        {/* ================= FINAL CTA ================= */}
        <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#181818] px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div>
            <h2 className="font-serif text-[15px] font-extrabold text-white sm:text-[17px]">
              Don&apos;t see the right role?
            </h2>

            <p className="mt-1 text-[8px] text-gray-400 sm:text-[9px]">
              Send your resume to our HR team and we&apos;ll keep your profile
              for future opportunities.
            </p>
          </div>

          <ThemeBtnOne
            text="Send Your Resume"
            url="mailto:info@glittersuae.com"
            icon={<FiArrowRight size={11} />}
            className={`${YELLOW_BTN} shrink-0`}
          />
        </section>
      </div>
    </main>
  );
};

/* ============================================================
   SMALL COMPONENTS
============================================================ */

const SmallBenefit = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-[#fafafa] p-3 dark:border-gray-700 dark:bg-[#202020]">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
      {icon}
    </span>

    <span className="text-[8px] font-bold text-gray-700 dark:text-gray-300 sm:text-[12px]">
      {title}
    </span>
  </div>
);

const CultureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffd83d] text-black">
      <FiCheckCircle size={10} />
    </span>

    <span className="text-[8px] text-gray-300 sm:text-[12px]">{text}</span>
  </div>
);

const JobBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-[#181818] dark:text-gray-400">
    {icon}
    {text}
  </span>
);

const JobCard = ({ job }: { job: Job }) => {
  const postedOn = formatDate(job.createdAt);

  return (
    <article className="group relative rounded-xl border border-gray-200 bg-[#fafafa] p-4 transition-all hover:border-[#ffd83d] hover:shadow-[0_7px_22px_rgba(0,0,0,0.05)] dark:border-gray-700 dark:bg-[#202020]">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
        <FiBriefcase size={15} />
      </div>

      {job.dept && (
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.7px] text-[#9b7600] dark:text-[#ffd83d]">
          {job.dept}
        </p>
      )}

      <h3 className="mt-1 font-serif text-[14px] font-extrabold text-black dark:text-white">
        {job.jobTitle ?? "Untitled Role"}
      </h3>

      {job.shortDesc && (
        <p className="mt-2 text-[10px] leading-4 text-gray-500 dark:text-gray-400">
          {job.shortDesc}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.location && (
          <JobBadge icon={<FiMapPin size={9} />} text={job.location} />
        )}

        {job.jobType && (
          <JobBadge icon={<FiClock size={9} />} text={job.jobType} />
        )}

        {job.experience && (
          <JobBadge icon={<FiTrendingUp size={9} />} text={job.experience} />
        )}

        {job.salary && (
          <JobBadge icon={<FiDollarSign size={9} />} text={job.salary} />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
        <span className="text-[10px] text-gray-400">
          {postedOn ? `Posted ${postedOn}` : "Posted recently"}
        </span>

        <ThemeBtnOne
          text="Apply Now"
          icon={<FiArrowRight size={9} />}
          url={`/careers/${job._id}`}
          className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#ffd83d] px-3 text-[8px] font-extrabold text-black transition hover:bg-[#ffcf12]"
        />
      </div>
    </article>
  );
};

const ProcessStep = ({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) => (
  <div className="relative rounded-xl border border-gray-200 bg-[#fafafa] p-4 dark:border-gray-700 dark:bg-[#202020]">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffd83d] text-[8px] font-extrabold text-black">
      {number}
    </span>

    <h3 className="mt-3 font-serif text-[12px] font-bold text-black dark:text-white">
      {title}
    </h3>

    {text && <p className="mt-1 text-[10px] leading-4 text-gray-400">{text}</p>}
  </div>
);

export default Careers;
