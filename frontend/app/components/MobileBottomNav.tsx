"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiHeart,
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
} from "react-icons/fi";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "Categories", href: "/categories", icon: FiGrid },
  { label: "Wishlist", href: "/wishlist", icon: FiHeart },
  { label: "Cart", href: "/cart", icon: FiShoppingCart },
];

type MobileBottomNavProps = {
  cartCount?: number;
};

const MobileBottomNav = ({ cartCount = 0 }: MobileBottomNavProps) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div
        className="
          mx-auto flex max-w-md items-center justify-between
          rounded-[28px] border border-white/50 p-1.5
          bg-white/60 backdrop-blur-2xl backdrop-saturate-150
          shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.7)]
          dark:border-white/10 dark:bg-[#1c1c1e]/60
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]
        "
      >
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          const isCart = href === "/cart";

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`
                relative flex flex-1 flex-col items-center justify-center gap-0.5
                rounded-[22px] py-2 transition-all duration-300 active:scale-95
                ${
                  active
                    ? "bg-black/6 text-gray-950 dark:bg-white/12 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }
              `}
            >
              <span className="relative">
                <Icon size={21} strokeWidth={active ? 2.4 : 1.9} />

                {isCart && cartCount > 0 && (
                  <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffd83d] px-1 text-[9px] font-extrabold leading-none text-black shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>

              <span
                className={`text-[10px] leading-none ${
                  active ? "font-extrabold" : "font-semibold"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;