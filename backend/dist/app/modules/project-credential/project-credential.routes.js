"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectCredentialRouter = void 0;
const express_1 = __importDefault(require("express"));
const project_credential_controller_1 = require("./project-credential.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Project Credentials
 *   description: Store project credentials / admin panel access info
 */
/**
 * @swagger
 * /v1/api/project-credentials:
 *   post:
 *     summary: Create project credential
 *     tags: [Project Credentials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectName]
 *             properties:
 *               projectName: { type: string, example: "Sindh Ji Pukar" }
 *               description:
 *                 type: string
 *                 description: HTML content (URL, username, password, notes etc.)
 *                 example: "<p>🌐 Website: https://example.com</p><p>👤 admin@gmail.com</p><p>🔒 admin123</p>"
 *     responses:
 *       201:
 *         description: Credential created successfully
 */
router.post('/', (0, authMiddleware_1.auth)('admin'), project_credential_controller_1.createProjectCredential);
/**
 * @swagger
 * /v1/api/project-credentials:
 *   get:
 *     summary: Get all project credentials
 *     tags: [Project Credentials]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of credentials
 */
router.get('/', (0, authMiddleware_1.auth)('admin'), project_credential_controller_1.getAllProjectCredentials);
/**
 * @swagger
 * /v1/api/project-credentials/{id}:
 *   get:
 *     summary: Get a project credential by ID
 *     tags: [Project Credentials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Credential details
 *       404:
 *         description: Credential not found
 */
router.get('/:id', (0, authMiddleware_1.auth)('admin'), project_credential_controller_1.getProjectCredentialById);
/**
 * @swagger
 * /v1/api/project-credentials/{id}:
 *   put:
 *     summary: Update a project credential
 *     tags: [Project Credentials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Credential updated successfully
 */
router.put('/:id', (0, authMiddleware_1.auth)('admin'), project_credential_controller_1.updateProjectCredentialById);
/**
 * @swagger
 * /v1/api/project-credentials/{id}:
 *   delete:
 *     summary: Delete a project credential (soft delete)
 *     tags: [Project Credentials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Credential deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)('admin'), project_credential_controller_1.deleteProjectCredentialById);
exports.projectCredentialRouter = router;
