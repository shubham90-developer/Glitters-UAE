"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

import { useGetSettingsQuery } from "@/store/settingApi";

// The whatsApp field can hold a full link or just a phone number.
const whatsAppUrl = (value: string) =>
  /^https?:\/\//i.test(value)
    ? value
    : `https://wa.me/${value.replace(/\D/g, "")}`;

const WhatsAppFloat = () => {
  const { data } = useGetSettingsQuery();

  // The settings endpoint returns an array; use the first document.
  const settings = (Array.isArray(data) ? data[0] : data) ?? {};
  const whatsApp = settings.whatsApp?.trim();

  // Nothing saved in admin -> don't show the button
  if (!whatsApp) return null;

  return (
    <a
      href={whatsAppUrl(whatsApp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="
        group fixed right-4 z-40
        bottom-[calc(5.5rem+env(safe-area-inset-bottom))]
        md:bottom-6 md:right-6
      "
    >
      {/* hover label (desktop only) */}
      <span
        className="
          pointer-events-none absolute right-full top-1/2 mr-3 hidden
          -translate-y-1/2 whitespace-nowrap rounded-lg bg-black px-3 py-1.5
          text-[11px] font-bold text-white opacity-0 shadow-lg
          transition-opacity duration-200
          group-hover:opacity-100 md:block
          dark:bg-white dark:text-black
        "
      >
        Chat with us
      </span>

      {/* soft pulse ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />

      {/* button */}
      <span
        className="
          relative flex h-13 w-13 items-center justify-center rounded-full
          bg-[#25D366] text-white
          shadow-[0_8px_24px_rgba(37,211,102,0.45)]
          transition-transform duration-200
          group-hover:scale-110 group-active:scale-95
          md:h-14 md:w-14
        "
      >
        <FaWhatsapp className="h-7 w-7 md:h-8 md:w-8" />
      </span>
    </a>
  );
};

export default WhatsAppFloat;
