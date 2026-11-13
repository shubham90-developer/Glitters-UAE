"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskStatusUpdateValidation = exports.taskUpdateValidation = exports.taskValidation = void 0;
const zod_1 = require("zod");
const taskStatusEnum = zod_1.z.enum(['new', 'scheduled', 'progress', 'completed']);
const taskPriorityEnum = zod_1.z.enum(['critical', 'high', 'medium', 'low']);
const createdInEnum = zod_1.z.enum(['team_lead', 'project_manager', 'bdm', 'ceo']);
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
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
    .optional();
exports.taskValidation = zod_1.z.object({
    projectId: objectIdSchema,
    projectName: zod_1.z.string().optional(),
    title: zod_1.z.string().min(2, 'Task title must be at least 2 characters'),
    description: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    attachment: zod_1.z.string().optional(),
    createdIn: createdInEnum.optional(),
    projectType: zod_1.z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    assignee: zod_1.z.string().optional(),
    scheduledFor: optionalDate,
    estimatedTime: zod_1.z.string().optional(),
    dueDate: optionalDate,
});
exports.taskUpdateValidation = zod_1.z.object({
    projectId: objectIdSchema,
    projectName: zod_1.z.string().optional(),
    title: zod_1.z.string().min(2, 'Task title must be at least 2 characters').optional(),
    description: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    attachment: zod_1.z.string().optional(),
    createdIn: createdInEnum.optional(),
    projectType: zod_1.z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    assignee: zod_1.z.string().optional(),
    scheduledFor: optionalDate,
    estimatedTime: zod_1.z.string().optional(),
    dueDate: optionalDate,
    isDeleted: zod_1.z.boolean().optional(),
});
exports.taskStatusUpdateValidation = zod_1.z.object({
    status: taskStatusEnum,
});
