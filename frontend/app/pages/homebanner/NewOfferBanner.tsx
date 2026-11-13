"use client";

import { useGetTopSaleBannerQuery } from "@/store/topSaleBannerApi";
import Image from "next/image";
import Link from "next/link";

// Match this to your real banner size (e.g. 1200x400 = 3/1, 1200x375 = 16/5)
const BANNER_ASPECT = "aspect-[3/1]";

// internal paths use next/link, full URLs open in a new tab
const isExternal = (url: string) => /^https?:\/\//.test(url);

const NewOfferBannerSkeleton = () => (
  <section className="w-full bg-white py-4 dark:bg-[#111]">
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`${BANNER_ASPECT} w-full animate-pulse rounded-xl bg-gray-200 dark:bg-neutral-800 ${
              i === 1 ? "hidden md:block" : ""
            }`}
          />
        ))}
      </div>
    </div>
  </section>
);

const NewOfferBanner = () => {
  const { data: banners = [], isLoading, isError } = useGetTopSaleBannerQuery();

  if (isLoading) return <NewOfferBannerSkeleton />;
  if (isError || !banners?.length) return null;

  const banner = banners[0];

  // pair each image with its own link BEFORE filtering,
  // so the link stays matched to the right image
  const items = [
    { src: banner?.offerBannerImg2, link: banner?.offerBannerLink2 || "" },
    { src: banner?.offerBannerImg3, link: banner?.offerBannerLink3 || "" },
  ].filter((item): item is { src: string; link: string } => !!item.src);

  if (!items.length) return null;

  const renderBanner = (item: { src: string; link: string }, i: number) => {
    const className = `group relative block ${BANNER_ASPECT} w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800`;

    const image = (
      <Image
        src={item.src}
        alt={`Offer Banner ${i + 1}`}
        fill
        sizes="(max-width: 767px) 100vw, (max-width: 1600px) 50vw, 760px"
        className="object-cover object-center transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.02]"
      />
    );

    // no link set -> plain block, same look as before
    if (!item.link) {
      return (
        <div key={i} className={className}>
          {image}
        </div>
      );
    }

    if (isExternal(item.link)) {
      return (
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {image}
        </a>
      );
    }

    return (
      <Link key={i} href={item.link} className={className}>
        {image}
      </Link>
    );
  };

  return (
    <section className="w-full bg-white py-4 dark:bg-[#111]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-3 lg:gap-4 ${
            items.length > 1 ? "md:grid-cols-2" : ""
          }`}
        >
          {items.map((item, i) => renderBanner(item, i))}
        </div>
      </div>
    </section>
  );
};

export default NewOfferBanner;
