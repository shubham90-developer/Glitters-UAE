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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = require("../modules/auth/auth.model");
const appError_1 = require("../errors/appError");
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            // Get token from header
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return next(new appError_1.appError("Authentication required. No token provided", 401));
            }
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Find user across different collections
            let user = yield auth_model_1.User.findById(decoded.userId);
            // await Staff.findById(decoded.userId) || 
            // await AdminStaff.findById(decoded.userId);
            if (!user) {
                return next(new appError_1.appError("User not found", 401));
            }
            // Attach user to request
            req.user = user;
            // Role-based authorization
            if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
                return next(new appError_1.appError("You do not have permission to perform this action", 403));
            }
            next();
        }
        catch (error) {
            next(new appError_1.appError("Invalid or expired token", 401));
        }
    });
};
exports.auth = auth;
// Optional auth - attaches user if token exists, but doesn't fail if missing
// Useful for public endpoints that need to show different data for authenticated users
const optionalAuth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                // No token provided - continue without user
                req.user = undefined;
                return next();
            }
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Find user
            const user = yield auth_model_1.User.findById(decoded.userId);
            if (user) {
                // Attach user to request if found
                req.user = user;
            }
            next();
        }
        catch (error) {
            // Token invalid - continue without user (don't fail)
            req.user = undefined;
            next();
        }
    });
};
exports.optionalAuth = optionalAuth;
