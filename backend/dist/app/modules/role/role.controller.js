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
exports.getAvailablePermissions = exports.deleteRoleById = exports.updateRoleById = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const role_model_1 = require("./role.model");
const role_validation_1 = require("./role.validation");
const appError_1 = require("../../errors/appError");
const createRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = role_validation_1.roleValidation.parse(req.body);
        const existing = yield role_model_1.Role.findOne({ email: validated.email, isDeleted: false });
        if (existing) {
            next(new appError_1.appError('Role with this email already exists', 400));
            return;
        }
        const role = new role_model_1.Role(validated);
        yield role.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Role created successfully',
            data: role,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createRole = createRole;
const getAllRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, page = '1', limit = '10' } = req.query;
        const filter = { isDeleted: false };
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [{ role: rx }, { email: rx }, { employeeName: rx }];
        }
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const [roles, total] = yield Promise.all([
            role_model_1.Role.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            role_model_1.Role.countDocuments(filter),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Roles retrieved successfully',
            meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
            data: roles,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRoles = getAllRoles;
const getRoleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield role_model_1.Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            next(new appError_1.appError('Role not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Role retrieved successfully', data: role });
    }
    catch (error) {
        next(error);
    }
});
exports.getRoleById = getRoleById;
const updateRoleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield role_model_1.Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            next(new appError_1.appError('Role not found', 404));
            return;
        }
        const validated = role_validation_1.roleUpdateValidation.parse(req.body);
        if (validated.email && validated.email !== role.email) {
            const existing = yield role_model_1.Role.findOne({
                email: validated.email,
                isDeleted: false,
                _id: { $ne: req.params.id },
            });
            if (existing) {
                next(new appError_1.appError('Role with this email already exists', 400));
                return;
            }
        }
        // Use .save() so bcrypt pre-save hook runs if password changes
        Object.assign(role, validated);
        yield role.save();
        res.json({
            success: true,
            statusCode: 200,
            message: 'Role updated successfully',
            data: role,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateRoleById = updateRoleById;
const deleteRoleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield role_model_1.Role.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!role) {
            next(new appError_1.appError('Role not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Role deleted successfully', data: role });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRoleById = deleteRoleById;
const getAvailablePermissions = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = [
            'Dashboard',
            'All Projects',
            'Edit Projects',
            'Delete Projects',
            'My Work',
            'Edit Work',
            'Delete Work',
            'Calendar',
            'My Note',
            'Core Team',
            'Edit Team',
            'Delete Team',
            'Reports',
            'Roles',
            'Collections',
            'Settings',
            'Invoices',
            'Project Credentials',
        ];
        res.json({
            success: true,
            statusCode: 200,
            message: 'Available permissions retrieved successfully',
            data: permissions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAvailablePermissions = getAvailablePermissions;
