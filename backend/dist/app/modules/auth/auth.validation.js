"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appleAuthValidation = exports.googleAuthValidation = exports.verifyOtpValidation = exports.requestOtpValidation = exports.updateUserValidation = exports.emailCheckValidation = exports.phoneCheckValidation = exports.activateUserValidation = exports.resetPasswordValidation = exports.loginValidation = exports.authValidation = void 0;
const zod_1 = require("zod");
// International phone validation: digits only, 7-15 digits (E.164 without '+')
// Accepts phone numbers with country code, e.g. "8801617660907" (BD), "919876543210" (IN)
const internationalPhoneRegex = /^\d{7,15}$/;
// Function to validate international phone number (digits only with country code)
const validatePhone = (phone) => {
    // Remove any '+' prefix, spaces, dashes
    let cleanedPhone = phone.replace(/[\s\-\+]/g, '').trim();
    if (!internationalPhoneRegex.test(cleanedPhone)) {
        throw new Error("Invalid phone number. Please provide your full phone number with country code (digits only, 7-15 digits).");
    }
    return cleanedPhone;
};
// Optional phone validation - only validates if phone is provided and not empty
const optionalPhone = zod_1.z.string().optional().transform((val) => {
    // If empty or undefined, return undefined (skip validation)
    if (!val || val.trim() === '') {
        return undefined;
    }
    const cleanedPhone = val.replace(/[\s\-\+]/g, '').trim();
    if (!internationalPhoneRegex.test(cleanedPhone)) {
        throw new Error("Invalid phone number. Please provide your full phone number with country code (digits only, 7-15 digits).");
    }
    return cleanedPhone;
});
exports.authValidation = zod_1.z.object({
    name: zod_1.z.string(),
    password: zod_1.z.string().min(6),
    phone: optionalPhone,
    email: zod_1.z.string().email("Invalid email format"),
    img: zod_1.z.string().optional(),
    role: zod_1.z.enum(['admin', 'vendor', 'user']).default('user').optional()
});
exports.loginValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string()
});
exports.resetPasswordValidation = zod_1.z.object({
    phone: zod_1.z.string().refine(validatePhone, {
        message: "Invalid phone number. Please provide your full phone number with country code."
    }),
    newPassword: zod_1.z.string().min(6)
});
exports.activateUserValidation = zod_1.z.object({
    phone: zod_1.z.string().refine(validatePhone, {
        message: "Invalid phone number. Please provide your full phone number with country code."
    })
});
exports.phoneCheckValidation = zod_1.z.object({
    phone: zod_1.z.string().refine(validatePhone, {
        message: "Invalid phone number. Please provide your full phone number with country code."
    })
});
exports.emailCheckValidation = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format")
});
exports.updateUserValidation = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: optionalPhone,
    email: zod_1.z.union([
        zod_1.z.string().email("Invalid email format"),
        zod_1.z.string().length(0) // Allow empty string
    ]).optional(),
    img: zod_1.z.string().optional(),
    role: zod_1.z.enum(['admin', 'vendor', 'user']).optional(),
});
exports.requestOtpValidation = zod_1.z.object({
    phone: zod_1.z.string().refine(validatePhone, {
        message: "Invalid phone number. Please provide your full phone number with country code."
    })
});
exports.verifyOtpValidation = zod_1.z.object({
    phone: zod_1.z.string().refine(validatePhone, {
        message: "Invalid phone number. Please provide your full phone number with country code."
    }),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits")
});
// Google Auth validation
exports.googleAuthValidation = zod_1.z.object({
    idToken: zod_1.z.string().min(1, "Firebase ID token is required")
});
// Apple Auth validation
exports.appleAuthValidation = zod_1.z.object({
    idToken: zod_1.z.string().min(1, "Apple ID token is required"),
    userIdentifier: zod_1.z.string().nullable().optional(),
    authorizationCode: zod_1.z.string().optional(),
    fullName: zod_1.z.object({
        givenName: zod_1.z.string().nullable().optional(),
        familyName: zod_1.z.string().nullable().optional()
    }).optional(),
    email: zod_1.z.string().email().nullable().optional()
});
