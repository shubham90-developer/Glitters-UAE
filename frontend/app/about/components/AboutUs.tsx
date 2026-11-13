"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiHeart,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { useGetAboutUsQuery } from "@/store/aboutUsApi";
import AboutUsSkeleton from "./AboutUsSkeleton";

/* ============================================================
   TYPES
============================================================ */

interface AboutUsData {
  _id: string;
  title?: string;
  subTitle?: string;
  shortDesc?: string;

  ProductsCounter?: string;
  CustomersCounter?: string;
  DeliveriesCounter?: string;
  Rating?: string;

  trustedTitle?: string;
  trustedDesc?: string;

  storySubTitle?: string;
  storyTitle?: string;
  storyDesc?: string;
  storySecondDesc?: string;
  storyImg?: string;

  customerFirstTitle?: string;
  customerFirstDesc?: string;
  qualityFocusTitle?: string;
  qualityFocusDesc?: string;
  transparentPricingTitle?: string;
  transparentPricingDesc?: string;
  reliableSupportTitle?: string;
  reliableSupportDesc?: string;

  valuesTitle?: string;
  valuesSubTitle?: string;
  CustomerFirstTitle?: string;
  CustomerFirstDesc?: string;
  TrustSecurityTitle?: string;
  TrustSecurityDesc?: string;
  QualityTitle?: string;
  QualityDesc?: string;
  ContinuousImprovementTitle?: string;
  ContinuousImprovementDesc?: string;

  whyShopSubTitle?: string;
  whyShopTitle?: string;
  whyShopDesc?: string;
  wideSelectionTitle?: string;
  wideSelectionDesc?: string;
  fastDeliveryTitle?: string;
  fastDeliveryDesc?: string;
  secureCheckoutTitle?: string;
  secureCheckoutDesc?: string;
  easyReturnsTitle?: string;
  easyReturnsDesc?: string;

  promiseTitle?: string;
  promiseDesc?: string;
  promisePoint1?: string;
  promisePoint2?: string;
  promisePoint3?: string;
  promisePoint4?: string;

  status?: string;
  isDeleted?: boolean;
}

interface CardItem {
  icon?: React.ReactNode;
  title?: string;
  text?: string;
}

/* ============================================================
   HELPERS
============================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isAboutUs = (value: unknown): value is AboutUsData =>
  isRecord(value) && "_id" in value;

/** Supports: AboutUs[] | { data: AboutUs[] } | { data: AboutUs } | AboutUs */
const extractAboutUs = (response: unknown): AboutUsData | null => {
  let list: unknown[] = [];

  if (Array.isArray(response)) {
    list = response;
  } else if (isRecord(response)) {
    if (Array.isArray(response.data)) list = response.data;
    else if (isAboutUs(response.data)) list = [response.data];
    else if (isAboutUs(response)) list = [response];
  }

  return (
    list
      .filter(isAboutUs)
      .find((item) => item.status === "active" && !item.isDeleted) ?? null
  );
};

/** Highlights the last 3 words of the heading. */
const splitHeading = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 3) return { plain: "", highlight: words.join(" ") };

  return {
    plain: words.slice(0, -3).join(" "),
    highlight: words.slice(-3).join(" "),
  };
};

/* ============================================================
   SHARED STYLES
============================================================ */

const CARD =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#181818]";

const SECTION_LABEL =
  "text-[10px] font-bold uppercase tracking-[1px] text-[#9b7600] dark:text-[#ffd83d]";

const YELLOW_BTN =
  "flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#ffd83d] px-5 font-serif text-[12px] font-extrabold text-black transition hover:bg-[#ffcf12]";

/* ============================================================
   PAGE
============================================================ */

const AboutUs = () => {
  const { data, isLoading, isError } = useGetAboutUsQuery();

  const about = React.useMemo(() => extractAboutUs(data), [data]);

  if (isLoading) return <AboutUsSkeleton />;

  if (isError || !about) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] dark:bg-[#0f0f0f]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          About us information is not available right now.
        </p>
      </main>
    );
  }

  /* ---------- DERIVED DATA ---------- */

  const heading = splitHeading(about.subTitle);

  const heroStats = [
    {
      icon: <FiShoppingBag size={18} />,
      value: about.ProductsCounter,
      label: "Products",
    },
    {
      icon: <FiUsers size={18} />,
      value: about.CustomersCounter,
      label: "Customers",
    },
    {
      icon: <FiTruck size={18} />,
      value: about.DeliveriesCounter,
      label: "Deliveries",
    },
    { icon: <FiStar size={18} />, value: about.Rating, label: "Rating" },
  ];

  const stats = [
    {
      value: about.CustomersCounter,
      title: "Happy Customers",
      text: "Customers shopping with confidence.",
    },
    {
      value: about.ProductsCounter,
      title: "Products",
      text: "Wide selection across multiple categories.",
    },
    {
      value: about.DeliveriesCounter,
      title: "Orders Delivered",
      text: "Orders successfully shipped to customers.",
    },
    {
      value: about.Rating,
      title: "Customer Rating",
      text: "Based on customer shopping experiences.",
    },
  ];

  const storyPoints: CardItem[] = [
    { title: about.customerFirstTitle, text: about.customerFirstDesc },
    { title: about.qualityFocusTitle, text: about.qualityFocusDesc },
    {
      title: about.transparentPricingTitle,
      text: about.transparentPricingDesc,
    },
    { title: about.reliableSupportTitle, text: about.reliableSupportDesc },
  ];

  const values: CardItem[] = [
    {
      icon: <FiHeart size={17} />,
      title: about.CustomerFirstTitle,
      text: about.CustomerFirstDesc,
    },
    {
      icon: <FiShield size={17} />,
      title: about.TrustSecurityTitle,
      text: about.TrustSecurityDesc,
    },
    {
      icon: <FiCheckCircle size={17} />,
      title: about.QualityTitle,
      text: about.QualityDesc,
    },
    {
      icon: <FiRefreshCw size={17} />,
      title: about.ContinuousImprovementTitle,
      text: about.ContinuousImprovementDesc,
    },
  ];

  const whyChoose: CardItem[] = [
    {
      icon: <FiPackage size={17} />,
      title: about.wideSelectionTitle,
      text: about.wideSelectionDesc,
    },
    {
      icon: <FiTruck size={17} />,
      title: about.fastDeliveryTitle,
      text: about.fastDeliveryDesc,
    },
    {
      icon: <FiShield size={17} />,
      title: about.secureCheckoutTitle,
      text: about.secureCheckoutDesc,
    },
    {
      icon: <FiRefreshCw size={17} />,
      title: about.easyReturnsTitle,
      text: about.easyReturnsDesc,
    },
  ];

  const promisePoints = [
    about.promisePoint1,
    about.promisePoint2,
    about.promisePoint3,
    about.promisePoint4,
  ].filter((point): point is string => Boolean(point?.trim()));

  /* ---------- RENDER ---------- */

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-4 dark:bg-[#0f0f0f] sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-375 px-3 sm:px-5 lg:px-8 xl:px-10">
        {/* ================= HERO ================= */}
        <section
          className={`${CARD} relative overflow-hidden px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-14`}
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffd83d]/15 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-[#ffd83d]/5 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-7 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_480px]">
            {/* LEFT */}
            <div className="max-w-180">
              {about.title && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6ce] px-2.5 py-1 text-[8px] font-bold text-[#806300] dark:bg-[#2b260f] dark:text-[#ffd83d] sm:text-[9px]">
                  <FiHeart size={11} />
                  {about.title}
                </span>
              )}

              <h1 className="mt-3 font-serif text-[24px] font-extrabold leading-tight text-black dark:text-white sm:text-[30px] lg:text-[38px]">
                {heading.plain}{" "}
                <span className="text-[#b38900] dark:text-[#ffd83d]">
                  {heading.highlight}
                </span>
              </h1>

              {about.shortDesc && (
                <p className="mt-3 max-w-162.5 text-[9px] leading-5 text-dark-900 dark:text-dark-400 sm:text-[12px] lg:text-[14px]">
                  {about.shortDesc}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <ThemeBtnOne
                  text="Start Shopping"
                  icon={<FiShoppingBag />}
                  url="/product-list"
                  className={YELLOW_BTN}
                />

                <Link
                  href="/contact-us"
                  className="flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 font-serif text-[12px] font-bold text-gray-600 transition hover:border-[#ffd83d] hover:text-black dark:border-gray-700 dark:bg-[#202020] dark:text-gray-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-[#fafafa] p-4 dark:border-gray-700 dark:bg-[#202020] sm:p-5">
              <div className="grid grid-cols-2 gap-2.5">
                {heroStats.map((item) => (
                  <HeroMiniCard key={item.label} {...item} />
                ))}
              </div>

              {(about.trustedTitle || about.trustedDesc) && (
                <div className="mt-3 rounded-xl border border-[#ffe681] bg-[#fffdf3] p-3 dark:border-[#5e5117] dark:bg-[#29260f]">
                  <div className="flex items-start gap-2.5">
                    <FiShield
                      size={15}
                      className="mt-0.5 shrink-0 text-[#9b7600] dark:text-[#ffd83d]"
                    />

                    <div>
                      <p className="font-serif text-[12px] font-bold text-black dark:text-white">
                        {about.trustedTitle}
                      </p>

                      <p className="mt-1 text-[12px] leading-4 text-gray-500 dark:text-gray-400">
                        {about.trustedDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </section>

        {/* ================= OUR STORY ================= */}
        <section
          className={`${CARD} mt-4 grid grid-cols-1 overflow-hidden lg:grid-cols-[420px_minmax(0,1fr)] xl:grid-cols-[480px_minmax(0,1fr)]`}
        >
          {/* IMAGE */}
          <div className="relative flex min-h-65 items-center justify-center overflow-hidden bg-[#f1f1f1] dark:bg-[#202020] sm:min-h-80 lg:min-h-full">
            {about.storyImg ? (
              <Image
                src={about.storyImg}
                alt={about.storyTitle ?? "Our story"}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            ) : (
              <>
                <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd83d]/15 blur-3xl" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#ffd83d] text-black shadow-[0_15px_40px_rgba(255,216,61,0.25)]">
                  <FiShoppingBag size={38} />
                </div>
              </>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 lg:p-8">
            {about.storySubTitle && (
              <span className={SECTION_LABEL}>{about.storySubTitle}</span>
            )}

            {about.storyTitle && (
              <h2 className="mt-2 font-serif text-[18px] font-extrabold text-black dark:text-white sm:text-[22px]">
                {about.storyTitle}
              </h2>
            )}

            {about.storyDesc && (
              <p className="mt-3 text-[14px] leading-5 text-dark-900 dark:text-dark-400">
                {about.storyDesc}
              </p>
            )}

            {about.storySecondDesc && (
              <p className="mt-3 text-[14px] leading-5 text-dark-900 dark:text-dark-400">
                {about.storySecondDesc}
              </p>
            )}

            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {storyPoints.map((point, index) => (
                <StoryPoint key={index} {...point} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= VALUES ================= */}
        <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className={SECTION_LABEL}>Our Values</span>

              {about.valuesTitle && (
                <h2 className="mt-1 font-serif text-[17px] font-extrabold text-black dark:text-white sm:text-[20px]">
                  {about.valuesTitle}
                </h2>
              )}
            </div>

            {about.valuesSubTitle && (
              <p className="max-w-117.5 text-[8px] leading-4 text-gray-900 dark:text-white sm:text-[10px]">
                {about.valuesSubTitle}
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
              <ValueCard key={index} {...item} />
            ))}
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className={`${CARD} mt-4 p-4 sm:p-5 lg:p-6`}>
          <div className="text-center">
            {about.whyShopSubTitle && (
              <span className={SECTION_LABEL}>{about.whyShopSubTitle}</span>
            )}

            {about.whyShopTitle && (
              <h2 className="mt-1 font-serif text-[17px] font-extrabold text-black dark:text-white sm:text-[20px]">
                {about.whyShopTitle}
              </h2>
            )}

            {about.whyShopDesc && (
              <p className="mx-auto mt-1.5 max-w-137.5 text-[14px] leading-4 text-dark-900 dark:text-gray-400 sm:text-[12px]">
                {about.whyShopDesc}
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {whyChoose.map((item, index) => (
              <ChooseCard key={index} {...item} />
            ))}
          </div>
        </section>

        {/* ================= PROMISE + SUPPORT ================= */}
        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={`${CARD} p-4 sm:p-5 lg:p-6`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
              <FiShield size={16} />
            </div>

            {about.promiseTitle && (
              <h2 className="mt-3 font-serif text-[15px] font-extrabold text-black dark:text-white sm:text-[17px]">
                {about.promiseTitle}
              </h2>
            )}

            {about.promiseDesc && (
              <p className="mt-2 text-[14px] leading-4 text-dark-900 dark:text-gray-400 sm:text-[12px]">
                {about.promiseDesc}
              </p>
            )}

            {promisePoints.length > 0 && (
              <div className="mt-4 space-y-2">
                {promisePoints.map((point, index) => (
                  <PromiseItem key={index} text={point} />
                ))}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#181818] p-4 sm:p-5 lg:p-6">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#ffd83d]/15 blur-3xl" />

            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffd83d] text-black">
                <FiUsers size={16} />
              </div>

              <h2 className="mt-3 font-serif text-[15px] font-extrabold text-white sm:text-[17px]">
                Customer Support
              </h2>

              <p className="mt-2 max-w-125 text-[14px] leading-4 text-gray-400 sm:text-[12px]">
                Have a question about products, orders, payments, delivery or
                returns? Our support team is here to help.
              </p>

              <ThemeBtnOne
                text="Contact Support"
                icon={<FiArrowRight size={11} />}
                url="/contact-us"
                className={`${YELLOW_BTN} mt-5 inline-flex`}
              />
            </div>
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#f2d45a] bg-[#fff9dd] px-4 py-5 text-center dark:border-[#5e5117] dark:bg-[#29260f] sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div>
            <h2 className="font-serif text-[14px] font-extrabold text-black dark:text-white sm:text-[16px]">
              Ready to start shopping?
            </h2>

            <p className="mt-1 text-[8px] text-gray-900 dark:text-gray-400 sm:text-[12px]">
              Explore products, discover offers and find what you need.
            </p>
          </div>

          <ThemeBtnOne
            url="/product-list"
            text="Shop Now"
            icon={<FiShoppingBag size={11} />}
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

const HeroMiniCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value?: string;
  label: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-[#181818]">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff6ce] text-[#8b6a00] dark:bg-[#2b260f] dark:text-[#ffd83d]">
      {icon}
    </div>

    <p className="mt-2.5 font-serif text-[15px] font-extrabold text-black dark:text-white sm:text-[17px]">
      {value}
    </p>

    <p className="mt-0.5 text-[14px] text-dark-900 dark:text-white">{label}</p>
  </div>
);

const StatCard = ({
  value,
  title,
  text,
}: {
  value?: string;
  title: string;
  text: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-[#181818] sm:p-4">
    <p className="font-serif text-[17px] font-extrabold text-[#a17b00] dark:text-[#ffd83d] sm:text-[20px]">
      {value}
    </p>

    <h3 className="mt-1 font-serif text-[8px] font-bold text-black dark:text-white sm:text-[14px]">
      {title}
    </h3>

    <p className="mt-1 text-[10px] leading-3.5 text-dark-900 dark:text-dark-400 sm:text-[12px]">
      {text}
    </p>
  </div>
);

const StoryPoint = ({ title, text }: CardItem) => (
  <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-[#fafafa] p-3 dark:border-gray-700 dark:bg-[#202020]">
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffd83d] text-black">
      <FiCheckCircle size={10} />
    </span>

    <div>
      <p className="font-serif text-[12px] font-bold text-black dark:text-white">
        {title}
      </p>

      <p className="mt-0.5 text-[14px] leading-3.5 text-dark-900 dark:text-dark-400">
        {text}
      </p>
    </div>
  </div>
);

const ValueCard = ({ icon, title, text }: CardItem) => (
  <article className="rounded-xl border border-gray-200 bg-[#fafafa] p-3 transition hover:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020] sm:p-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffd83d] text-black">
      {icon}
    </div>

    <h3 className="mt-3 font-serif text-[14px] font-bold text-black dark:text-white">
      {title}
    </h3>

    <p className="mt-1 text-[14px] leading-4 text-dark-900 dark:text-white">
      {text}
    </p>
  </article>
);

const ChooseCard = ({ icon, title, text }: CardItem) => (
  <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-[#fafafa] p-3 text-center transition hover:border-[#ffd83d] dark:border-gray-700 dark:bg-[#202020] sm:p-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff3ba] text-[#896900] dark:bg-[#2b260f] dark:text-[#ffd83d]">
      {icon}
    </div>

    <h3 className="mt-2.5 text-[12px] font-bold text-black dark:text-white sm:text-[14px]">
      {title}
    </h3>

    <p className="mt-1 text-[14px] leading-3.5 text-dark-900 dark:text-white">
      {text}
    </p>
  </div>
);

const PromiseItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-500/10">
      <FiCheckCircle size={10} />
    </span>

    <span className="text-[14px] text-dark-900 dark:text-gray-400 sm:text-[12px]">
      {text}
    </span>
  </div>
);

export default AboutUs;
