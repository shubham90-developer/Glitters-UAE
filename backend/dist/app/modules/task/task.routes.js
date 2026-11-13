"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("./task.controller");
const cloudinary_1 = require("../../config/cloudinary");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Manage tasks (My Work / Kanban board)
 */
/**
 * @swagger
 * /v1/api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: Optional reference to a Project
 *               projectName:
 *                 type: string
 *               title:
 *                 type: string
 *                 example: "Ticket No 1 Lead Management"
 *               description:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               createdIn:
 *                 type: string
 *                 enum: [team_lead, project_manager, bdm, ceo]
 *               projectType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [new, scheduled, progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [critical, high, medium, low]
 *               assignee:
 *                 type: string
 *               scheduledFor:
 *                 type: string
 *                 format: date
 *               estimatedTime:
 *                 type: string
 *                 example: "30 min"
 *               dueDate:
 *                 type: string
 *                 format: date
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', (0, authMiddleware_1.auth)(), cloudinary_1.upload.single('attachment'), task_controller_1.createTask);
/**
 * @swagger
 * /v1/api/tasks:
 *   get:
 *     summary: Get all tasks (with filters and pagination)
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [new, scheduled, progress, completed] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [critical, high, medium, low] }
 *       - in: query
 *         name: assignee
 *         schema: { type: string }
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
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
 *         description: Tasks list
 */
router.get('/', task_controller_1.getAllTasks);
/**
 * @swagger
 * /v1/api/tasks/kanban:
 *   get:
 *     summary: Get tasks grouped by status for the Kanban board
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: assignee
 *         schema: { type: string }
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tasks grouped by status (new, scheduled, progress, completed)
 */
router.get('/kanban', task_controller_1.getKanbanTasks);
/**
 * @swagger
 * /v1/api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */
router.get('/:id', task_controller_1.getTaskById);
/**
 * @swagger
 * /v1/api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
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
 *               title: { type: string }
 *               description: { type: string }
 *               subtitle: { type: string }
 *               status: { type: string, enum: [new, scheduled, progress, completed] }
 *               priority: { type: string, enum: [critical, high, medium, low] }
 *               assignee: { type: string }
 *               scheduledFor: { type: string, format: date }
 *               estimatedTime: { type: string }
 *               dueDate: { type: string, format: date }
 *               attachment: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put('/:id', (0, authMiddleware_1.auth)(), cloudinary_1.upload.single('attachment'), task_controller_1.updateTaskById);
/**
 * @swagger
 * /v1/api/tasks/{id}/status:
 *   patch:
 *     summary: Quick update of task status (used by Kanban drag & drop)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, scheduled, progress, completed]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 */
router.patch('/:id/status', (0, authMiddleware_1.auth)(), task_controller_1.updateTaskStatus);
/**
 * @swagger
 * /v1/api/tasks/{id}:
 *   delete:
 *     summary: Delete a task (soft delete)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)(), task_controller_1.deleteTaskById);
exports.taskRouter = router;
