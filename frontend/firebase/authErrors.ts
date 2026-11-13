export const getAuthErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid mobile number. Please check and try again.";
    case "auth/missing-phone-number":
      return "Please enter your mobile number.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again after some time.";
    case "auth/quota-exceeded":
      return "SMS limit reached. Please try again later.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    case "auth/invalid-verification-code":
      return "Incorrect OTP. Please try again.";
    case "auth/code-expired":
    case "auth/session-expired":
      return "OTP expired. Please request a new OTP.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please login instead.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/operation-not-allowed":
      return "This login method is currently unavailable. Please try again later.";
    default:
      return (
        (error as Error)?.message || "Something went wrong. Please try again."
      );
  }
};
