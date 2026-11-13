/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMessageCircle,
  FiSend,
  FiChevronRight,
  FiCheckCircle,
  FiHelpCircle,
  FiShoppingBag,
  FiRefreshCw,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
  FiUsers,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { toast } from "react-toastify";
import { useGetSettingsQuery } from "@/store/settingApi";
import { useCreateContactMutation } from "@/store/contactApi";

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

const CARD_TITLE =
  "font-serif text-[13px] font-extrabold text-black sm:text-[14px] dark:text-white";

/* ====================================================== */
/* TYPES + HELPERS */
/* ====================================================== */

// `value` must match the backend enum exactly; `label` is what visitors see.
const SUBJECTS = [
  { value: "orders", label: "Order Support" },
  { value: "products", label: "Product Inquiry" },
  { value: "shipping", label: "Delivery Issue" },
  { value: "payments", label: "Payment Issue" },
  { value: "returns", label: "Return & Refund" },
];

type ContactSettings = {
  mobileNo?: string;
  alternateMobileNo?: string;
  mail?: string;
  alternateEmail?: string;
  address?: string;
  addressIframe?: string;
  workingHrs?: string;
  whatsApp?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
};

type CardLine = { text: string; href: string; external?: boolean };

type ContactCardData = {
  icon: React.ReactNode;
  title: string;
  lines: CardLine[];
};

const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, "")}`;

const webUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

// The whatsApp field can hold a full link or just a phone number.
const whatsAppHref = (value: string) =>
  /^https?:\/\//i.test(value)
    ? value
    : `https://wa.me/${value.replace(/\D/g, "")}`;

// Accepts a plain URL or a pasted <iframe> snippet and returns a safe https Google URL,
// so raw HTML from the database is never injected into the page.
const getMapSrc = (value?: string) => {
  if (!value) return null;

  const src = value.match(/src=["']([^"']+)["']/)?.[1] ?? value.trim();

  try {
    const url = new URL(src);
    const isGoogle =
      url.hostname === "google.com" || url.hostname.endsWith(".google.com");

    return url.protocol === "https:" && isGoogle ? src : null;
  } catch {
    return null;
  }
};

// Builds the tappable lines for a card and drops blanks and duplicates, since the
// primary and alternate values are often the same (which also breaks React keys).
const buildLines = (
  values: (string | undefined)[],
  toHref: (value: string) => string,
): CardLine[] => {
  const seen = new Set<string>();

  return values.flatMap((value) => {
    const text = value?.trim();

    if (!text) return [];

    const href = toHref(text);

    if (seen.has(href)) return [];

    seen.add(href);

    return [{ text, href }];
  });
};

/* ====================================================== */
/* PAGE */
/* ====================================================== */

const ContactUs = () => {
  const { data } = useGetSettingsQuery();

  // The settings endpoint returns an array; use the first document.
  const settings: ContactSettings =
    (Array.isArray(data) ? data[0] : data) ?? {};

  const {
    mobileNo,
    alternateMobileNo,
    mail,
    alternateEmail,
    address,
    addressIframe,
    workingHrs,
    whatsApp,
    facebook,
    instagram,
    youtube,
    linkedin,
    twitter,
  } = settings;

  const [submitted, setSubmitted] = useState(false);

  const mapSrc =
    getMapSrc(addressIframe) ??
    (address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
      : null);

  const phoneLines = buildLines([mobileNo, alternateMobileNo], telHref);

  const emailLines = buildLines([mail, alternateEmail], (m) => `mailto:${m}`);

  const cards: ContactCardData[] = [
    ...(phoneLines.length
      ? [{ icon: <FiPhone size={17} />, title: "Call Us", lines: phoneLines }]
      : []),
    ...(emailLines.length
      ? [{ icon: <FiMail size={17} />, title: "Email Us", lines: emailLines }]
      : []),
    whatsApp
      ? {
          icon: <FaWhatsapp size={17} />,
          title: "Live Chat",
          lines: [
            {
              text: "Chat on WhatsApp",
              href: whatsAppHref(whatsApp),
              external: true,
            },
          ],
        }
      : {
          icon: <FiMessageCircle size={17} />,
          title: "Message Us",
          lines: [{ text: "Send a message", href: "#contact-form" }],
        },
    ...(address
      ? [
          {
            icon: <FiMapPin size={17} />,
            title: "Our Location",
            lines: [{ text: address, href: "#location" }],
          },
        ]
      : []),
  ];

  const socials = [
    { label: "Facebook", icon: <FiFacebook size={15} />, url: facebook },
    { label: "Instagram", icon: <FiInstagram size={15} />, url: instagram },
    { label: "YouTube", icon: <FiYoutube size={15} />, url: youtube },
    { label: "LinkedIn", icon: <FiLinkedin size={15} />, url: linkedin },
    { label: "Twitter", icon: <FiTwitter size={15} />, url: twitter },
  ].filter((s) => Boolean(s.url));

  const [createEnquiry, { isLoading: sending }] = useCreateContactMutation();

  // The inputs are uncontrolled, so read the values straight from the form.
  // Input `name`s match the field names the API expects.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (sending) return;

    const formData = new FormData(e.currentTarget);
    const field = (name: string) => String(formData.get(name) ?? "").trim();

    const payload = {
      firstName: field("firstName"),
      lastName: field("lastName"),
      emailAddress: field("emailAddress"),
      phone: field("phone"),
      subject: field("subject"),
      orderNo: field("orderNo"),
      message: field("message"),
    };

    try {
      // @ts-ignore
      await createEnquiry(payload).unwrap();

      toast.success("Enquiry submitted successfully");
      setSubmitted(true);
      // @ts-ignore
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-4 sm:py-6 lg:py-8 dark:bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
        {/* HEADER */}
        <section
          className={`${CARD} relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10`}
        >
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ffd83d]/10 blur-3xl" />

          <div className="relative max-w-175">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6ce] px-2.5 py-1 text-[9px] font-bold text-[#806300] dark:bg-[#2b260f] dark:text-[#ffd83d]">
              <FiMessageCircle size={11} />
              We&apos;re here to help
            </span>

            <h1 className="mt-3 font-serif text-[22px] font-extrabold leading-tight text-black sm:text-[28px] lg:text-[34px] dark:text-white">
              Contact Us
            </h1>

            <p className="mt-2 max-w-150 text-[11px] leading-5 text-gray-500 lg:text-[12px] dark:text-gray-400">
              Have a question about your order, product, delivery or payment?
              Our support team is ready to assist you.
            </p>
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {cards.map((card) => (
            <ContactCard key={card.title} {...card} />
          ))}
        </section>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
          {/* FORM */}
          <section id="contact-form" className={`${CARD} p-4 sm:p-5 lg:p-6`}>
            <div className="mb-5">
              <h2 className="font-serif text-[16px] font-extrabold text-black sm:text-[18px] dark:text-white">
                Send Us a Message
              </h2>

              <p className="mt-1 text-[10px] text-gray-400">
                Fill out the form and our team will get back to you as soon as
                possible.
              </p>
            </div>

            {submitted ? (
              <div className="flex min-h-90 flex-col items-center justify-center rounded-xl border border-dashed border-green-200 bg-green-50/50 px-5 text-center dark:border-green-900 dark:bg-green-500/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10">
                  <FiCheckCircle size={24} />
                </div>

                <h3 className="mt-4 font-serif text-[16px] font-extrabold text-black dark:text-white">
                  Message Sent Successfully
                </h3>

                <p className="mt-1 max-w-90 text-[10px] leading-4 text-gray-500 dark:text-gray-400">
                  Thank you for contacting us. Our support team will respond
                  shortly.
                </p>

                <ThemeBtnOne
                  text="Send Another Message"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 h-9 cursor-pointer rounded-lg bg-[#ffd83d] px-4 text-[10px] font-extrabold text-black transition hover:bg-[#ffcf12]"
                />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <ContactInput
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                />
                <ContactInput
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                />
                <ContactInput
                  name="emailAddress"
                  label="Email Address"
                  placeholder="example@email.com"
                  type="email"
                />
                <ContactInput
                  name="phone"
                  label="Phone Number"
                  placeholder="+971 50 123 4567"
                  type="tel"
                />

                <div className="sm:col-span-2">
                  <label htmlFor="subject" className={LABEL}>
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    required
                    defaultValue=""
                    className={`${FIELD} h-10 sm:h-11`}
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="orderNo" className={LABEL}>
                    Order Number
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="orderNo"
                    name="orderNo"
                    type="text"
                    placeholder="Example: ORD-123456"
                    className={`${FIELD} h-10 sm:h-11`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className={LABEL}>
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
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
                      I agree to the privacy policy and terms.
                    </span>
                  </label>

                  <ThemeBtnOne
                    text="Send Message"
                    icon={<FiSend size={12} />}
                    type="submit"
                    className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#ffd83d] px-5 text-[10px] font-extrabold text-black transition-all hover:bg-[#ffcf12] hover:shadow-[0_6px_18px_rgba(255,216,61,0.28)] active:scale-[0.99] sm:h-11 sm:min-w-36.25"
                  />
                </div>
              </form>
            )}
          </section>

          {/* SIDEBAR */}
          <aside className="space-y-4">
            {workingHrs && (
              <div className={`${CARD} p-4 sm:p-5`}>
                <div className="flex items-center gap-2.5">
                  <div className={`${ICON_BOX} h-8 w-8`}>
                    <FiClock size={15} />
                  </div>

                  <div>
                    <h2 className={CARD_TITLE}>Support Hours</h2>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Customer support availability
                    </p>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-line border-t border-gray-100 pt-4 text-[12px] font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-200">
                  {workingHrs}
                </p>
              </div>
            )}

            {socials.length > 0 && (
              <div className={`${CARD} p-4 sm:p-5`}>
                <div className="flex items-center gap-2.5">
                  <div className={`${ICON_BOX} h-8 w-8`}>
                    <FiUsers size={15} />
                  </div>

                  <div>
                    <h2 className={CARD_TITLE}>Follow Us</h2>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Stay connected on social media
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={webUrl(s.url as string)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`${ICON_BOX} h-9 w-9 transition hover:bg-[#ffd83d] hover:text-black`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className={`${CARD} p-4 sm:p-5`}>
              <div className="flex items-center gap-2.5">
                <div className={`${ICON_BOX} h-8 w-8`}>
                  <FiHelpCircle size={15} />
                </div>

                <div>
                  <h2 className={CARD_TITLE}>Quick Help</h2>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Find answers quickly
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <QuickHelp
                  href="/track-order"
                  icon={<FiShoppingBag size={14} />}
                  title="Track Your Order"
                />
                <QuickHelp
                  href="/returns"
                  icon={<FiRefreshCw size={14} />}
                  title="Returns & Refunds"
                />
                <QuickHelp
                  href="/faq"
                  icon={<FiHelpCircle size={14} />}
                  title="Frequently Asked Questions"
                />
              </div>
            </div>
          </aside>
        </div>

        {/* LOCATION */}
        {(address || mapSrc) && (
          <section id="location" className={`${CARD} mt-4 overflow-hidden`}>
            <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)]">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className={`${ICON_BOX} h-9 w-9`}>
                  <FiMapPin size={16} />
                </div>

                <h2 className="mt-3 font-serif text-[15px] font-extrabold text-black dark:text-white">
                  Visit Our Store
                </h2>

                {address && (
                  <>
                    <p className="mt-1.5 whitespace-pre-line text-[12px] leading-4 text-gray-900 dark:text-gray-400">
                      {address}
                    </p>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#967200] hover:underline dark:text-[#ffd83d]"
                    >
                      Get Directions
                      <FiChevronRight size={10} />
                    </a>
                  </>
                )}
              </div>

              <div className="relative min-h-55 bg-[#eeeeef] lg:min-h-65 dark:bg-[#222]">
                {mapSrc && (
                  <iframe
                    src={mapSrc}
                    title="Store location map"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

/* ====================================================== */
/* CONTACT CARD */
/* ====================================================== */

const ContactCard = ({ icon, title, lines }: ContactCardData) => (
  <div className="group flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[#ffd83d] hover:shadow-[0_5px_18px_rgba(0,0,0,0.05)] sm:p-4 dark:border-gray-800 dark:bg-[#181818]">
    <div
      className={`${ICON_BOX} h-8 w-8 transition group-hover:bg-[#ffd83d] group-hover:text-black`}
    >
      {icon}
    </div>

    <h3 className="mt-3 font-serif text-[12px] font-bold text-black sm:text-[14px] dark:text-white">
      {title}
    </h3>

    <div className="mt-1 flex min-w-0 flex-col gap-0.5">
      {lines.map((line) => (
        <a
          key={line.href}
          href={line.href}
          {...(line.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="truncate text-[12px] font-semibold text-gray-900 hover:underline dark:text-gray-300"
        >
          {line.text}
        </a>
      ))}
    </div>
  </div>
);

/* ====================================================== */
/* INPUT */
/* ====================================================== */

const ContactInput = ({
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
/* QUICK HELP */
/* ====================================================== */

const QuickHelp = ({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) => (
  <Link
    href={href}
    className="group flex items-center gap-2.5 rounded-lg border border-gray-100 bg-[#fafafa] px-3 py-2.5 transition hover:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020]"
  >
    <span className="text-gray-400 transition group-hover:text-[#9a7600] dark:group-hover:text-[#ffd83d]">
      {icon}
    </span>

    <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-gray-900 dark:text-gray-300">
      {title}
    </span>

    <FiChevronRight
      size={11}
      className="shrink-0 text-gray-900 transition group-hover:translate-x-0.5 group-hover:text-black dark:text-gray-400 dark:group-hover:text-white"
    />
  </Link>
);

export default ContactUs;
