"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const cloudinary_1 = require("../../config/cloudinary");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const upload_controller_1 = require("./upload.controller");
const router = express_1.default.Router();
// Upload a single image (requires authentication)
router.post('/single', (0, authMiddleware_1.auth)(), cloudinary_1.upload.single('image'), upload_controller_1.uploadSingleImage);
// Upload multiple images (requires authentication)
router.post('/multiple', (0, authMiddleware_1.auth)(), cloudinary_1.upload.array('images', 10), upload_controller_1.uploadMultipleImages);
// Upload KYC document (public route for KYC form)
router.post('/kyc-document', cloudinary_1.upload.single('document'), upload_controller_1.uploadKYCDocument);
// Get a list of uploaded files (requires admin privileges, for example)
// router.get('/', authMiddleware, adminMiddleware, listUploadedFiles);
// Delete an uploaded file by public ID (requires authentication and ownership/admin privileges)
router.delete('/delete/:publicId', (0, authMiddleware_1.auth)(), upload_controller_1.deleteUploadedFile);
exports.uploadRouter = router;
