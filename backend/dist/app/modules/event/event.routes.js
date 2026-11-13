"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("./event.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Calendar events
 */
/**
 * @swagger
 * /v1/api/events:
 *   post:
 *     summary: Create a new calendar event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Team Building Retreat Meeting" }
 *               description: { type: string }
 *               category:
 *                 type: string
 *                 enum: [bg-primary, bg-secondary, bg-success, bg-info, bg-warning, bg-danger, bg-dark]
 *                 example: bg-primary
 *               start: { type: string, format: date-time }
 *               end: { type: string, format: date-time }
 *               allDay: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', (0, authMiddleware_1.auth)(), event_controller_1.createEvent);
/**
 * @swagger
 * /v1/api/events:
 *   get:
 *     summary: Get all events (filter by date range and search)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/', event_controller_1.getAllEvents);
/**
 * @swagger
 * /v1/api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get('/:id', event_controller_1.getEventById);
/**
 * @swagger
 * /v1/api/events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
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
 *               title: { type: string }
 *               description: { type: string }
 *               category:
 *                 type: string
 *                 enum: [bg-primary, bg-secondary, bg-success, bg-info, bg-warning, bg-danger, bg-dark]
 *               start: { type: string, format: date-time }
 *               end: { type: string, format: date-time }
 *               allDay: { type: boolean }
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
router.put('/:id', (0, authMiddleware_1.auth)(), event_controller_1.updateEventById);
/**
 * @swagger
 * /v1/api/events/{id}:
 *   delete:
 *     summary: Delete an event (soft delete)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)(), event_controller_1.deleteEventById);
exports.eventRouter = router;
