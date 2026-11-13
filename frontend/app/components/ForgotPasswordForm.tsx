"use client";

import { FormEvent, useState } from "react";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import ThemeBtnOne from "./ThemeBtnOne";
import { sendResetPasswordEmail } from "@/firebase/auth";
import { getAuthErrorMessage } from "@/firebase/authErrors";

type Props = {
  onBack: () => void;
};

const ForgotPasswordForm = ({ onBack }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      await sendResetPasswordEmail(email.trim());

      setEmailSent(true);

      toast.update(toastId, {
        render: "Password reset link sent to your email.",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
    } catch (error) {
      console.error(error);

      const code = (error as { code?: string })?.code;

      // Security: account hai ya nahi, ye reveal na karein
      if (code === "auth/user-not-found") {
        setEmailSent(true);

        toast.update(toastId, {
          render: "If this email is registered, a reset link has been sent.",
          type: "info",
          isLoading: false,
          autoClose: 4000,
        });
      } else {
        toast.update(toastId, {
          render: getAuthErrorMessage(error),
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[#ffe27a] bg-[#fffbea] p-4">
          <p className="text-[12px] font-bold text-black">Check your email</p>

          <p className="mt-1 text-[11px] leading-5 text-gray-600">
            We have sent a password reset link to{" "}
            <span className="break-all font-bold text-black">{email}</span>.
            Also check your spam folder.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEmailSent(false)}
          className="cursor-pointer text-[11px] font-bold text-[#b58b00] hover:underline"
        >
          Didn&apos;t receive it? Try again
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-black"
        >
          <FiArrowLeft />
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-3">
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
            placeholder="Enter registered email address"
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-[12px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#ffd51c] focus:ring-2 focus:ring-[#ffd51c]/20"
          />
        </div>
      </div>

      <ThemeBtnOne
        text={loading ? "Sending..." : "Send Reset Link"}
        type="submit"
        className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#ffd51c] text-[12px] font-extrabold text-black transition hover:bg-[#ffca00] hover:shadow-[0_6px_18px_rgba(255,213,28,0.30)]"
      />

      <button
        type="button"
        onClick={onBack}
        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-black"
      >
        <FiArrowLeft />
        Back to Login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
