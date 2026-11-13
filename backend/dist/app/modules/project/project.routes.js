"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("./project.controller");
const cloudinary_1 = require("../../config/cloudinary");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Manage projects
 */
/**
 * @swagger
 * /v1/api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a project. Supports optional file upload (contract, brief, etc.) via multipart/form-data.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Prapti Cycle Website"
 *               description:
 *                 type: string
 *                 example: "Corporate website with CMS"
 *               quotationNumber:
 *                 type: string
 *                 example: "QT-001"
 *               lpoNumber:
 *                 type: string
 *                 example: "LPO-001"
 *               status:
 *                 type: string
 *                 enum: [new, in_progress, on_hold, completed, cancelled]
 *                 example: new
 *               priority:
 *                 type: string
 *                 enum: [critical, high, medium, low]
 *                 example: high
 *               projectType:
 *                 type: string
 *                 example: "Website"
 *               assignedMembers:
 *                 type: string
 *                 description: JSON string or comma separated list of members. Example - ["Vikas Saini","Lokesh Yadav"]
 *                 example: '["Vikas Saini","Lokesh Yadav"]'
 *               ownerName:
 *                 type: string
 *               ownerMobile:
 *                 type: string
 *               ownerEmail:
 *                 type: string
 *                 format: email
 *               ownerAddress:
 *                 type: string
 *                 example: "Pune, India"
 *               projectManager:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               duration:
 *                 type: string
 *                 example: "30 days"
 *               progress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 50
 *               refUrl:
 *                 type: string
 *                 example: "https://example.com"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional project attachment (PDF, image, etc.)
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error / duplicate project
 */
router.post('/', (0, authMiddleware_1.auth)('admin'), cloudinary_1.upload.single('file'), project_controller_1.createProject);
/**
 * @swagger
 * /v1/api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Supports filtering by status, priority, project manager and text search, with pagination.
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in_progress, on_hold, completed, cancelled]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [critical, high, medium, low]
 *       - in: query
 *         name: projectManager
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Free-text search across name, description, quotation/LPO numbers and owner
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/', project_controller_1.getAllProjects);
/**
 * @swagger
 * /v1/api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get('/:id', project_controller_1.getProjectById);
/**
 * @swagger
 * /v1/api/projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     description: Update any subset of fields. Provide a new file to replace the existing attachment.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quotationNumber:
 *                 type: string
 *               lpoNumber:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [new, in_progress, on_hold, completed, cancelled]
 *               priority:
 *                 type: string
 *                 enum: [critical, high, medium, low]
 *               projectType:
 *                 type: string
 *               assignedMembers:
 *                 type: string
 *               ownerName:
 *                 type: string
 *               ownerMobile:
 *                 type: string
 *               ownerEmail:
 *                 type: string
 *               ownerAddress:
 *                 type: string
 *               projectManager:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               duration:
 *                 type: string
 *               progress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               refUrl:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.put('/:id', (0, authMiddleware_1.auth)('admin'), cloudinary_1.upload.single('file'), project_controller_1.updateProjectById);
/**
 * @swagger
 * /v1/api/projects/{id}:
 *   delete:
 *     summary: Delete a project by ID (soft delete)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete('/:id', (0, authMiddleware_1.auth)('admin'), project_controller_1.deleteProjectById);
exports.projectRouter = router;
