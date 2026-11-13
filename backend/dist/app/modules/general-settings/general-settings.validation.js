"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalSettingsValidation = void 0;
const zod_1 = require("zod");
exports.generalSettingsValidation = zod_1.z
    .object({
    username: zod_1.z.string().min(2, 'Username must be at least 2 characters').optional(),
    changePassword: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional(),
    confirmPassword: zod_1.z.string().optional(),
    // logo handled separately via file upload (cloudinary URL injected by controller)
    logo: zod_1.z.string().optional(),
})
    .refine((data) => {
    if (data.changePassword || data.confirmPassword) {
        return data.changePassword === data.confirmPassword;
    }
    return true;
}, { message: 'changePassword and confirmPassword do not match', path: ['confirmPassword'] });
