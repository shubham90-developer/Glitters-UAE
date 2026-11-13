"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteUpdateValidation = exports.noteValidation = void 0;
const zod_1 = require("zod");
exports.noteValidation = zod_1.z.object({
    content: zod_1.z.string().optional(),
});
exports.noteUpdateValidation = zod_1.z.object({
    content: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
