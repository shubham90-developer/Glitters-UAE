"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalSettingsRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const general_settings_controller_1 = require("./general-settings.controller");
const cloudinary_1 = require("../../config/cloudinary");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   - name: General Settings
 *     description: Site-wide general settings (logo + admin username/password)
 */
/**
 * @swagger
 * /v1/api/general-settings:
 *   get:
 *     summary: Get general settings
 *     tags: [General Settings]
 *     responses:
 *       200:
 *         description: General settings retrieved successfully
 */
router.get('/', general_settings_controller_1.getGeneralSettings);
/**
 * @swagger
 * /v1/api/general-settings:
 *   put:
 *     summary: Update general settings
 *     description: Admin only. Update logo, username and/or password.
 *     tags: [General Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional logo image
 *               username:
 *                 type: string
 *                 example: "admin"
 *               changePassword:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: General settings updated successfully
 *       400:
 *         description: Validation error (e.g. password mismatch)
 */
router.put('/', (0, authMiddleware_1.auth)('admin'), cloudinary_1.upload.single('logo'), general_settings_controller_1.updateGeneralSettings);
exports.generalSettingsRouter = router;
