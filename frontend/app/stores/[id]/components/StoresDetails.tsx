"use client";

import { useCreateStoreMutation } from "@/store/storeEnquiryApi";
import { useGetStoreLocatorByIdQuery } from "@/store/storeLocatorApi";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiClock,
  FiImage,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiSend,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";

/* ============================================================
   TYPES
============================================================ */

interface Store {
  _id: string;
  storeName?: string;
  shortDesc?: string;
  img?: string | null;
  qrcode?: string | null;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  rating?: number | string;
  status?: string;
  isDeleted?: boolean;
}

interface EnquiryForm {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL_FORM: EnquiryForm = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

/* ============================================================
   HELPERS
============================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStore = (value: unknown): value is Store =>
  isRecord(value) && "_id" in value;

/** Supports: Store | { data: Store } | { store: Store } */
const extractStore = (response: unknown): Store | null => {
  if (!isRecord(response)) return null;

  if (isStore(response.data)) return response.data;
  if (isStore(response.store)) return response.store;
  if (isStore(response)) return response;

  return null;
};

const getErrorMessage = (error: unknown): string => {
  if (isRecord(error) && isRecord(error.data)) {
    const message = error.data.message;
    if (typeof message === "string") return message;
  }

  return "Failed to send enquiry";
};

/* ============================================================
   SHARED STYLES
============================================================ */

const INPUT =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition-all duration-200 placeholder:font-normal placeholder:text-gray-400 hover:border-gray-300 focus:border-[#d2a900] focus:bg-white focus:ring-4 focus:ring-[#ffd83d]/15 dark:border-white/10 dark:bg-[#0d0d0d] dark:text-white dark:placeholder:text-gray-600 dark:hover:border-white/20 dark:focus:border-[#ffd83d]/60 dark:focus:bg-[#101010]";

const TEXTAREA =
  "w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-medium leading-6 text-gray-900 outline-none transition-all duration-200 placeholder:font-normal placeholder:text-gray-400 hover:border-gray-300 focus:border-[#d2a900] focus:bg-white focus:ring-4 focus:ring-[#ffd83d]/15 dark:border-white/10 dark:bg-[#0d0d0d] dark:text-white dark:placeholder:text-gray-600 dark:hover:border-white/20 dark:focus:border-[#ffd83d]/60 dark:focus:bg-[#101010]";

const LABEL = "mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300";

const ICON = "pointer-events-none absolute left-4 text-gray-400";

/* ============================================================
   SMALL COMPONENTS
============================================================ */

interface InfoBoxProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const InfoBox = ({ icon, label, children }: InfoBoxProps) => (
  <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-[#ffd83d]/50 hover:bg-[#fffbea] dark:border-white/5 dark:bg-white/2.5 dark:hover:border-[#ffd83d]/20 dark:hover:bg-[#ffd83d]/5">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff3bd] text-[#aa8700] dark:bg-[#ffd83d]/10 dark:text-[#ffd83d]">
      {icon}
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>

      <div className="mt-1.5 text-sm font-semibold leading-5 text-gray-800 dark:text-gray-200">
        {children}
      </div>
    </div>
  </div>
);

interface FormFieldProps {
  id: keyof EnquiryForm;
  label: string;
  icon: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({
  id,
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: FormFieldProps) => (
  <div>
    <label htmlFor={id} className={LABEL}>
      {label}
      <span className="ml-1 text-red-500">*</span>
    </label>

    <div className="relative">
      <span className={`${ICON} top-1/2 -translate-y-1/2`}>{icon}</span>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className={INPUT}
      />
    </div>
  </div>
);

const PageState = ({ children }: { children: React.ReactNode }) => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f7f8] px-4 text-center dark:bg-[#080808]">
    {children}
  </main>
);

/* ============================================================
   SKELETON
============================================================ */

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`rounded bg-gray-200 dark:bg-neutral-800 ${className}`} />
);

const StoreDetailsSkeleton = () => (
  <main className="min-h-screen bg-[#f7f7f8] py-8 dark:bg-[#080808] sm:py-10 lg:py-14">
    <div
      className="mx-auto w-full max-w-325 animate-pulse px-4 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading store details"
    >
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-2xl">
          <Bar className="mb-4 h-3 w-36" />
          <Bar className="h-8 w-2/3 sm:h-9" />
          <Bar className="mt-3 h-4 w-full" />
        </div>

        <div className="h-9 w-28 rounded-full bg-gray-200 dark:bg-neutral-800" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        {/* LEFT */}
        <aside className="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111111]">
          <div className="h-65 bg-gray-200 dark:bg-neutral-800 sm:h-75" />

          <div className="p-5 sm:p-6">
            <Bar className="h-4 w-full" />
            <Bar className="mt-2 h-4 w-4/5" />

            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 dark:border-white/5"
                >
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200 dark:bg-neutral-800" />

                  <div className="flex-1">
                    <Bar className="h-2.5 w-24" />
                    <Bar className="mt-2.5 h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111111]">
          <div className="border-b border-gray-100 px-5 py-6 dark:border-white/10 sm:px-7 lg:px-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-200 dark:bg-neutral-800" />

              <div className="flex-1">
                <Bar className="h-3 w-28" />
                <Bar className="mt-3 h-6 w-48" />
                <Bar className="mt-3 h-4 w-full max-w-lg" />
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-7 lg:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item}>
                  <Bar className="mb-2 h-3 w-24" />
                  <div className="h-12 rounded-xl bg-gray-200 dark:bg-neutral-800" />
                </div>
              ))}
            </div>

            <div>
              <Bar className="mb-2 h-3 w-28" />
              <div className="h-12 rounded-xl bg-gray-200 dark:bg-neutral-800" />
            </div>

            <div>
              <Bar className="mb-2 h-3 w-28" />
              <div className="h-44 rounded-xl bg-gray-200 dark:bg-neutral-800" />
            </div>

            <div className="h-12 rounded-xl bg-gray-200 dark:bg-neutral-800" />
          </div>
        </section>
      </div>
    </div>
  </main>
);

/* ============================================================
   PAGE
============================================================ */

const StoresDetails = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetStoreLocatorByIdQuery(id ?? "", { skip: !id });

  const [createEnquiry, { isLoading: isSending }] = useCreateStoreMutation();

  const [formData, setFormData] = useState<EnquiryForm>(INITIAL_FORM);

  const store = useMemo(() => extractStore(response), [response]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !store) return;

    try {
      await createEnquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        msg: formData.message.trim(),
        storeName: id, // backend expects the store _id here
      }).unwrap();

      toast.success("Enquiry sent successfully");
      setFormData(INITIAL_FORM);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  /* ---------- STATES ---------- */

  if (isLoading) return <StoreDetailsSkeleton />;

  if (
    isError ||
    !store ||
    store.isDeleted ||
    store.status?.toLowerCase() !== "active"
  ) {
    return (
      <PageState>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
          <FiMapPin size={25} />
        </div>

        <h2 className="text-xl font-black text-gray-900 dark:text-white">
          Store not found
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          This store is not available right now.
        </p>

        <Link
          href="/stores"
          className="inline-flex items-center gap-2 rounded-full bg-[#ffd83d] px-5 py-3 text-xs font-extrabold text-black transition hover:bg-[#f5cb22]"
        >
          <FiArrowLeft size={14} />
          Back to Stores
        </Link>
      </PageState>
    );
  }

  /* ---------- DERIVED ---------- */

  const storeName = store.storeName ?? "Store";
  const image = store.img?.trim();
  const qrCode = store.qrcode?.trim();
  const hasRating = store.rating !== undefined && store.rating !== "";

  /* ---------- RENDER ---------- */

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-8 transition-colors duration-300 dark:bg-[#080808] sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-325 px-4 sm:px-6 lg:px-8">
        {/* ================= PAGE HEADER ================= */}
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ffd83d]" />

              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a98400] dark:text-[#ffd83d]">
                Store Information
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white sm:text-3xl lg:text-[34px]">
              {storeName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              View store information and send your enquiry directly to our team.
            </p>
          </div>

          {/* STATUS */}
          <div className="flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 dark:border-green-500/20 dark:bg-green-500/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>

            <span className="text-xs font-bold capitalize text-green-700 dark:text-green-400">
              {store.status}
            </span>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          {/* LEFT - STORE DETAILS */}
          <aside className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_35px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#111111] dark:shadow-none">
            {/* IMAGE */}
            <div className="group relative h-65 overflow-hidden bg-gray-100 dark:bg-neutral-900 sm:h-75">
              {image ? (
                <Image
                  src={image}
                  alt={storeName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-neutral-700">
                  <FiImage size={40} />
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    Featured Store
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                    {storeName}
                  </h2>
                </div>

                {hasRating && (
                  <div className="shrink-0 rounded-xl border border-white/20 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-md dark:bg-black/70">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base text-[#f5b400]">★</span>

                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                        {store.rating}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 sm:p-6">
              {store.shortDesc && (
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {store.shortDesc}
                </p>
              )}

              <div className="mt-6 space-y-3">
                {store.address && (
                  <InfoBox icon={<FiMapPin size={18} />} label="Store Address">
                    {store.address}
                  </InfoBox>
                )}

                {store.phone && (
                  <InfoBox icon={<FiPhone size={18} />} label="Phone Number">
                    <a
                      href={`tel:${store.phone}`}
                      className="transition hover:text-[#b18d00] dark:hover:text-[#ffd83d]"
                    >
                      {store.phone}
                    </a>
                  </InfoBox>
                )}

                {store.email && (
                  <InfoBox icon={<FiMail size={18} />} label="Email Address">
                    <a
                      href={`mailto:${store.email}`}
                      className="block truncate transition hover:text-[#b18d00] dark:hover:text-[#ffd83d]"
                    >
                      {store.email}
                    </a>
                  </InfoBox>
                )}

                {store.workingHours && (
                  <InfoBox icon={<FiClock size={18} />} label="Store Hours">
                    {store.workingHours}
                  </InfoBox>
                )}

                {qrCode && (
                  <InfoBox icon={<FiStar size={18} />} label="Rating QR">
                    <Image
                      src={qrCode}
                      alt={`${storeName} rating QR code`}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                  </InfoBox>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT - CONTACT FORM */}
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_35px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[#111111] dark:shadow-none">
            {/* FORM HEADER */}
            <div className="border-b border-gray-100 bg-linear-to-r from-[#fffbea] to-white px-5 py-6 dark:border-white/10 dark:from-[#ffd83d]/6 dark:to-[#111111] sm:px-7 lg:px-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffd83d] text-black shadow-sm">
                  <FiMessageSquare size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9f7e00] dark:text-[#ffd83d]">
                    Contact Store
                  </p>

                  <h2 className="mt-1 text-xl font-black text-gray-950 dark:text-white sm:text-2xl">
                    Send an Enquiry
                  </h2>

                  <p className="mt-1.5 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Share your details and query. Our store team will contact
                    you as soon as possible.
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-7 lg:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  id="fullName"
                  label="Full Name"
                  icon={<FiUser size={17} />}
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <FormField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  icon={<FiPhone size={17} />}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <FormField
                id="email"
                label="Email Address"
                type="email"
                icon={<FiMail size={17} />}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              {/* MESSAGE */}
              <div>
                <label htmlFor="message" className={LABEL}>
                  Your Message
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className={`${ICON} top-4`}>
                    <FiMessageSquare size={17} />
                  </span>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're looking for..."
                    required
                    rows={7}
                    className={TEXTAREA}
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/2.5">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-5 text-sm font-extrabold text-black shadow-[0_6px_18px_rgba(255,216,61,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffcf12] hover:shadow-[0_9px_24px_rgba(255,216,61,0.3)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <FiSend size={16} />
                  {isSending ? "Sending..." : "Send Enquiry"}
                </button>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <p className="text-center text-[11px] leading-5 text-gray-400 dark:text-gray-500">
                    Usually responds within a few hours
                  </p>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default StoresDetails;
