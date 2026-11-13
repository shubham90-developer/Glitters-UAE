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
exports.permissionMiddleware = void 0;
const appError_1 = require("../errors/appError");
const permissionMiddleware = (requiredPermission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if user exists in request (set by authMiddleware)
            if (!req.user) {
                throw new appError_1.appError('Authentication required', 401);
            }
            // Admin has all permissions
            if (req.user.role === 'admin') {
                return next();
            }
            // Check admin staff permissions
            if (req.user.role === 'admin-staff') {
                if (!req.user.permissions || !req.user.permissions[requiredPermission]) {
                    throw new appError_1.appError(`Access denied. You don't have permission to access ${requiredPermission}`, 403);
                }
                return next();
            }
            // For other roles, deny access
            throw new appError_1.appError('Insufficient permissions', 403);
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                statusCode: error.statusCode || 500,
                message: error.message || 'Permission check failed'
            });
        }
    });
};
exports.permissionMiddleware = permissionMiddleware;
