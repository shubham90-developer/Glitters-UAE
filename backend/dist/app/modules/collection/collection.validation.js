"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionUpdateValidation = exports.collectionValidation = void 0;
const zod_1 = require("zod");
const statusEnum = zod_1.z.enum(['paid', 'unpaid', 'pending']);
const priorityEnum = zod_1.z.enum(['critical', 'high', 'medium', 'low']);
const paymentMethodEnum = zod_1.z.enum([
    'cash',
    'cheque',
    'dd',
    'bank_transfer',
    'card',
    'upi',
    'gpay',
    'phonepe',
    'paytm',
    'wallet',
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
exports.collectionValidation = zod_1.z.object({
    projectName: zod_1.z.string().min(2, 'Project name must be at least 2 characters'),
    quotationNumber: zod_1.z.string().optional(),
    lpoNumber: zod_1.z.string().optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    ownerName: zod_1.z.string().optional(),
    ownerMobile: zod_1.z.string().optional(),
    ownerEmail: zod_1.z.union([zod_1.z.string().email(), zod_1.z.string().length(0)]).optional(),
    ownerAddress: zod_1.z.string().optional(),
    totalAmount: optionalNumber,
    firstInstallment: optionalNumber,
    secondInstallment: optionalNumber,
    thirdInstallment: optionalNumber,
    advanceAmount: optionalNumber,
    additionalCharges: optionalNumber,
    tax: optionalNumber,
    gst: optionalNumber,
    discount: optionalNumber,
    receivedAmount: optionalNumber,
    pendingAmount: optionalNumber,
    paymentMethod: paymentMethodEnum.optional(),
    paymentDate: optionalDate,
    dueDate: optionalDate,
    duration: zod_1.z.string().optional(),
    assignedTo: zod_1.z.string().optional(),
    progress: optionalNumber,
});
exports.collectionUpdateValidation = zod_1.z.object({
    projectName: zod_1.z.string().min(2).optional(),
    quotationNumber: zod_1.z.string().optional(),
    lpoNumber: zod_1.z.string().optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    ownerName: zod_1.z.string().optional(),
    ownerMobile: zod_1.z.string().optional(),
    ownerEmail: zod_1.z.union([zod_1.z.string().email(), zod_1.z.string().length(0)]).optional(),
    ownerAddress: zod_1.z.string().optional(),
    totalAmount: optionalNumber,
    firstInstallment: optionalNumber,
    secondInstallment: optionalNumber,
    thirdInstallment: optionalNumber,
    advanceAmount: optionalNumber,
    additionalCharges: optionalNumber,
    tax: optionalNumber,
    gst: optionalNumber,
    discount: optionalNumber,
    receivedAmount: optionalNumber,
    pendingAmount: optionalNumber,
    paymentMethod: paymentMethodEnum.optional(),
    paymentDate: optionalDate,
    dueDate: optionalDate,
    duration: zod_1.z.string().optional(),
    assignedTo: zod_1.z.string().optional(),
    progress: optionalNumber,
    isDeleted: zod_1.z.boolean().optional(),
});
