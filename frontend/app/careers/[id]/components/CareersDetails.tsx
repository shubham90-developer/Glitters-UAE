"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiMail,
  FiMapPin,
  FiSend,
  FiTrendingUp,
  FiUpload,
  FiUsers,
} from "react-icons/fi";

import { useCreateCareerMutation } from "@/store/careerEnquiriesApi";
import { useGetCurrentOpeningsByIdQuery } from "@/store/currentOpeningsApi";
import { useGetSettingsQuery } from "@/store/settingApi";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";

/* ============================================================
   TYPES
============================================================ */

type DateInput = string | Date | null | undefined;

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

interface ApplyFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPosition: string;
  experience: string;
  currentLocation: string;
  expectedSalary: string;
  linkedIn: string;
  coverLetter: string;
}

type FormField = keyof ApplyFormData;

const INITIAL_FORM: ApplyFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  currentPosition: "",
  experience: "",
  currentLocation: "",
  expectedSalary: "",
  linkedIn: "",
  coverLetter: "",
};

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/* ============================================================
   HELPERS
============================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isJob = (value: unknown): value is Job =>
  isRecord(value) && "_id" in value;

/** Supports: Job | { data: Job } | { job: Job } */
const extractJob = (response: unknown): Job | null => {
  if (!isRecord(response)) return null;

  if (isJob(response.data)) return response.data;
  if (isJob(response.job)) return response.job;
  if (isJob(response)) return response;

  return null;
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

const scrollToApplyForm = () => {
  window.setTimeout(() => {
    document.getElementById("apply-job")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

const getErrorMessage = (error: unknown): string => {
  if (isRecord(error)) {
    const data = error.data;

    if (isRecord(data) && typeof data.message === "string") {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
};

/* ============================================================
   SHARED STYLES
============================================================ */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

const YELLOW_BTN =
  "flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#ffd83d] px-5 font-serif text-[9px] font-extrabold text-black transition hover:bg-[#ffcf12] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11";

const LABEL =
  "mb-1.5 block font-serif text-[12px] font-semibold text-gray-900 dark:text-gray-300";

const INPUT =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[9px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020] dark:text-white sm:h-11";

const RICH_TEXT = "text-[12px] leading-6 text-gray-600 dark:text-gray-300";

/* ============================================================
   PAGE
============================================================ */

const CareersDetails = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  /* ---------- API ---------- */

  const {
    data: response,
    isLoading,
    isError,
  } = useGetCurrentOpeningsByIdQuery(id ?? "", { skip: !id });

  const { data: settings } = useGetSettingsQuery();

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateCareerMutation();

  /* ---------- STATE ---------- */

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplyFormData>(INITIAL_FORM);
  const [resume, setResume] = useState<File | null>(null);

  /* ---------- DERIVED ---------- */

  const job = useMemo(() => extractJob(response), [response]);

  const hrEmail = useMemo(() => {
    const raw = settings as unknown;

    const record = Array.isArray(raw)
      ? raw[0]
      : ((raw as { data?: unknown })?.data ?? raw);

    const email = (record as { alternateEmail?: string } | undefined)
      ?.alternateEmail;

    return email?.trim() || "";
  }, [settings]);

  /* ---------- HANDLERS ---------- */

  const openApplyForm = () => {
    setShowApplyForm(true);
    scrollToApplyForm();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setResume(null);
      return;
    }

    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      toast.error("Please upload a PDF, DOC or DOCX file");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      toast.error("Resume must be smaller than 5 MB");
      e.target.value = "";
      return;
    }

    setResume(file);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!job) return;

    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }

    const body = new FormData();

    body.append("jobId", job._id);
    body.append("jobID", job.jobID ?? "");
    body.append("jobTitle", job.jobTitle ?? "");

    (Object.keys(formData) as FormField[]).forEach((key) => {
      body.append(key, formData[key].trim());
    });

    body.append("resume", resume);

    try {
      await createEnquiry(body).unwrap();

      toast.success("Application submitted successfully");
      setFormData(INITIAL_FORM);
      setResume(null);
      setSubmitted(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  /* ---------- STATES ---------- */

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] dark:bg-[#0f0f0f]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </main>
    );
  }

  if (isError || !job || job.isDeleted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f8] px-4 dark:bg-[#0f0f0f]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This job is not available or has been removed.
        </p>

        <Link
          href="/careers"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffd83d] px-4 py-2 text-xs font-bold text-black"
        >
          <FiArrowLeft size={12} />
          Back to Careers
        </Link>
      </main>
    );
  }

  /* ---------- DERIVED DATA ---------- */

  const postedOn = formatDate(job.createdAt);

  const metaItems = [
    { icon: <FiMapPin size={10} />, text: job.location },
    { icon: <FiClock size={10} />, text: job.jobType },
    { icon: <FiTrendingUp size={10} />, text: job.experience },
    { icon: <FiUsers size={10} />, text: job.dept },
  ];

  const overviewItems = [
    { icon: <FiBriefcase size={12} />, label: "Department", value: job.dept },
    { icon: <FiMapPin size={12} />, label: "Location", value: job.location },
    { icon: <FiClock size={12} />, label: "Job Type", value: job.jobType },
    {
      icon: <FiTrendingUp size={12} />,
      label: "Experience",
      value: job.experience,
    },
    { icon: <FiDollarSign size={12} />, label: "Salary", value: job.salary },
    { icon: <FiUsers size={12} />, label: "Openings", value: job.openings },
  ];

  const sections = [
    {
      title: "About the Role",
      icon: <FiBriefcase size={15} />,
      html: job.roles,
    },
    {
      title: "Key Responsibilities",
      icon: <FiCheckCircle size={15} />,
      html: job.responsibilities,
    },
    {
      title: "Requirements",
      icon: <FiFileText size={15} />,
      html: job.requirements,
    },
    {
      title: "Good to Have",
      icon: <FiTrendingUp size={15} />,
      html: job.benefits,
    },
  ];

  /* ---------- RENDER ---------- */

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-4 dark:bg-[#0f0f0f] sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
        {/* BACK */}
        <div className="mb-4">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-[8px] font-bold text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white sm:text-[9px]"
          >
            <FiArrowLeft size={11} />
            Back to Careers
          </Link>
        </div>

        {/* ================= HERO ================= */}
        <section
          className={`${CARD} relative overflow-hidden p-4 sm:p-6 lg:p-8`}
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ffd83d]/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-200">
              <div className="flex flex-wrap items-center gap-2">
                {job.dept && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff6ce] px-2.5 py-1 text-[7px] font-bold text-[#806300] dark:bg-[#2b260f] dark:text-[#ffd83d] sm:text-[10px]">
                    <FiBriefcase size={10} />
                    {job.dept}
                  </span>
                )}

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[7px] font-bold text-green-600 dark:bg-green-500/10 sm:text-[10px]">
                  Hiring Now
                </span>
              </div>

              <h1 className="mt-3 font-serif text-[22px] font-extrabold leading-tight text-black dark:text-white sm:text-[28px] lg:text-[34px]">
                {job.jobTitle ?? "Untitled Role"}
              </h1>

              {job.shortDesc && (
                <p className="mt-2 max-w-175 text-[9px] leading-5 text-gray-500 dark:text-gray-400 sm:text-[10px] lg:text-[11px]">
                  {job.shortDesc}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {metaItems.map((item, index) => (
                  <JobMeta key={index} icon={item.icon} text={item.text} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={openApplyForm}
              className={YELLOW_BTN}
            >
              Apply for this Job
              <FiArrowRight size={11} />
            </button>
          </div>
        </section>

        {/* ================= MAIN ================= */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
          {/* LEFT */}
          <div className="min-w-0 space-y-4">
            {sections.map(
              (section) =>
                section.html?.trim() && (
                  <JobSection
                    key={section.title}
                    title={section.title}
                    icon={section.icon}
                  >
                    <div
                      className={RICH_TEXT}
                      dangerouslySetInnerHTML={{ __html: section.html }}
                    />
                  </JobSection>
                ),
            )}

            {/* APPLY FORM */}
            {showApplyForm && (
              <section
                id="apply-job"
                className={`${CARD} scroll-mt-27.5 p-4 sm:p-5 lg:p-6`}
              >
                {!submitted ? (
                  <>
                    <div className="mb-5">
                      <h2 className="font-serif text-[16px] font-extrabold text-black dark:text-white sm:text-[18px]">
                        Apply for {job.jobTitle ?? "this role"}
                      </h2>

                      <p className="mt-1 text-[8px] text-gray-400 sm:text-[10px]">
                        Fill in your details and submit your application.
                      </p>
                    </div>

                    <form
                      onSubmit={handleFormSubmit}
                      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      <CareerInput
                        name="firstName"
                        label="First Name"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />

                      <CareerInput
                        name="lastName"
                        label="Last Name"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />

                      <CareerInput
                        name="email"
                        label="Email Address"
                        placeholder="example@email.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />

                      <CareerInput
                        name="phone"
                        label="Phone Number"
                        placeholder="+971 50 123 4567"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                      />

                      <CareerInput
                        name="currentPosition"
                        label="Current Position"
                        placeholder="Frontend Developer"
                        value={formData.currentPosition}
                        onChange={handleChange}
                      />

                      <CareerInput
                        name="experience"
                        label="Experience"
                        placeholder="Example: 3 Years"
                        value={formData.experience}
                        onChange={handleChange}
                      />

                      <CareerInput
                        name="currentLocation"
                        label="Current Location"
                        placeholder="Dubai, UAE"
                        value={formData.currentLocation}
                        onChange={handleChange}
                      />

                      <CareerInput
                        name="expectedSalary"
                        label="Expected Salary"
                        placeholder="Enter expected salary"
                        required={false}
                        value={formData.expectedSalary}
                        onChange={handleChange}
                      />

                      <div className="sm:col-span-2">
                        <CareerInput
                          name="linkedIn"
                          label="LinkedIn / Portfolio URL"
                          placeholder="https://..."
                          type="url"
                          required={false}
                          value={formData.linkedIn}
                          onChange={handleChange}
                        />
                      </div>

                      {/* RESUME */}
                      <div className="sm:col-span-2">
                        <span className={LABEL}>Upload Resume</span>

                        <label className="flex min-h-25 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#fafafa] px-4 text-center transition hover:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020]">
                          <FiUpload size={18} className="text-gray-400" />

                          <p className="mt-2 break-all text-[8px] font-bold text-black dark:text-white">
                            {resume ? resume.name : "Click to upload resume"}
                          </p>

                          <p className="mt-0.5 text-[7px] text-gray-400">
                            PDF, DOC or DOCX (max 5 MB)
                          </p>

                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleResumeChange}
                          />
                        </label>
                      </div>

                      {/* COVER LETTER */}
                      <div className="sm:col-span-2">
                        <label htmlFor="cover-letter" className={LABEL}>
                          Cover Letter
                          <span className="ml-1 font-normal text-gray-400">
                            (Optional)
                          </span>
                        </label>

                        <textarea
                          id="cover-letter"
                          name="coverLetter"
                          rows={5}
                          value={formData.coverLetter}
                          onChange={handleChange}
                          placeholder="Tell us why you would be a good fit for this role..."
                          className="w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-[9px] leading-4 text-black outline-none placeholder:text-gray-400 focus:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020] dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex cursor-pointer items-start gap-2">
                          <input
                            required
                            type="checkbox"
                            className="mt-0.5 h-3.5 w-3.5 accent-[#ffd83d]"
                          />

                          <span className="max-w-125 text-[10px] leading-4 text-gray-400">
                            I confirm that the information provided in my
                            application is accurate.
                          </span>
                        </label>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`${YELLOW_BTN} sm:min-w-40`}
                        >
                          <FiSend size={11} />
                          {isSubmitting
                            ? "Submitting..."
                            : "Submit Application"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex min-h-90 flex-col items-center justify-center rounded-xl border border-dashed border-green-200 bg-green-50/40 px-4 text-center dark:border-green-900 dark:bg-green-500/5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10">
                      <FiCheckCircle size={24} />
                    </div>

                    <h3 className="mt-4 font-serif text-[16px] font-extrabold text-black dark:text-white">
                      Application Submitted
                    </h3>

                    <p className="mt-1 max-w-95 text-[8px] leading-4 text-gray-500 dark:text-gray-400">
                      Thank you for applying. Our HR team will review your
                      application and contact you if your profile matches the
                      role.
                    </p>

                    <ThemeBtnOne
                      text=" View More Jobs"
                      icon={<FiArrowRight size={9} />}
                      url="/careers"
                      className="mt-5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#ffd83d] px-4 text-[8px] font-bold text-black"
                    />
                  </div>
                )}
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="min-w-0">
            <div className="space-y-4 lg:sticky lg:top-25">
              {/* JOB OVERVIEW */}
              <section className={`${CARD} p-4 sm:p-5`}>
                <h2 className="font-serif text-[13px] font-extrabold text-black dark:text-white">
                  Job Overview
                </h2>

                <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
                  {overviewItems.map((item) => (
                    <OverviewRow key={item.label} {...item} />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={openApplyForm}
                  className={`${YELLOW_BTN} mt-4 w-full`}
                >
                  Apply Now
                  <FiArrowRight size={10} />
                </button>
              </section>

              {/* HR */}
              <section className={`${CARD} p-4 sm:p-5`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
                  <FiMail size={14} />
                </div>

                <h3 className="mt-3 font-serif text-[12px] font-extrabold text-black dark:text-white">
                  Have a Question?
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">
                  Contact our HR team if you need more information about this
                  position.
                </p>

                {hrEmail && (
                  <Link
                    href={`mailto:${hrEmail}`}
                    className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#967200] hover:underline dark:text-[#ffd83d]"
                  >
                    {hrEmail}
                    <FiArrowRight size={9} />
                  </Link>
                )}
              </section>

              {/* JOB ID + POSTED */}
              {(job.jobID || postedOn) && (
                <section className={`${CARD} p-4`}>
                  {job.jobID && (
                    <>
                      <p className="text-[10px] text-gray-400">Job ID</p>

                      <p className="mt-0.5 text-[12px] font-bold text-black dark:text-white">
                        {job.jobID}
                      </p>
                    </>
                  )}

                  {job.jobID && postedOn && (
                    <div className="my-3 border-t border-gray-100 dark:border-gray-800" />
                  )}

                  {postedOn && (
                    <>
                      <p className="text-[10px] text-gray-400">Posted</p>

                      <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-white">
                        <FiCalendar size={14} />
                        {postedOn}
                      </p>
                    </>
                  )}
                </section>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

/* ============================================================
   SMALL COMPONENTS
============================================================ */

const JobMeta = ({ icon, text }: { icon: React.ReactNode; text?: string }) => {
  if (!text) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-[#fafafa] px-2.5 py-1.5 text-[7px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-[#202020] dark:text-gray-400 sm:text-[10px]">
      {icon}
      {text}
    </span>
  );
};

const JobSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className={`${CARD} p-4 sm:p-5 lg:p-6`}>
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
        {icon}
      </div>

      <h2 className="font-serif text-[14px] font-extrabold text-black dark:text-white sm:text-[16px]">
        {title}
      </h2>
    </div>

    <div className="mt-4 space-y-3">{children}</div>
  </section>
);

interface CareerInputProps {
  name: FormField;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
}

const CareerInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = true,
}: CareerInputProps) => {
  const inputId = React.useId();

  return (
    <div>
      <label htmlFor={inputId} className={LABEL}>
        {label}
      </label>

      <input
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        placeholder={placeholder}
        className={INPUT}
      />
    </div>
  );
};

const OverviewRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2.5 py-3 first:pt-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f7f7f7] text-gray-500 dark:bg-[#242424] dark:text-gray-400">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-gray-500">{label}</p>

        <p className="mt-0.5 truncate text-[8px] font-bold text-black dark:text-white sm:text-[12px]">
          {value}
        </p>
      </div>
    </div>
  );
};

export default CareersDetails;
