"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("./appError");
const handleZodError = (err) => {
    const errors = err.issues.map((e) => ({ path: e.path.join('. '), message: e.message }));
    const message = 'Invalid input data. ';
    return new appError_1.appError(message + JSON.stringify(errors), 400);
};
exports.default = handleZodError;
