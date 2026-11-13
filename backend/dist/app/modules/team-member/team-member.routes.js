"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamMemberRouter = void 0;
const express_1 = __importDefault(require("express"));
const team_member_controller_1 = require("./team-member.controller");
const cloudinary_1 = require("../../config/cloudinary");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Team Members
 *   description: Core team / employees
 */
/**
 * @swagger
 * /v1/api/team-members:
 *   post:
 *     summary: Add a team member
 *     tags: [Team Members]
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
 *               name: { type: string, example: "Vikas Saini" }
 *               employeeId: { type: string, example: "EMP-001" }
 *               designation: { type: string, example: "PHP Developer" }
 *               email: { type: string, format: email }
 *               mobile: { type: string, example: "+91 9090909090" }
 *               joiningDate: { type: string, format: date }
 *               status: { type: string, enum: [active, inactive] }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Team member created successfully
 */
router.post('/', (0, authMiddleware_1.auth)('admin'), cloudinary_1.upload.single('avatar'), team_member_controller_1.createTeamMember);
/**
 * @swagger
 * /v1/api/team-members:
 *   get:
 *     summary: Get all team members
 *     tags: [Team Members]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive] }
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
 *         description: List of team members
 */
router.get('/', team_member_controller_1.getAllTeamMembers);
/**
 * @swagger
 * /v1/api/team-members/{id}:
 *   get:
 *     summary: Get a team member by ID
 *     tags: [Team Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Team member details
 *       404:
 *         description: Team member not found
 */
router.get('/:id', team_member_controller_1.getTeamMemberById);
/**
 * @swagger
 * /v1/api/team-members/{id}:
 *   put:
 *     summary: Update a team member
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               employeeId: { type: string }
 *               designation: { type: string }
 *               email: { type: string, format: email }
 *               mobile: { type: string }
 *               joiningDate: { type: string, format: date }
 *               status: { type: string, enum: [active, inactive] }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Team member updated successfully
 */
router.put('/:id', (0, authMiddleware_1.auth)('admin'), cloudinary_1.upload.single('avatar'), team_member_controller_1.updateTeamMemberById);
/**
 * @swagger
 * /v1/api/team-members/{id}:
 *   delete:
 *     summary: Delete a team member (soft delete)
 *     tags: [Team Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)('admin'), team_member_controller_1.deleteTeamMemberById);
exports.teamMemberRouter = router;
