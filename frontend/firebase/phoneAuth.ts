import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "./config";

let confirmationResult: ConfirmationResult | null = null;

export const sendPhoneOTP = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier,
) => {
  confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    recaptchaVerifier,
  );

  return confirmationResult;
};

export const verifyPhoneOTP = async (otp: string) => {
  if (!confirmationResult) {
    throw new Error("OTP session expired. Please request OTP again.");
  }

  const result = await confirmationResult.confirm(otp);

  return result.user;
};
