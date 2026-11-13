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
exports.deleteProjectById = exports.updateProjectById = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const project_model_1 = require("./project.model");
const project_validation_1 = require("./project.validation");
const appError_1 = require("../../errors/appError");
const cloudinary_1 = require("../../config/cloudinary");
// Helper: remove a cloudinary asset uploaded under the projects folder, if any
const removeProjectAsset = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!filePath)
        return;
    try {
        const publicId = (_a = filePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
        if (publicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(`projects/${publicId}`);
        }
    }
    catch (_b) {
        // best-effort cleanup
    }
});
const createProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const payload = Object.assign({}, req.body);
        // Attach uploaded file URL if present
        if (req.file) {
            payload.file = req.file.path;
        }
        const validatedData = project_validation_1.projectValidation.parse(payload);
        // Duplicate name check (soft-delete aware)
        const existing = yield project_model_1.Project.findOne({
            name: validatedData.name,
            isDeleted: false,
        });
        if (existing) {
            yield removeProjectAsset((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            next(new appError_1.appError('Project with this name already exists', 400));
            return;
        }
        const project = new project_model_1.Project(validatedData);
        yield project.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Project created successfully',
            data: project,
        });
        return;
    }
    catch (error) {
        yield removeProjectAsset((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        next(error);
    }
});
exports.createProject = createProject;
const getAllProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, priority, projectManager, search, page = '1', limit = '10', } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        if (projectManager)
            filter.projectManager = projectManager;
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [
                { name: rx },
                { description: rx },
                { quotationNumber: rx },
                { lpoNumber: rx },
                { ownerName: rx },
                { ownerEmail: rx },
            ];
        }
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const [projects, total] = yield Promise.all([
            project_model_1.Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            project_model_1.Project.countDocuments(filter),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Projects retrieved successfully',
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
            data: projects,
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProjects = getAllProjects;
const getProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield project_model_1.Project.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!project) {
            next(new appError_1.appError('Project not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Project retrieved successfully',
            data: project,
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getProjectById = getProjectById;
const updateProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const projectId = req.params.id;
        const project = yield project_model_1.Project.findOne({
            _id: projectId,
            isDeleted: false,
        });
        if (!project) {
            yield removeProjectAsset((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            next(new appError_1.appError('Project not found', 404));
            return;
        }
        const payload = Object.assign({}, req.body);
        if (req.file) {
            payload.file = req.file.path;
        }
        const validatedData = project_validation_1.projectUpdateValidation.parse(payload);
        // Duplicate name check when name is being changed
        if (validatedData.name && validatedData.name !== project.name) {
            const existing = yield project_model_1.Project.findOne({
                name: validatedData.name,
                isDeleted: false,
                _id: { $ne: projectId },
            });
            if (existing) {
                yield removeProjectAsset((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
                next(new appError_1.appError('Project with this name already exists', 400));
                return;
            }
        }
        // If a new file was uploaded, remove the old one
        if (req.file && project.file) {
            yield removeProjectAsset(project.file);
        }
        const updated = yield project_model_1.Project.findByIdAndUpdate(projectId, validatedData, {
            new: true,
        });
        res.json({
            success: true,
            statusCode: 200,
            message: 'Project updated successfully',
            data: updated,
        });
        return;
    }
    catch (error) {
        yield removeProjectAsset((_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
        next(error);
    }
});
exports.updateProjectById = updateProjectById;
const deleteProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield project_model_1.Project.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!project) {
            next(new appError_1.appError('Project not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Project deleted successfully',
            data: project,
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProjectById = deleteProjectById;
