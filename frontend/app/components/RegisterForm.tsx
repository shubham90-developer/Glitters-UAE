"use client";

import { FormEvent, useState } from "react";

import Link from "next/link";

import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { toast } from "react-toastify";

import ThemeBtnOne from "./ThemeBtnOne";

import { registerWithEmail } from "@/firebase/auth";
import { getAuthErrorMessage } from "@/firebase/authErrors";

import { useSyncUserMutation } from "@/store/authApi";

type Props = {
  onSuccess?: () => void;
};

const RegisterForm = ({ onSuccess }: Props) => {
  const [syncUser] = useSyncUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");

  const [mobile, setMobile] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [agree, setAgree] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const name = fullName.trim();
    const phone = mobile.trim();
    const userEmail = email.trim().toLowerCase();

    // Name
    if (!name) {
      toast.error("Please enter your full name.");
      return;
    }

    // Mobile
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Please enter a valid 10 digit mobile number.");
      return;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    // Terms
    if (!agree) {
      toast.error("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Creating your account...");

    try {
      // 1. Create Firebase user
      const firebaseUser = await registerWithEmail(userEmail, password, name);

      console.log("Firebase UID:", firebaseUser.uid);

      // 2. Force get fresh Firebase token
      const token = await firebaseUser.getIdToken(true);

      console.log("Firebase token received:", token ? "YES" : "NO");

      // 3. Sync with backend
      //
      // authApi automatically sends:
      //
      // Authorization: Bearer <token>
      //
      await syncUser({
        name,
        phone: `+91${phone}`,
      }).unwrap();

      // Success
      toast.update(toastId, {
        render: "Account created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setFullName("");
      setMobile("");
      setEmail("");
      setPassword("");
      setAgree(false);

      onSuccess?.();
    } catch (error) {
      console.error("Register error:", error);

      toast.update(toastId, {
        render: getAuthErrorMessage(error),
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-3">
      {/* NAME */}
      <div>
        <label
          htmlFor="register-name"
          className="mb-1.5 block text-[11px] font-semibold text-gray-700"
        >
          Full Name
        </label>

        <div className="relative">
          <FiUser
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="register-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-[12px] text-black outline-none placeholder:text-gray-400 focus:border-[#ffd51c] focus:ring-2 focus:ring-[#ffd51c]/20 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* MOBILE */}
      <div>
        <label
          htmlFor="register-mobile"
          className="mb-1.5 block text-[11px] font-semibold text-gray-700"
        >
          Mobile Number
        </label>

        <div className="flex h-11 overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#ffd51c] focus-within:ring-2 focus-within:ring-[#ffd51c]/20">
          <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-[12px] font-semibold text-black">
            +91
          </span>

          <input
            id="register-mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter mobile number"
            autoComplete="tel-national"
            disabled={loading}
            className="min-w-0 flex-1 px-3 text-[12px] text-black outline-none placeholder:text-gray-400 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label
          htmlFor="register-email"
          className="mb-1.5 block text-[11px] font-semibold text-gray-700"
        >
          Email Address
        </label>

        <div className="relative">
          <FiMail
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            autoComplete="email"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-[12px] text-black outline-none placeholder:text-gray-400 focus:border-[#ffd51c] focus:ring-2 focus:ring-[#ffd51c]/20 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <label
          htmlFor="register-password"
          className="mb-1.5 block text-[11px] font-semibold text-gray-700"
        >
          Create Password
        </label>

        <div className="relative">
          <FiLock
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password (min 6 characters)"
            autoComplete="new-password"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-10 text-[12px] text-black outline-none placeholder:text-gray-400 focus:border-[#ffd51c] focus:ring-2 focus:ring-[#ffd51c]/20 disabled:bg-gray-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        </div>
      </div>

      {/* TERMS */}
      <label className="flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          disabled={loading}
          className="mt-0.5 h-3.5 w-3.5 accent-[#ffd51c]"
        />

        <span className="text-[9px] leading-4 text-gray-500">
          I agree to{" "}
          <Link href="/terms" className="font-bold text-black">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="font-bold text-black">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* BUTTON */}
      <ThemeBtnOne
        text={loading ? "Creating account..." : "Create Account"}
        type="submit"
        disabled={loading}
        className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#ffd51c] text-[12px] font-extrabold text-black transition hover:bg-[#ffca00] disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  );
};

export default RegisterForm;
