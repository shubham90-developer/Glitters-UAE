"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { useGetSettingsQuery } from "@/store/settingApi";

type LogoSettings = {
  logo?: string;
};

const Logo = () => {
  const { data, isLoading } = useGetSettingsQuery();

  // The settings endpoint returns an array; use the first document.
  const settings: LogoSettings = (Array.isArray(data) ? data[0] : data) ?? {};

  const logo = settings.logo?.trim();

  // Placeholder while settings load, so the layout doesn't jump.
  if (isLoading) {
    return (
      <div
        className="h-10 w-28 animate-pulse rounded-md bg-gray-200 dark:bg-[#2a2a2a]"
        aria-hidden="true"
      />
    );
  }

  // No logo configured: render nothing instead of an image with an empty src.
  if (!logo) return null;

  return (
    <Link href="/" aria-label="Home">
      <Image
        src={logo}
        alt="Site logo"
        width={100}
        height={100}
        className="cursor-pointer"
      />
    </Link>
  );
};

export default Logo;
