"use client";

import { FormEvent, useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

import ThemeBtnOne from "./ThemeBtnOne";

import { loginWithEmail } from "@/firebase/auth";
import { getAuthErrorMessage } from "@/firebase/authErrors";
import { useSyncUserMutation } from "@/store/authApi";

type Props = {
  onForgotPassword?: () => void;
};

const EmailPasswordLogin = ({ onForgotPassword }: Props) => {
  const [syncUser] = useSyncUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Logging in...");

    try {
      // 1. Firebase login
      const user = await loginWithEmail(trimmedEmail, password);

      console.log("Firebase UID:", user.uid);

      // 2. Get Firebase ID token
      const token = await user.getIdToken();

      console.log("Firebase token received:", !!token);

      // 3. Sync Firebase user with MongoDB
      const response = await syncUser({}).unwrap();

      console.log("MongoDB user:", response.data);

      toast.update(toastId, {
        render: "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Optional:
      // close login modal here
      // router.push("/")
    } catch (error) {
      console.error("Email login error:", error);

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
    <form onSubmit={handleLogin} className="space-y-3">
      {/* EMAIL */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
          Email Address
        </label>

        <div className="relative">
          <FiMail
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            autoComplete="email"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-[12px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#ffd51c] focus:ring-2 focus:ring-[#ffd51c]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
          Password
        </label>

        <div className="relative">
          <FiLock
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            disabled={loading}
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-10 text-[12px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#ffd51c] focus:ring-2 focus:ring-[#ffd51c]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-black disabled:cursor-not-allowed"
          >
            {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        </div>
      </div>

      {/* REMEMBER / FORGOT */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            disabled={loading}
            className="h-3.5 w-3.5 accent-[#ffd51c]"
          />

          <span className="text-[10px] text-gray-500">Remember me</span>
        </label>

        <button
          type="button"
          onClick={onForgotPassword}
          disabled={loading}
          className="cursor-pointer text-[10px] font-bold text-[#b58b00] hover:underline disabled:cursor-not-allowed"
        >
          Forgot Password?
        </button>
      </div>

      {/* LOGIN BUTTON */}
      <ThemeBtnOne
        text={loading ? "Logging in..." : "Login"}
        type="submit"
        disabled={loading}
        className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#ffd51c] text-[12px] font-extrabold text-black transition hover:bg-[#ffca00] hover:shadow-[0_6px_18px_rgba(255,213,28,0.30)] disabled:cursor-not-allowed disabled:opacity-60"
      />
    </form>
  );
};

export default EmailPasswordLogin;
