"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceUpdateValidation = exports.invoiceValidation = void 0;
const zod_1 = require("zod");
const statusEnum = zod_1.z.enum(['paid', 'pending', 'cancel']);
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
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
    .optional();
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
const issuedFromSchema = zod_1.z
    .union([
    zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.union([zod_1.z.string().email(), zod_1.z.string().length(0)]).optional(),
        address: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
    }),
    zod_1.z.string(),
])
    .optional()
    .transform((val) => {
    if (val === undefined)
        return undefined;
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        }
        catch (_a) {
            throw new Error('issuedFrom must be an object or JSON object string');
        }
    }
    return val;
});
exports.invoiceValidation = zod_1.z.object({
    projectId: objectIdSchema,
    invoiceNumber: zod_1.z.string().min(1, 'Invoice number is required'),
    issueDate: optionalDate,
    dueDate: optionalDate,
    status: statusEnum.optional(),
    paymentMethod: paymentMethodEnum.optional(),
    issuedFrom: issuedFromSchema,
    firstInstallment: optionalNumber,
    secondInstallment: optionalNumber,
    thirdInstallment: optionalNumber,
    totalAmount: optionalNumber,
    discount: optionalNumber,
    estimatedTax: optionalNumber,
    gst: optionalNumber,
    grandTotal: optionalNumber,
});
exports.invoiceUpdateValidation = exports.invoiceValidation
    .partial()
    .extend({ isDeleted: zod_1.z.boolean().optional() });
