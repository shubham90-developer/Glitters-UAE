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
exports.deleteProjectCredentialById = exports.updateProjectCredentialById = exports.getProjectCredentialById = exports.getAllProjectCredentials = exports.createProjectCredential = void 0;
const project_credential_model_1 = require("./project-credential.model");
const project_credential_validation_1 = require("./project-credential.validation");
const appError_1 = require("../../errors/appError");
const createProjectCredential = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = project_credential_validation_1.projectCredentialValidation.parse(req.body);
        const credential = new project_credential_model_1.ProjectCredential(validated);
        yield credential.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Project credential created successfully',
            data: credential,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createProjectCredential = createProjectCredential;
const getAllProjectCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, page = '1', limit = '10' } = req.query;
        const filter = { isDeleted: false };
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [{ projectName: rx }, { description: rx }];
        }
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const [credentials, total] = yield Promise.all([
            project_credential_model_1.ProjectCredential.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            project_credential_model_1.ProjectCredential.countDocuments(filter),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Project credentials retrieved successfully',
            meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
            data: credentials,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProjectCredentials = getAllProjectCredentials;
const getProjectCredentialById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credential = yield project_credential_model_1.ProjectCredential.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!credential) {
            next(new appError_1.appError('Project credential not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Project credential retrieved successfully',
            data: credential,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProjectCredentialById = getProjectCredentialById;
const updateProjectCredentialById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = project_credential_validation_1.projectCredentialUpdateValidation.parse(req.body);
        const updated = yield project_credential_model_1.ProjectCredential.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, validated, { new: true });
        if (!updated) {
            next(new appError_1.appError('Project credential not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Project credential updated successfully',
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProjectCredentialById = updateProjectCredentialById;
const deleteProjectCredentialById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credential = yield project_credential_model_1.ProjectCredential.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!credential) {
            next(new appError_1.appError('Project credential not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Project credential deleted successfully',
            data: credential,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProjectCredentialById = deleteProjectCredentialById;
