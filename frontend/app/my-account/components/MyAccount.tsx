"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiCreditCard,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import MyAddress from "./MyAddress";
import MyOrders from "./MyOrders";
import SavedCards from "./SavedCards";
import EditEmail from "./EditEmail";
import { useAuthUser } from "@/hooks/useAuthUser"; // ADDED
import { useGetMeQuery } from "@/store/authApi"; // ADDED
import { logoutUser } from "@/firebase/auth"; // ADDED

type AccountTab = "address" | "orders" | "cards";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>("address");

  const router = useRouter(); // ADDED
  const { user, authLoading } = useAuthUser(); // ADDED

  // ADDED: fetch logged-in user's data from backend (GET /auth/me)
  const { data } = useGetMeQuery(undefined, { skip: !user });
  const profile = data?.data;

  // ADDED: redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // ADDED: logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      router.replace("/");
    }
  };

  const menuItems: {
    id: AccountTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "address",
      label: "My Address",
      icon: <FiMapPin size={17} />,
    },
    {
      id: "orders",
      label: "My Orders",
      icon: <FiPackage size={17} />,
    },
    {
      id: "cards",
      label: "Saved Cards",
      icon: <FiCreditCard size={17} />,
    },
  ];

  // ADDED: wait for Firebase before rendering (redirect handled above)
  if (authLoading || !user) return null;

  // ADDED: real user values (backend first, Firebase as fallback)
  const displayName = profile?.name || user.displayName || "Customer";
  const displayEmail = profile?.email || user.email || "-";
  const displayPhone = profile?.phone || user.phoneNumber || "-";

  // email can only be changed for email + password accounts
  const canEditEmail = user.providerData.some(
    (provider) => provider.providerId === "password",
  );

  return (
    <main className="min-h-screen bg-[#f7f7f8] py-8 transition-colors dark:bg-[#080808] sm:py-10">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-7">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a58200] dark:text-[#ffd83d]">
            Account
          </span>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            My Account
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage your account details, orders, addresses and payment methods.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          {/* LEFT SIDEBAR */}
          <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111] lg:sticky lg:top-24">
            {/* User Info */}
            <div className="border-b border-gray-100 p-5 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ffd83d] text-black">
                  <FiUser size={23} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-base font-black text-gray-950 dark:text-white">
                    {displayName}
                  </h2>

                  <p className="mt-1 text-[11px] font-medium text-gray-400">
                    Customer Account
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    <FiMail size={14} />
                  </div>

                  <EditEmail email={displayEmail} canEdit={canEditEmail} />
                </div>

                {/* <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    <FiPhone size={14} />
                  </div>

                  <span className="text-xs font-bold text-gray-900 font-serif dark:text-gray-300">
                    {displayPhone}
                  </span>
                </div> */}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col">
              {menuItems.map((item) => {
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex
                      shrink-0
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-left
                      text-xs
                      font-extrabold
                      transition-all
                      lg:w-full
                      ${
                        active
                          ? "bg-[#ffd83d] text-black"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                      }
                    `}
                  >
                    <span>{item.icon}</span>

                    {item.label}
                  </button>
                );
              })}

              {/* CHANGED: Link -> button with real logout (same classes) */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-extrabold transition-all lg:w-full bg-rose-500 text-white  hover:bg-gray-900 dark:text-gray-400 dark:hover:bg-white/5"
              >
                <FiLogOut size={17} />
                Logout
              </button>
            </nav>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="min-w-0">
            {/* MY ADDRESS */}
            {activeTab === "address" && <MyAddress />}

            {/* MY ORDERS */}
            {activeTab === "orders" && <MyOrders />}

            {/* SAVED CARDS */}
            {activeTab === "cards" && <SavedCards />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default MyAccount;
