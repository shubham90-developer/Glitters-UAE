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
exports.deleteUploadedFile = exports.uploadKYCDocument = exports.uploadMultipleImages = exports.uploadSingleImage = void 0;
const cloudinary_1 = require("../../config/cloudinary");
const appError_1 = require("../../errors/appError");
const cloudinary_2 = require("cloudinary");
// Upload a single image
const uploadSingleImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.file) {
            next(new appError_1.appError("No image file provided", 400));
            return;
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Image uploaded successfully",
            data: {
                url: req.file.path,
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    }
    catch (error) {
        // If error during image upload, delete the uploaded image if any
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
            const publicId = (_b = req.file.path.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('.')[0];
            if (publicId) {
                yield cloudinary_1.cloudinary.uploader.destroy(`restaurant-uploads/${publicId}`);
            }
        }
        next(error);
    }
});
exports.uploadSingleImage = uploadSingleImage;
// Upload multiple images
const uploadMultipleImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            next(new appError_1.appError("No image files provided", 400));
            return;
        }
        const uploadedFiles = req.files.map(file => ({
            url: file.path,
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        }));
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Images uploaded successfully",
            data: uploadedFiles
        });
    }
    catch (error) {
        // If error during image upload, delete the uploaded images if any
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                if (file.path) {
                    const publicId = (_a = file.path.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                    if (publicId) {
                        yield cloudinary_1.cloudinary.uploader.destroy(`restaurant-uploads/${publicId}`);
                    }
                }
            }
        }
        next(error);
    }
});
exports.uploadMultipleImages = uploadMultipleImages;
const uploadKYCDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return next(new appError_1.appError('No file uploaded', 400));
        }
        // File has already been uploaded to Cloudinary by multer middleware
        const fileUrl = req.file.path || req.file.secure_url;
        res.json({
            success: true,
            statusCode: 200,
            message: 'File uploaded successfully',
            data: {
                url: fileUrl,
                publicId: req.file.public_id
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadKYCDocument = uploadKYCDocument;
const deleteUploadedFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicId } = req.params;
        if (!publicId) {
            return next(new appError_1.appError('Public ID is required', 400));
        }
        const result = yield cloudinary_2.v2.uploader.destroy(publicId);
        res.json({
            success: true,
            statusCode: 200,
            message: 'File deleted successfully',
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUploadedFile = deleteUploadedFile;
