"use client";

import Link from "next/link";
import { User } from "firebase/auth";
import { toast } from "react-toastify";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { logoutUser } from "@/firebase/auth";
import { getAuthErrorMessage } from "@/firebase/authErrors";
import ThemeBtnOne from "./ThemeBtnOne";

type Props = {
  user: User;
  onClose: () => void;
};

const links = [
  { label: "My Account", href: "/my-account", icon: FiUser },
  { label: "My Orders", href: "/my-orders", icon: FiShoppingBag },
  { label: "My Wishlist", href: "/wishlist", icon: FiHeart },
];

const AccountLinks = ({ user, onClose }: Props) => {
  const displayName =
    user.displayName || user.email || user.phoneNumber || "Glitters User";

  const subText = user.email || user.phoneNumber || "";

  const handleLogout = async () => {
    try {
      await logoutUser();

      // TODO: backend session / cookie clear karni ho to yahan karein

      toast.success("Logged out successfully.");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <div>
      {/* USER INFO */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#ffe27a] bg-[#fffbea] p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd51c] text-[14px] font-extrabold uppercase text-black">
          {displayName.charAt(0)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-black">
            {displayName}
          </p>

          {subText && subText !== displayName && (
            <p className="truncate text-[10px] text-gray-500">{subText}</p>
          )}
        </div>
      </div>

      {/* LINKS */}
      <nav className="space-y-1">
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="group flex h-11 items-center justify-between rounded-xl px-3 text-[12px] font-semibold text-black transition hover:bg-gray-50 hover:text-[#b58b00]"
          >
            <span className="flex items-center gap-3">
              <Icon
                size={15}
                className="text-gray-500 group-hover:text-[#b58b00]"
              />
              {label}
            </span>

            <FiChevronRight size={14} className="text-gray-300" />
          </Link>
        ))}
      </nav>

      {/* LOGOUT */}
      <ThemeBtnOne
        type="button"
        onClick={handleLogout}
        className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 text-[12px] font-extrabold text-white transition hover:border-red-200 bg-rose-500 hover:bg-red-50 hover:text-red-600"
        icon={<FiLogOut size={14} />}
        text="Logout"
      />
    </div>
  );
};

export default AccountLinks;
