"use client";

import { FormEvent, useRef, useState } from "react";
import { FiPhone, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import ThemeBtnOne from "./ThemeBtnOne";
import { sendPhoneOTP, verifyPhoneOTP } from "@/firebase/phoneAuth";
import { getAuthErrorMessage } from "@/firebase/authErrors";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useSyncUserMutation } from "@/store/authApi"; // ADDED

const MobileOtpLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [syncUser] = useSyncUserMutation(); // ADDED

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const setupRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
    return recaptchaRef.current;
  };

  const resetRecaptcha = () => {
    try {
      recaptchaRef.current?.clear();
    } catch {}
    recaptchaRef.current = null;
  };

  const sendOtp = async (isResend = false) => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (loading) return;
    setLoading(true);

    const toastId = toast.loading(
      isResend ? "Resending OTP..." : "Sending OTP...",
    );

    try {
      const verifier = setupRecaptcha();
      await sendPhoneOTP(`+91${phone}`, verifier);

      setOtpSent(true);
      setOtp("");

      toast.update(toastId, {
        render: `OTP sent to +91 ${phone}`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      resetRecaptcha(); // next attempt ke liye fresh reCAPTCHA

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

  const handleSendOTP = (e: FormEvent) => {
    e.preventDefault();
    sendOtp(false);
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6 digit OTP.");
      return;
    }

    if (loading) return;
    setLoading(true);

    const toastId = toast.loading("Verifying OTP...");

    try {
      // 1. Verify OTP with Firebase (user is now signed in)
      await verifyPhoneOTP(otp);

      // 2. Sync user with backend (POST /auth/sync)
      // authApi automatically adds: Authorization: Bearer <firebase token>
      // Phone number is taken by the backend from the verified token.
      await syncUser({}).unwrap();

      toast.update(toastId, {
        render: "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);

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
    <>
      {!otpSent ? (
        /* STEP 1 : ENTER MOBILE */
        <form onSubmit={handleSendOTP}>
          <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
            Mobile Number
          </label>

          <div className="flex h-11 overflow-hidden rounded-xl border border-gray-200 transition focus-within:border-[#ffd51c] focus-within:ring-2 focus-within:ring-[#ffd51c]/20">
            <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-[12px] font-semibold text-black">
              +91
            </div>

            <div className="relative flex-1">
              <FiPhone
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter mobile number"
                className="h-full w-full bg-white pl-9 pr-3 text-[12px] text-black outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <ThemeBtnOne
            text={loading ? "Sending..." : "Get OTP"}
            type="submit"
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#ffd51c] text-[12px] font-extrabold text-black transition hover:bg-[#ffca00] hover:shadow-[0_6px_18px_rgba(255,213,28,0.30)]"
          />
        </form>
      ) : (
        /* STEP 2 : VERIFY OTP */
        <form onSubmit={handleVerifyOTP}>
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
            }}
            className="mb-4 flex cursor-pointer items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-black"
          >
            <FiArrowLeft />
            Change Mobile Number
          </button>

          <div className="rounded-xl border border-[#ffe27a] bg-[#fffbea] p-3">
            <p className="text-[10px] text-gray-500">OTP sent to</p>
            <p className="mt-0.5 text-[12px] font-bold text-black">
              +91 {phone}
            </p>
          </div>

          <label className="mb-1.5 mt-4 block text-[11px] font-semibold text-gray-700">
            Enter OTP
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6 digit OTP"
            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-center text-[16px] font-bold tracking-[8px] text-black outline-none transition placeholder:text-[11px] placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-[#ffd51c] focus:ring-2 focus:ring-[#ffd51c]/20"
          />

          <div className="mt-2 flex justify-between">
            <span className="text-[10px] text-gray-400">
              Didn&apos;t receive OTP?
            </span>
            <button
              type="button"
              onClick={() => sendOtp(true)}
              disabled={loading}
              className="cursor-pointer text-[10px] font-bold text-[#b58b00] hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>

          <ThemeBtnOne
            text={loading ? "Verifying..." : "Verify & Login"}
            type="submit"
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#ffd51c] text-[12px] font-extrabold text-black transition hover:bg-[#ffca00] hover:shadow-[0_6px_18px_rgba(255,213,28,0.30)]"
          />
        </form>
      )}

      {/* Dono steps mein hamesha rahega */}
      <div id="recaptcha-container" />
    </>
  );
};

export default MobileOtpLogin;
