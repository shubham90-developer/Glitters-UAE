"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("./appError");
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.appError(message, 400);
};
exports.default = handleCastError;
