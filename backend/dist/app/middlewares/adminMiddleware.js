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
exports.adminMiddleware = void 0;
const appError_1 = require("../errors/appError");
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user exists in request (set by authMiddleware)
        if (!req.user) {
            throw new appError_1.appError('Authentication required', 401);
        }
        // Check if user is admin
        if (req.user.role !== 'admin') {
            throw new appError_1.appError('Admin access required. You do not have sufficient permissions.', 403);
        }
        // Check if user is active
        if (req.user.status !== 'active') {
            throw new appError_1.appError('Account is not active', 403);
        }
        next();
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            statusCode: error.statusCode || 500,
            message: error.message || 'Admin authorization failed'
        });
    }
});
exports.adminMiddleware = adminMiddleware;
