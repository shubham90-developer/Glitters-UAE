"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  text?: string;
  subtitle?: string;
  url?: string;
  className?: string;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

const ThemeBtnOne = ({
  text = "",
  subtitle = "",
  url,
  className = "",
  icon,
  type = "button",
  disabled = false,
  onClick,
}: Props) => {
  const classes = `th-btn inline-flex items-center justify-center gap-2 ${
    disabled ? "pointer-events-none opacity-50" : ""
  } ${className}`;

  const content = (
    <>
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}

      <span className="flex flex-col items-start justify-center leading-tight">
        <span className="font-bold">{text}</span>

        {subtitle && (
          <span className="mt-0.5 text-[8px] font-normal leading-none opacity-70 sm:text-[8px]">
            {subtitle}
          </span>
        )}
      </span>
    </>
  );

  if (url) {
    return (
      <Link
        href={disabled ? "#" : url}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
};

export default ThemeBtnOne;
