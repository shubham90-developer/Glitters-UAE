"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Create storage engine
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: (req, file) => {
            if (req.originalUrl.includes('/products')) {
                return 'restaurant-products';
            }
            else if (req.originalUrl.includes('/event-categories')) {
                return 'event-categories';
            }
            else if (req.originalUrl.includes('/events')) {
                return 'events';
            }
            else if (req.originalUrl.includes('/categories')) {
                return 'restaurant-categories';
            }
            else if (req.originalUrl.includes('/banners')) {
                return 'restaurant-banners';
            }
            else if (req.originalUrl.includes('/blogs')) {
                return 'restaurant-blogs';
            }
            else if (req.originalUrl.includes('/auth/profile') || req.originalUrl.includes('/auth/update')) {
                return 'user-profiles';
            }
            else if (req.originalUrl.includes('/vendors')) {
                return 'vendor-kyc';
            }
            else if (req.originalUrl.includes('/general-settings')) {
                return 'general-settings';
            }
            else if (req.originalUrl.includes('/projects')) {
                return 'projects';
            }
            else if (req.originalUrl.includes('/tasks')) {
                return 'tasks';
            }
            else if (req.originalUrl.includes('/team-members')) {
                return 'team-members';
            }
            else if (req.originalUrl.includes('/invoices')) {
                return 'invoices';
            }
            return 'atis-product-uploads';
        },
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
        transformation: [{ width: 1200, height: 600, crop: 'limit' }] // Appropriate for banners
    }
});
// Initialize multer upload
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
