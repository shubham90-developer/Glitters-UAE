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
exports.deleteTeamMemberById = exports.updateTeamMemberById = exports.getTeamMemberById = exports.getAllTeamMembers = exports.createTeamMember = void 0;
const team_member_model_1 = require("./team-member.model");
const team_member_validation_1 = require("./team-member.validation");
const appError_1 = require("../../errors/appError");
const cloudinary_1 = require("../../config/cloudinary");
const removeAvatar = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!filePath)
        return;
    try {
        const publicId = (_a = filePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
        if (publicId)
            yield cloudinary_1.cloudinary.uploader.destroy(`team-members/${publicId}`);
    }
    catch (_b) {
        /* best-effort */
    }
});
const createTeamMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const payload = Object.assign({}, req.body);
        if (req.file)
            payload.avatar = req.file.path;
        const validated = team_member_validation_1.teamMemberValidation.parse(payload);
        if (validated.email) {
            const existing = yield team_member_model_1.TeamMember.findOne({ email: validated.email, isDeleted: false });
            if (existing) {
                yield removeAvatar((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
                next(new appError_1.appError('Team member with this email already exists', 400));
                return;
            }
        }
        const member = new team_member_model_1.TeamMember(validated);
        yield member.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Team member created successfully',
            data: member,
        });
    }
    catch (error) {
        yield removeAvatar((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
        next(error);
    }
});
exports.createTeamMember = createTeamMember;
const getAllTeamMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [
                { name: rx },
                { employeeId: rx },
                { email: rx },
                { designation: rx },
                { mobile: rx },
            ];
        }
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const [members, total] = yield Promise.all([
            team_member_model_1.TeamMember.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            team_member_model_1.TeamMember.countDocuments(filter),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Team members retrieved successfully',
            meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
            data: members,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTeamMembers = getAllTeamMembers;
const getTeamMemberById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const member = yield team_member_model_1.TeamMember.findOne({ _id: req.params.id, isDeleted: false });
        if (!member) {
            next(new appError_1.appError('Team member not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Team member retrieved successfully',
            data: member,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getTeamMemberById = getTeamMemberById;
const updateTeamMemberById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const member = yield team_member_model_1.TeamMember.findOne({ _id: req.params.id, isDeleted: false });
        if (!member) {
            yield removeAvatar((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            next(new appError_1.appError('Team member not found', 404));
            return;
        }
        const payload = Object.assign({}, req.body);
        if (req.file)
            payload.avatar = req.file.path;
        const validated = team_member_validation_1.teamMemberUpdateValidation.parse(payload);
        if (validated.email && validated.email !== member.email) {
            const existing = yield team_member_model_1.TeamMember.findOne({
                email: validated.email,
                isDeleted: false,
                _id: { $ne: req.params.id },
            });
            if (existing) {
                yield removeAvatar((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
                next(new appError_1.appError('Team member with this email already exists', 400));
                return;
            }
        }
        if (req.file && member.avatar)
            yield removeAvatar(member.avatar);
        const updated = yield team_member_model_1.TeamMember.findByIdAndUpdate(req.params.id, validated, { new: true });
        res.json({
            success: true,
            statusCode: 200,
            message: 'Team member updated successfully',
            data: updated,
        });
    }
    catch (error) {
        yield removeAvatar((_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
        next(error);
    }
});
exports.updateTeamMemberById = updateTeamMemberById;
const deleteTeamMemberById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const member = yield team_member_model_1.TeamMember.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!member) {
            next(new appError_1.appError('Team member not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Team member deleted successfully',
            data: member,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTeamMemberById = deleteTeamMemberById;
