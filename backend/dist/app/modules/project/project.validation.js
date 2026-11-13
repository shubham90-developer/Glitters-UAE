"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectUpdateValidation = exports.projectValidation = void 0;
const zod_1 = require("zod");
const projectStatusEnum = zod_1.z.enum([
    'new',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled',
]);
const projectPriorityEnum = zod_1.z.enum(['critical', 'high', 'medium', 'low']);
// Accepts string / array of strings / JSON-stringified array and normalizes to string[]
const assignedMembersSchema = zod_1.z
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
    // Try JSON parse for `["a","b"]` style payloads from multipart/form-data
    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed
                .map((v) => String(v))
                .filter((v) => v.trim() !== '');
        }
    }
    catch (_a) {
        // fallthrough to comma-split
    }
    return trimmed
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== '');
});
const optionalDate = zod_1.z
    .union([zod_1.z.string(), zod_1.z.date()])
    .optional()
    .transform((val) => {
    if (val === undefined || val === null || val === '')
        return undefined;
    const d = val instanceof Date ? val : new Date(val);
    if (isNaN(d.getTime())) {
        throw new Error('Invalid date format');
    }
    return d;
});
const optionalNumber = zod_1.z
    .union([zod_1.z.number(), zod_1.z.string()])
    .optional()
    .transform((val) => {
    if (val === undefined || val === null || val === '')
        return undefined;
    const n = typeof val === 'number' ? val : Number(val);
    if (isNaN(n))
        throw new Error('Invalid number');
    return n;
});
exports.projectValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Project name must be at least 2 characters long'),
    description: zod_1.z.string().optional(),
    quotationNumber: zod_1.z.string().optional(),
    lpoNumber: zod_1.z.string().optional(),
    status: projectStatusEnum.optional(),
    priority: projectPriorityEnum.optional(),
    projectType: zod_1.z.string().optional(),
    assignedMembers: assignedMembersSchema,
    ownerName: zod_1.z.string().optional(),
    ownerMobile: zod_1.z.string().optional(),
    ownerEmail: zod_1.z
        .union([zod_1.z.string().email('Invalid email format'), zod_1.z.string().length(0)])
        .optional(),
    ownerAddress: zod_1.z.string().optional(),
    projectManager: zod_1.z.string().optional(),
    startDate: optionalDate,
    endDate: optionalDate,
    duration: zod_1.z.string().optional(),
    progress: optionalNumber,
    file: zod_1.z.string().optional(),
    refUrl: zod_1.z.string().optional(),
});
exports.projectUpdateValidation = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Project name must be at least 2 characters long')
        .optional(),
    description: zod_1.z.string().optional(),
    quotationNumber: zod_1.z.string().optional(),
    lpoNumber: zod_1.z.string().optional(),
    status: projectStatusEnum.optional(),
    priority: projectPriorityEnum.optional(),
    projectType: zod_1.z.string().optional(),
    assignedMembers: assignedMembersSchema,
    ownerName: zod_1.z.string().optional(),
    ownerMobile: zod_1.z.string().optional(),
    ownerEmail: zod_1.z
        .union([zod_1.z.string().email('Invalid email format'), zod_1.z.string().length(0)])
        .optional(),
    ownerAddress: zod_1.z.string().optional(),
    projectManager: zod_1.z.string().optional(),
    startDate: optionalDate,
    endDate: optionalDate,
    duration: zod_1.z.string().optional(),
    progress: optionalNumber,
    file: zod_1.z.string().optional(),
    refUrl: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
