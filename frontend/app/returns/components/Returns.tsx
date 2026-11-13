/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useState } from "react";
import Link from "next/link";

import {
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { useGetReturnRefundQuery } from "@/store/returnRefundApi";
import { useCreateReturnRequestMutation } from "@/store/returnRequestApi";

/* ====================================================== */
/* SHARED STYLES */
/* ====================================================== */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

const ICON_BOX =
  "flex items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]";

const LABEL =
  "mb-1.5 block font-serif text-[12px] font-semibold text-gray-900 dark:text-gray-300";

const FIELD =
  "w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020] dark:text-white";

const BONE = "animate-pulse rounded-md bg-gray-200 dark:bg-[#2a2a2a]";

const SECTION_ID = "return-request";

/* ====================================================== */
/* TYPES + HELPERS */
/* ====================================================== */

type ReturnDoc = {
  badgeTitle?: string;
  title?: string;
  shortDesc?: string;
  startReturnBtnText?: string;
  startReturnBtnUrl?: string;
  contactSupportBtnText?: string;
  contactSupportBtnUrl?: string;
  features?: unknown[];
  howItWorksTitle?: string;
  howItWorksDesc?: string;
  returnSteps?: unknown[];
  eligibleTitle?: string;
  eligibleDesc?: string;
  eligibleItems?: unknown[];
  nonReturnableTitle?: string;
  nonReturnableDesc?: string;
  nonReturnableItems?: unknown[];
  refundTimelineTitle?: string;
  refundTimelineDesc?: string;
  refundTimeline?: unknown[];
  refundProcessingTitle?: string;
  refundProcessingDesc?: string;
};

type Card = { title: string; text: string };

// Return reasons: `value` is what gets sent, `label` is what visitors see.
const REASONS = [
  "Product damaged",
  "Wrong product received",
  "Product not as expected",
  "Missing accessories",
  "Changed my mind",
  "Other",
].map((reason) => ({ value: reason, label: reason }));

const FEATURE_ICONS = [FiRefreshCw, FiTruck, FiShield, FiClock];
const STEP_ICONS = [FiPackage, FiRefreshCw, FiTruck, FiCheckCircle];

const asList = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const pick = (item: any, keys: string[]): string => {
  for (const key of keys) {
    const value = item?.[key];

    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
};

// List items can be plain strings or objects, so accept both.
const toText = (item: unknown): string =>
  typeof item === "string"
    ? item.trim()
    : pick(item, ["text", "title", "description", "name", "label", "content"]);

const toCard = (item: unknown): Card =>
  typeof item === "string"
    ? { title: item.trim(), text: "" }
    : {
        title: pick(item, ["title", "name", "heading", "label"]),
        text: pick(item, [
          "description",
          "desc",
          "text",
          "content",
          "details",
          "subtitle",
        ]),
      };

const toTexts = (items: unknown): string[] =>
  asList(items).map(toText).filter(Boolean);

const toCards = (items: unknown): Card[] =>
  asList(items)
    .map(toCard)
    .filter((c) => c.title || c.text);

// The button URL is stored as a page path, but the request form lives on this page.
const normalizeHref = (url?: string) => {
  if (!url) return "";

  return url.replace(/^[/#]/, "") === SECTION_ID ? `#${SECTION_ID}` : url;
};

/* ====================================================== */
/* PAGE */
/* ====================================================== */

const Returns = () => {
  const { data, isLoading, isError, refetch } = useGetReturnRefundQuery();
  const [createRequest, { isLoading: sending }] =
    useCreateReturnRequestMutation();

  const [submitted, setSubmitted] = useState(false);

  // The endpoint returns an array; use the first document.
  const doc: ReturnDoc = (Array.isArray(data) ? data[0] : data) ?? {};

  const features = toCards(doc.features);
  const steps = toCards(doc.returnSteps);
  const eligibleItems = toTexts(doc.eligibleItems);
  const nonReturnableItems = toTexts(doc.nonReturnableItems);
  const timeline = toCards(doc.refundTimeline);

  const startHref = normalizeHref(doc.startReturnBtnUrl);

  // The inputs are uncontrolled, so read the values straight from the form.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (sending) return;

    const formData = new FormData(e.currentTarget);
    const field = (name: string) => String(formData.get(name) ?? "").trim();

    const payload = {
      orderNo: field("orderNo"),
      email: field("email"),
      product: field("product"),
      reason: field("reason"),
      additionalDetails: field("additionalDetails"),
    };

    try {
      // @ts-ignore
      await createRequest(payload).unwrap();

      toast.success("Return request sent successfully");
      setSubmitted(true);
      // @ts-ignore
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-4 sm:py-6 lg:py-8 dark:bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
        {isError && (
          <div className="mb-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 sm:flex-row sm:items-center dark:border-red-900 dark:bg-red-500/10">
            <p className="text-[12px] font-semibold text-red-600">
              Unable to load the return policy details. You can still submit a
              request below.
            </p>

            <button
              type="button"
              onClick={refetch}
              className="h-8 cursor-pointer rounded-lg bg-red-600 px-3 text-[11px] font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* HERO */}
        {isLoading ? (
          <HeroSkeleton />
        ) : (
          (doc.title || doc.shortDesc) && (
            <section
              className={`${CARD} relative overflow-hidden px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10`}
            >
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ffd83d]/10 blur-3xl" />

              <div className="relative max-w-190">
                {doc.badgeTitle && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6ce] px-2.5 py-1 text-[12px] font-bold text-[#806300] dark:bg-[#2b260f] dark:text-[#ffd83d]">
                    <FiRefreshCw size={11} />
                    {doc.badgeTitle}
                  </span>
                )}

                {doc.title && (
                  <h1 className="mt-3 font-serif text-[22px] font-extrabold text-black sm:text-[28px] lg:text-[34px] dark:text-white">
                    {doc.title}
                  </h1>
                )}

                {doc.shortDesc && (
                  <p className="mt-2 max-w-162.5 text-[14px] leading-5 text-dark-900 dark:text-dark-900">
                    {doc.shortDesc}
                  </p>
                )}

                {(doc.startReturnBtnText || doc.contactSupportBtnText) && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {doc.startReturnBtnText && startHref && (
                      <ThemeBtnOne
                        text={doc.startReturnBtnText}
                        icon={<FiHelpCircle />}
                        url={startHref}
                        className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#ffd83d] px-4 font-serif text-[12px] font-extrabold text-black transition hover:bg-[#ffcf12]"
                      />
                    )}

                    {doc.contactSupportBtnText && doc.contactSupportBtnUrl && (
                      <Link
                        href={doc.contactSupportBtnUrl}
                        className="flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 font-serif text-[12px] font-bold text-gray-600 transition hover:border-[#ffd83d] hover:text-black dark:border-gray-700 dark:bg-[#202020] dark:text-gray-300"
                      >
                        {doc.contactSupportBtnText}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </section>
          )
        )}

        {/* FEATURES */}
        {isLoading ? (
          <section className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${CARD} space-y-2.5 p-3 sm:p-4`}>
                <Bone className="h-8 w-8 rounded-lg" />
                <Bone className="h-3.5 w-24" />
                <Bone className="h-3 w-full" />
              </div>
            ))}
          </section>
        ) : (
          features.length > 0 && (
            <section className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
              {features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];

                return (
                  <InfoCard
                    key={`${i}-${feature.title}`}
                    icon={<Icon size={16} />}
                    {...feature}
                  />
                );
              })}
            </section>
          )
        )}

        {/* RETURN STEPS */}
        {isLoading ? (
          <div className="mt-4">
            <SectionSkeleton rows={4} />
          </div>
        ) : (
          steps.length > 0 && (
            <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
              <div>
                {doc.howItWorksTitle && (
                  <h2 className="font-serif text-[16px] font-extrabold text-black sm:text-[18px] dark:text-white">
                    {doc.howItWorksTitle}
                  </h2>
                )}

                {doc.howItWorksDesc && (
                  <p className="mt-1 text-[12px] text-gray-400">
                    {doc.howItWorksDesc}
                  </p>
                )}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, i) => {
                  const Icon = STEP_ICONS[i % STEP_ICONS.length];

                  return (
                    <StepCard
                      key={`${i}-${step.title}`}
                      number={String(i + 1).padStart(2, "0")}
                      icon={<Icon size={16} />}
                      {...step}
                    />
                  );
                })}
              </div>
            </section>
          )
        )}

        {/* MAIN GRID */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-6">
          {/* LEFT */}
          <div className="min-w-0 space-y-4">
            {isLoading ? (
              <>
                <SectionSkeleton rows={5} />
                <SectionSkeleton rows={5} />
              </>
            ) : (
              <>
                {eligibleItems.length > 0 && (
                  <ItemsSection
                    title={doc.eligibleTitle}
                    desc={doc.eligibleDesc}
                    items={eligibleItems}
                    positive
                  />
                )}

                {nonReturnableItems.length > 0 && (
                  <ItemsSection
                    title={doc.nonReturnableTitle}
                    desc={doc.nonReturnableDesc}
                    items={nonReturnableItems}
                  />
                )}
              </>
            )}

            {/* RETURN REQUEST */}
            <section
              id={SECTION_ID}
              className={`${CARD} scroll-mt-27.5 p-4 sm:p-5 lg:p-6`}
            >
              <div className="mb-5">
                <h2 className="font-serif text-[16px] font-extrabold text-black sm:text-[18px] dark:text-white">
                  Request a Return
                </h2>

                <p className="mt-1 text-[12px] text-gray-400">
                  Enter your order details to submit a return request.
                </p>
              </div>

              {submitted ? (
                <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-green-200 bg-green-50/40 px-4 text-center dark:border-green-900 dark:bg-green-500/5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10">
                    <FiCheckCircle size={24} />
                  </div>

                  <h3 className="mt-4 font-serif text-[15px] font-extrabold text-black dark:text-white">
                    Return Request Submitted
                  </h3>

                  <p className="mt-1 max-w-85 text-[12px] leading-4 text-gray-500 dark:text-gray-400">
                    Your return request has been received. Our team will review
                    the request and provide the next steps.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 h-9 cursor-pointer rounded-lg bg-[#ffd83d] px-4 text-[12px] font-extrabold text-black transition hover:bg-[#ffcf12]"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  <ReturnInput
                    name="orderNo"
                    label="Order Number"
                    placeholder="Example: ORD-123456"
                  />
                  <ReturnInput
                    name="email"
                    label="Email Address"
                    placeholder="example@email.com"
                    type="email"
                  />

                  <div className="sm:col-span-2">
                    <ReturnInput
                      name="product"
                      label="Product"
                      placeholder="Product name or model"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="reason" className={LABEL}>
                      Reason for Return
                    </label>

                    <select
                      id="reason"
                      name="reason"
                      required
                      defaultValue=""
                      className={`${FIELD} h-10 sm:h-11`}
                    >
                      <option value="" disabled>
                        Select reason
                      </option>

                      {REASONS.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="additionalDetails" className={LABEL}>
                      Additional Details
                    </label>

                    <textarea
                      id="additionalDetails"
                      name="additionalDetails"
                      rows={4}
                      placeholder="Tell us more about the issue..."
                      className={`${FIELD} resize-none py-3 leading-4`}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        required
                        className="mt-0.5 h-3.5 w-3.5 accent-[#ffd83d]"
                      />

                      <span className="text-[12px] leading-4 text-gray-900 dark:text-gray-300">
                        I confirm that the information provided is correct.
                      </span>
                    </label>

                    <ThemeBtnOne
                      type="submit"
                      icon={<FiRefreshCw size={12} />}
                      text="Submit Return"
                      className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#ffd83d] px-5 text-[12px] font-extrabold text-black transition hover:bg-[#ffcf12] sm:h-11 sm:min-w-38.75"
                    />
                  </div>
                </form>
              )}
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="min-w-0 space-y-4">
            {isLoading ? (
              <SectionSkeleton rows={6} />
            ) : (
              (timeline.length > 0 || doc.refundProcessingTitle) && (
                <div className={`${CARD} p-4 sm:p-5 lg:sticky lg:top-25`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`${ICON_BOX} h-8 w-8`}>
                      <FiClock size={15} />
                    </div>

                    <div>
                      {doc.refundTimelineTitle && (
                        <h2 className="font-serif text-[14px] font-extrabold text-black dark:text-white">
                          {doc.refundTimelineTitle}
                        </h2>
                      )}

                      {doc.refundTimelineDesc && (
                        <p className="mt-0.5 text-[14px] text-dark-900">
                          {doc.refundTimelineDesc}
                        </p>
                      )}
                    </div>
                  </div>

                  {timeline.length > 0 && (
                    <div className="mt-5">
                      {timeline.map((step, i) => (
                        <TimelineItem
                          key={`${i}-${step.title}`}
                          number={String(i + 1)}
                          last={i === timeline.length - 1}
                          {...step}
                        />
                      ))}
                    </div>
                  )}

                  {(doc.refundProcessingTitle || doc.refundProcessingDesc) && (
                    <div className="mt-4 rounded-xl bg-[#f8f8f8] p-3 dark:bg-[#202020]">
                      {doc.refundProcessingTitle && (
                        <p className="text-[14px] font-bold text-black dark:text-white">
                          {doc.refundProcessingTitle}
                        </p>
                      )}

                      {doc.refundProcessingDesc && (
                        <p className="mt-1 text-[14px] leading-4 text-dark-900">
                          {doc.refundProcessingDesc}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </aside>
        </div>

        {/* BOTTOM NOTICE */}
        <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#181818] px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div>
            <h2 className="font-serif text-[14px] font-extrabold text-white sm:text-[16px]">
              Questions about your return?
            </h2>

            <p className="mt-1 text-[12px] text-gray-400">
              Our customer support team is available to help.
            </p>
          </div>

          <Link
            href="/contact-us"
            className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#ffd83d] px-5 text-[12px] font-extrabold text-black transition hover:bg-[#ffcf12]"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
};

/* ====================================================== */
/* SKELETONS */
/* ====================================================== */

const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`${BONE} ${className}`} />
);

const HeroSkeleton = () => (
  <section
    className={`${CARD} px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10`}
    aria-hidden="true"
  >
    <Bone className="h-6 w-28 rounded-full" />
    <Bone className="mt-4 h-8 w-64 max-w-full" />
    <Bone className="mt-3 h-3 w-full max-w-lg" />
    <Bone className="mt-2 h-3 w-2/3 max-w-md" />

    <div className="mt-5 flex gap-2">
      <Bone className="h-10 w-32 rounded-xl" />
      <Bone className="h-10 w-36 rounded-xl" />
    </div>
  </section>
);

const SectionSkeleton = ({ rows }: { rows: number }) => (
  <div className={`${CARD} p-4 sm:p-5`} aria-hidden="true">
    <div className="flex items-center gap-2.5">
      <Bone className="h-8 w-8 shrink-0 rounded-lg" />

      <div className="space-y-1.5">
        <Bone className="h-4 w-40" />
        <Bone className="h-3 w-56 max-w-full" />
      </div>
    </div>

    <div className="mt-4 space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <Bone key={i} className={`h-3 ${i % 2 ? "w-2/3" : "w-5/6"}`} />
      ))}
    </div>
  </div>
);

/* ====================================================== */
/* ITEMS SECTION (eligible / non-returnable) */
/* ====================================================== */

const ItemsSection = ({
  title,
  desc,
  items,
  positive = false,
}: {
  title?: string;
  desc?: string;
  items: string[];
  positive?: boolean;
}) => (
  <section className={`${CARD} p-4 sm:p-5`}>
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          positive
            ? "bg-green-50 text-green-600 dark:bg-green-500/10"
            : "bg-gray-100 text-gray-500 dark:bg-[#252525]"
        }`}
      >
        {positive ? <FiCheckCircle size={15} /> : <FiXCircle size={15} />}
      </div>

      <div>
        {title && (
          <h2 className="font-serif text-[14px] font-extrabold text-black sm:text-[16px] dark:text-white">
            {title}
          </h2>
        )}

        {desc && <p className="mt-0.5 text-[14px] text-dark-900">{desc}</p>}
      </div>
    </div>

    <div className="mt-4 space-y-2.5">
      {items.map((text, i) => (
        <div key={`${i}-${text}`} className="flex items-start gap-2">
          {positive ? (
            <FiCheckCircle
              size={12}
              className="mt-0.5 shrink-0 text-green-600"
            />
          ) : (
            <FiXCircle size={12} className="mt-0.5 shrink-0 text-dark-900" />
          )}

          <span className="text-[14px] leading-4 text-dark-900 dark:text-dark-900">
            {text}
          </span>
        </div>
      ))}
    </div>
  </section>
);

/* ====================================================== */
/* INFO CARD */
/* ====================================================== */

const InfoCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-[#181818]">
    <div className={`${ICON_BOX} h-8 w-8`}>{icon}</div>

    <h3 className="mt-2.5 font-serif text-[14px] font-bold text-black dark:text-white">
      {title}
    </h3>

    {text && <p className="mt-1 text-[14px] leading-4 text-gray-900">{text}</p>}
  </div>
);

/* ====================================================== */
/* STEP CARD */
/* ====================================================== */

const StepCard = ({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="relative rounded-xl border border-gray-200 bg-[#fafafa] p-3 sm:p-4 dark:border-gray-700 dark:bg-[#202020]">
    <span className="absolute right-3 top-3 text-[14px] font-extrabold text-dark-900 dark:text-dark-900">
      {number}
    </span>

    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffd83d] text-black">
      {icon}
    </div>

    <h3 className="mt-3 font-serif text-[14px] font-bold text-black dark:text-white">
      {title}
    </h3>

    {text && (
      <p className="mt-1 text-[14px] leading-4 text-dark-900 dark:text-dark-900">
        {text}
      </p>
    )}
  </div>
);

/* ====================================================== */
/* INPUT */
/* ====================================================== */

const ReturnInput = ({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}) => (
  <div>
    <label htmlFor={name} className={LABEL}>
      {label}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      required
      placeholder={placeholder}
      className={`${FIELD} h-10 sm:h-11`}
    />
  </div>
);

/* ====================================================== */
/* TIMELINE ITEM */
/* ====================================================== */

const TimelineItem = ({
  number,
  title,
  text,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) => (
  <div className="relative flex gap-3">
    {!last && (
      <span className="absolute left-3.25 top-7 h-[calc(100%-8px)] w-px bg-gray-200 dark:bg-gray-700" />
    )}

    <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff6ce] text-[12px] font-extrabold text-[#806300] dark:bg-[#2b260f] dark:text-[#ffd83d]">
      {number}
    </span>

    <div className={last ? "" : "pb-5"}>
      <p className="text-[12px] font-bold text-black dark:text-white">
        {title}
      </p>

      {text && (
        <p className="mt-0.5 text-[14px] leading-4 text-gray-900">{text}</p>
      )}
    </div>
  </div>
);

export default Returns;
