"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventUpdateValidation = exports.eventValidation = void 0;
const zod_1 = require("zod");
const categoryEnum = zod_1.z.enum([
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-info',
    'bg-warning',
    'bg-danger',
    'bg-dark',
]);
const optionalDate = zod_1.z
    .union([zod_1.z.string(), zod_1.z.date()])
    .optional()
    .transform((val) => {
    if (val === undefined || val === null || val === '')
        return undefined;
    const d = val instanceof Date ? val : new Date(val);
    if (isNaN(d.getTime()))
        throw new Error('Invalid date format');
    return d;
});
const optionalBool = zod_1.z
    .union([zod_1.z.boolean(), zod_1.z.string()])
    .optional()
    .transform((val) => {
    if (val === undefined || val === null)
        return undefined;
    if (typeof val === 'boolean')
        return val;
    return val === 'true';
});
exports.eventValidation = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Event title is required'),
    description: zod_1.z.string().optional(),
    category: categoryEnum.optional(),
    start: optionalDate,
    end: optionalDate,
    allDay: optionalBool,
});
exports.eventUpdateValidation = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    category: categoryEnum.optional(),
    start: optionalDate,
    end: optionalDate,
    allDay: optionalBool,
    isDeleted: zod_1.z.boolean().optional(),
});
