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
exports.staffMiddleware = void 0;
const appError_1 = require("../errors/appError");
const staffMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user exists in request (set by authMiddleware)
        if (!req.user) {
            return next(new appError_1.appError("Authentication required", 401));
        }
        // Check if user is a staff member
        if (req.user.role !== 'staff') {
            return next(new appError_1.appError("Access denied. Staff access required", 403));
        }
        // Check if staff is active
        if (req.user.status !== 'active') {
            return next(new appError_1.appError("Your account is inactive", 403));
        }
        // User is a staff member, proceed to next middleware
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.staffMiddleware = staffMiddleware;
