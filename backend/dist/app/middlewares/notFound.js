"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../errors/appError");
const notFound = (req, res, next) => {
    const err = new appError_1.appError('Not Found', 404);
    next(err);
};
exports.default = notFound;
