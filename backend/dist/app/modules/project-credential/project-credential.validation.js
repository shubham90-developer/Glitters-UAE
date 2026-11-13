"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectCredentialUpdateValidation = exports.projectCredentialValidation = void 0;
const zod_1 = require("zod");
exports.projectCredentialValidation = zod_1.z.object({
    projectName: zod_1.z.string().min(2, 'Project name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
});
exports.projectCredentialUpdateValidation = zod_1.z.object({
    projectName: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
