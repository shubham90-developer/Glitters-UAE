"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamMemberUpdateValidation = exports.teamMemberValidation = void 0;
const zod_1 = require("zod");
const statusEnum = zod_1.z.enum(['active', 'inactive']);
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
exports.teamMemberValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    employeeId: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    email: zod_1.z.union([zod_1.z.string().email('Invalid email format'), zod_1.z.string().length(0)]).optional(),
    mobile: zod_1.z.string().optional(),
    joiningDate: optionalDate,
    status: statusEnum.optional(),
    avatar: zod_1.z.string().optional(),
});
exports.teamMemberUpdateValidation = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    employeeId: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    email: zod_1.z.union([zod_1.z.string().email('Invalid email format'), zod_1.z.string().length(0)]).optional(),
    mobile: zod_1.z.string().optional(),
    joiningDate: optionalDate,
    status: statusEnum.optional(),
    avatar: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
