"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskById = exports.updateTaskStatus = exports.updateTaskById = exports.getTaskById = exports.getKanbanTasks = exports.getAllTasks = exports.createTask = void 0;
const task_model_1 = require("./task.model");
const task_validation_1 = require("./task.validation");
const appError_1 = require("../../errors/appError");
const cloudinary_1 = require("../../config/cloudinary");
const removeTaskAsset = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!filePath)
        return;
    try {
        const publicId = (_a = filePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
        if (publicId)
            yield cloudinary_1.cloudinary.uploader.destroy(`tasks/${publicId}`);
    }
    catch (_b) {
        /* best-effort */
    }
});
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = Object.assign({}, req.body);
        if (req.file)
            payload.attachment = req.file.path;
        const validated = task_validation_1.taskValidation.parse(payload);
        const task = new task_model_1.Task(validated);
        yield task.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Task created successfully',
            data: task,
        });
    }
    catch (error) {
        yield removeTaskAsset((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        next(error);
    }
});
exports.createTask = createTask;
const getAllTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, priority, assignee, projectId, search, page = '1', limit = '10', } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        if (assignee)
            filter.assignee = assignee;
        if (projectId)
            filter.projectId = projectId;
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [{ title: rx }, { description: rx }, { projectName: rx }];
        }
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const [tasks, total] = yield Promise.all([
            task_model_1.Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            task_model_1.Task.countDocuments(filter),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Tasks retrieved successfully',
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
            data: tasks,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTasks = getAllTasks;
const getKanbanTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assignee, projectId } = req.query;
        const filter = { isDeleted: false };
        if (assignee)
            filter.assignee = assignee;
        if (projectId)
            filter.projectId = projectId;
        const tasks = yield task_model_1.Task.find(filter).sort({ createdAt: -1 });
        const grouped = {
            new: tasks.filter((t) => t.status === 'new'),
            scheduled: tasks.filter((t) => t.status === 'scheduled'),
            progress: tasks.filter((t) => t.status === 'progress'),
            completed: tasks.filter((t) => t.status === 'completed'),
        };
        res.json({
            success: true,
            statusCode: 200,
            message: 'Kanban tasks retrieved successfully',
            data: grouped,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getKanbanTasks = getKanbanTasks;
const getTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_model_1.Task.findOne({ _id: req.params.id, isDeleted: false });
        if (!task) {
            next(new appError_1.appError('Task not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Task retrieved successfully', data: task });
    }
    catch (error) {
        next(error);
    }
});
exports.getTaskById = getTaskById;
const updateTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const task = yield task_model_1.Task.findOne({ _id: req.params.id, isDeleted: false });
        if (!task) {
            yield removeTaskAsset((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            next(new appError_1.appError('Task not found', 404));
            return;
        }
        const payload = Object.assign({}, req.body);
        if (req.file)
            payload.attachment = req.file.path;
        const validated = task_validation_1.taskUpdateValidation.parse(payload);
        if (req.file && task.attachment)
            yield removeTaskAsset(task.attachment);
        const updated = yield task_model_1.Task.findByIdAndUpdate(req.params.id, validated, { new: true });
        res.json({
            success: true,
            statusCode: 200,
            message: 'Task updated successfully',
            data: updated,
        });
    }
    catch (error) {
        yield removeTaskAsset((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        next(error);
    }
});
exports.updateTaskById = updateTaskById;
const updateTaskStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = task_validation_1.taskStatusUpdateValidation.parse(req.body);
        const updated = yield task_model_1.Task.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { status }, { new: true });
        if (!updated) {
            next(new appError_1.appError('Task not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Task status updated successfully',
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateTaskStatus = updateTaskStatus;
const deleteTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_model_1.Task.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!task) {
            next(new appError_1.appError('Task not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Task deleted successfully', data: task });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTaskById = deleteTaskById;
