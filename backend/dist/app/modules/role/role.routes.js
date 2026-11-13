"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRouter = void 0;
const express_1 = __importDefault(require("express"));
const role_controller_1 = require("./role.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Manage application roles and permissions
 */
/**
 * @swagger
 * /v1/api/roles/permissions/available:
 *   get:
 *     summary: Get the list of available permission keys
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Available permissions
 */
router.get('/permissions/available', role_controller_1.getAvailablePermissions);
/**
 * @swagger
 * /v1/api/roles:
 *   post:
 *     summary: Create a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role, email, password]
 *             properties:
 *               employeeId: { type: string }
 *               employeeName: { type: string, example: "Suraj Jamdade" }
 *               role: { type: string, example: "Team Lead" }
 *               email: { type: string, format: email, example: "suraj@gmail.com" }
 *               password: { type: string, minLength: 6, example: "suraj@12234" }
 *               permissions:
 *                 description: Array of permission keys or JSON stringified array
 *                 oneOf:
 *                   - type: array
 *                     items: { type: string }
 *                   - type: string
 *                 example: ["Dashboard","All Projects","My Work"]
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post('/', (0, authMiddleware_1.auth)('admin'), role_controller_1.createRole);
/**
 * @swagger
 * /v1/api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
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
 *         description: List of roles
 */
router.get('/', (0, authMiddleware_1.auth)('admin'), role_controller_1.getAllRoles);
/**
 * @swagger
 * /v1/api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role details
 *       404:
 *         description: Role not found
 */
router.get('/:id', (0, authMiddleware_1.auth)('admin'), role_controller_1.getRoleById);
/**
 * @swagger
 * /v1/api/roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
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
 *               employeeName: { type: string }
 *               role: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               permissions:
 *                 oneOf:
 *                   - type: array
 *                     items: { type: string }
 *                   - type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.put('/:id', (0, authMiddleware_1.auth)('admin'), role_controller_1.updateRoleById);
/**
 * @swagger
 * /v1/api/roles/{id}:
 *   delete:
 *     summary: Delete a role (soft delete)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)('admin'), role_controller_1.deleteRoleById);
exports.roleRouter = router;
