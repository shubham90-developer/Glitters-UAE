"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (err.name === 'CastError')
        err = (0, handleCastError_1.default)(err);
    if (err.code === 11000)
        err = (0, handleDuplicateError_1.default)(err);
    if (err.name === 'ValidationError')
        err = (0, handleValidationError_1.default)(err);
    if (err instanceof zod_1.ZodError)
        err = (0, handleZodError_1.default)(err);
    res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        errorMessages: err.errors || [{ path: '', message: err.message }],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
