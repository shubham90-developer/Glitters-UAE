"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleUpdateValidation = exports.roleValidation = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
    .optional();
const permissionsSchema = zod_1.z
    .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
    .optional()
    .transform((val) => {
    if (val === undefined || val === null)
        return [];
    if (Array.isArray(val))
        return val.filter((v) => typeof v === 'string' && v.trim() !== '');
    const trimmed = val.trim();
    if (trimmed === '')
        return [];
    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed.map((v) => String(v)).filter((v) => v.trim() !== '');
        }
    }
    catch (_a) {
        /* fallthrough */
    }
    return trimmed.split(',').map((v) => v.trim()).filter((v) => v !== '');
});
exports.roleValidation = zod_1.z.object({
    employeeId: objectIdSchema,
    employeeName: zod_1.z.string().optional(),
    role: zod_1.z.string().min(2, 'Role must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    permissions: permissionsSchema,
});
exports.roleUpdateValidation = zod_1.z.object({
    employeeId: objectIdSchema,
    employeeName: zod_1.z.string().optional(),
    role: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    permissions: permissionsSchema,
    isDeleted: zod_1.z.boolean().optional(),
});
