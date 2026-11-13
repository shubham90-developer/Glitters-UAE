/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";

import {
  FiMail,
  FiShield,
  FiLock,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import Logo from "./Logo";
import { useGetSettingsQuery } from "@/store/settingApi";
import { useGetcategoryQuery } from "@/store/categoriesApi";

/* ====================================================== */
/* TYPES + HELPERS */
/* ====================================================== */

type FooterSettings = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  whatsApp?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  footerInfo?: string;
  footerCopyrights?: string;
  footerImg?: string;
};

const webUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

// The whatsApp field can hold a full link or just a phone number.
const whatsAppUrl = (value: string) =>
  /^https?:\/\//i.test(value)
    ? value
    : `https://wa.me/${value.replace(/\D/g, "")}`;

const SERVICE_LINKS: [string, string][] = [
  ["Track Order", "/track-order"],
  ["Returns & Refunds", "/returns"],
  ["FAQ", "/faq"],
  ["Contact Us", "/contact-us"],
];

const ABOUT_LINKS: [string, string][] = [
  ["About Us", "/about"],
  ["Blog", "/blog"],
  ["Careers", "/careers"],
  ["Store Locations", "/stores"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms-conditions"],
];

/* ====================================================== */
/* BRAND ICONS */
/* ====================================================== */

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <defs>
      <linearGradient
        id="instagram-gradient"
        x1="0%"
        y1="100%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="35%" stopColor="#FF7A00" />
        <stop offset="65%" stopColor="#FF0169" />
        <stop offset="100%" stopColor="#D300C5" />
      </linearGradient>
    </defs>

    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="6"
      fill="url(#instagram-gradient)"
    />
    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="17.2" cy="6.8" r="1.2" fill="white" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#FF0000"
      d="M23.5 6.2a3.1 3.1 0 0 0-2.18-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.32.5A3.1 3.1 0 0 0 .5 6.2 32.3 32.3 0 0 0 0 12a32.3 32.3 0 0 0 .5 5.8A3.1 3.1 0 0 0 2.68 20C4.6 20.5 12 20.5 12 20.5s7.4 0 9.32-.5a3.1 3.1 0 0 0 2.18-2.2A32.3 32.3 0 0 0 24 12a32.3 32.3 0 0 0-.5-5.8Z"
    />
    <path fill="#fff" d="m9.6 15.5 6.2-3.5-6.2-3.5v7Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#0A66C2"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.27ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47Z"
    />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="currentColor"
      d="M18.24 2H21.9l-7.99 9.14L23.3 22h-7.35l-5.76-7.53L3.61 22H-.06l8.55-9.77L-.52 2h7.54l5.2 6.88L18.24 2Zm-1.29 18.09h2.03L5.91 3.81H3.73l13.22 16.28Z"
    />
  </svg>
);

/* ====================================================== */
/* FOOTER */
/* ====================================================== */

const Footer = () => {
  const { data } = useGetSettingsQuery();

  // category
  const { data: menuItems } = useGetcategoryQuery();

  const SHOP_LINKS: [string, string][] = [
    // @ts-ignore
    ...(menuItems
      ?.slice(0, 4)
      .map((category: any) => [
        category.categoryName,
        `/product-list?category=${category._id}`,
      ]) || []),
    // @ts-ignore
    ["All Categories", "/categories"],
  ];

  // The settings endpoint returns an array; use the first document.
  const settings: FooterSettings = (Array.isArray(data) ? data[0] : data) ?? {};

  const {
    facebook,
    instagram,
    youtube,
    linkedin,
    twitter,
    whatsApp,
    googlePlayUrl,
    appStoreUrl,
    footerInfo,
    footerCopyrights,
    footerImg,
  } = settings;

  // Only links that exist in settings are shown; a missing URL used to crash <Link>.
  const socials = [
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      href: facebook && webUrl(facebook),
    },
    {
      label: "Instagram",
      icon: <InstagramIcon />,
      href: instagram && webUrl(instagram),
    },
    {
      label: "YouTube",
      icon: <YouTubeIcon />,
      href: youtube && webUrl(youtube),
    },
    {
      label: "LinkedIn",
      icon: <LinkedInIcon />,
      href: linkedin && webUrl(linkedin),
    },
    { label: "X", icon: <XIcon />, href: twitter && webUrl(twitter) },
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={16} color="#25D366" />,
      href: whatsApp && whatsAppUrl(whatsApp),
    },
  ].filter(
    (s): s is { label: string; icon: React.ReactElement; href: string } =>
      Boolean(s.href),
  );

  return (
    <footer className="w-full border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-[#111]">
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        {/* NEWSLETTER / SOCIAL */}
        <div className="rounded-2xl bg-linear-to-r from-[#fff8d9] via-[#fffdf1] to-[#fff3c7] px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffd51c] text-black">
                <FiMail size={21} />
              </div>

              <div className="min-w-0">
                <h3 className="font-serif text-[15px] font-extrabold text-[#1c1c1c] sm:text-[16px]">
                  Stay Updated
                </h3>

                <p className="mt-0.5 text-[11px] text-gray-600">
                  Get the latest offers, new arrivals and tech tips.
                </p>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <span className="text-[11px] font-bold text-[#222]">
                  Follow Us
                </span>

                <div className="flex items-center gap-2">
                  {socials.map((social) => (
                    <SocialIcon key={social.label} {...social} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-7 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          {/* BRAND */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo />

            {footerInfo && (
              <p className="mt-3 max-w-65 whitespace-pre-line text-[12px] leading-4.25 text-gray-600 dark:text-gray-400">
                {footerInfo}
              </p>
            )}
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Customer Service" links={SERVICE_LINKS} />
          <FooterColumn title="About Us" links={ABOUT_LINKS} />

          {/* APP */}
          {(googlePlayUrl || appStoreUrl) && (
            <div>
              <h4 className="font-serif text-[14px] font-extrabold text-black dark:text-white">
                Download Our App
              </h4>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                {googlePlayUrl && (
                  <GooglePlayBadge href={webUrl(googlePlayUrl)} />
                )}
                {appStoreUrl && <AppStoreBadge href={webUrl(appStoreUrl)} />}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {footerCopyrights && (
              <p className="text-[12px] font-semibold text-black dark:text-gray-300">
                {footerCopyrights}
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
              <FooterFeature icon={<FiLock />} title="Secure Payment" />
              <FooterFeature
                icon={<FiShield />}
                title="100% Genuine Products"
              />
              <FooterFeature icon={<FiRefreshCw />} title="Easy Returns" />
            </div>

            {footerImg && (
              <div className="flex flex-wrap items-center gap-2">
                {/* Plain <img> so no remote-image domain config is needed for the uploaded file. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={footerImg}
                  alt="Accepted payment methods"
                  className="h-5 w-auto max-w-full"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ====================================================== */
/* APP STORE BADGES */
/* ====================================================== */

const BADGE =
  "flex h-10 w-33.75 items-center gap-2 rounded-md bg-black px-3 text-white transition hover:bg-neutral-800";

const GooglePlayBadge = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Get it on Google Play"
    className={BADGE}
  >
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
      <path
        fill="#00D6FF"
        d="M3.18 2.52A1.6 1.6 0 0 0 3 3.28v17.44c0 .27.06.53.18.76L13.1 12 3.18 2.52Z"
      />
      <path
        fill="#FFD400"
        d="m16.34 8.9-3.24 3.1 3.24 3.1 3.65-2.08c.98-.56.98-1.48 0-2.04L16.34 8.9Z"
      />
      <path
        fill="#FF3333"
        d="M13.1 12 3.18 21.48c.42.73 1.27.95 2.03.52l11.13-6.9L13.1 12Z"
      />
      <path
        fill="#48FF48"
        d="M13.1 12 16.34 8.9 5.21 2c-.76-.43-1.61-.21-2.03.52L13.1 12Z"
      />
    </svg>

    <div className="leading-none">
      <span className="block text-[8px] font-medium uppercase tracking-wide text-white/80">
        Get it on
      </span>
      <span className="mt-0.5 block text-[14px] font-semibold tracking-tight">
        Google
      </span>
    </div>
  </a>
);

const AppStoreBadge = ({ href }: { href: string }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Download on the App Store"
    className={BADGE}
  >
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0 fill-current"
      aria-hidden="true"
    >
      <path d="M16.365 1.43c0 1.14-.417 2.15-1.25 3.03-.833.87-1.84 1.38-3.02 1.52-.01-.14-.02-.28-.02-.42 0-1.1.46-2.1 1.38-3 .46-.46 1.04-.84 1.72-1.13.67-.28 1.3-.44 1.89-.47.02.16.03.31.03.47h-.73ZM20.86 17.34c-.32.73-.7 1.43-1.15 2.09-.61.89-1.1 1.5-1.48 1.84-.59.55-1.22.83-1.91.84-.5 0-1.1-.14-1.82-.43-.72-.28-1.38-.43-1.98-.43-.63 0-1.31.15-2.03.43-.73.29-1.32.44-1.77.45-.66.03-1.31-.26-1.95-.86-.41-.36-.92-.99-1.54-1.9-.66-.96-1.21-2.07-1.64-3.34-.46-1.37-.69-2.7-.69-3.98 0-1.47.32-2.73.95-3.8a5.6 5.6 0 0 1 2.03-2.02 5.45 5.45 0 0 1 2.75-.76c.52 0 1.2.16 2.04.49.84.32 1.38.48 1.61.48.18 0 .77-.19 1.79-.57.96-.35 1.77-.5 2.44-.44 1.81.15 3.17.86 4.08 2.14-1.62.98-2.43 2.35-2.41 4.1.01 1.36.51 2.5 1.49 3.4.44.42.94.74 1.49.97-.12.35-.24.68-.38 1Z" />
    </svg>

    <div className="leading-none">
      <span className="block text-[8px] font-medium tracking-wide text-white/80">
        Download on the
      </span>
      <span className="mt-0.5 block text-[14px] font-semibold tracking-tight">
        App Store
      </span>
    </div>
  </Link>
);

/* ====================================================== */
/* FOOTER COLUMN */
/* ====================================================== */

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) => (
  <div>
    <h4 className="font-serif text-[14px] font-extrabold text-black dark:text-white">
      {title}
    </h4>

    <ul className="mt-3 space-y-1.5">
      {links.map(([label, href]) => (
        <li key={label}>
          <Link
            href={href}
            className="group flex w-fit items-center gap-1 font-serif text-[14px] tracking-wide text-black transition hover:text-[#b58b00] dark:text-gray-400"
          >
            {label}

            <FiArrowRight
              size={9}
              className="hidden -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 sm:block"
            />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/* ====================================================== */
/* SOCIAL ICON */
/* ====================================================== */

const SocialIcon = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-[14px] text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#ffd51c] hover:text-black"
  >
    {icon}
  </a>
);

/* ====================================================== */
/* FOOTER FEATURE */
/* ====================================================== */

const FooterFeature = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-2 text-[12px] font-semibold text-black dark:text-gray-300">
    <span className="text-[17px] text-gray-600 dark:text-gray-400">{icon}</span>

    <span>{title}</span>
  </div>
);

export default Footer;
