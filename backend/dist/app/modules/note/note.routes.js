"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRouter = void 0;
const express_1 = __importDefault(require("express"));
const note_controller_1 = require("./note.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Personal / rich-text notes
 */
/**
 * @swagger
 * /v1/api/notes:
 *   post:
 *     summary: Create a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string, description: "HTML content from the rich-text editor" }
 *     responses:
 *       201:
 *         description: Note created successfully
 */
router.post('/', (0, authMiddleware_1.auth)(), note_controller_1.createNote);
/**
 * @swagger
 * /v1/api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of notes
 */
router.get('/', note_controller_1.getAllNotes);
/**
 * @swagger
 * /v1/api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Note details
 *       404:
 *         description: Note not found
 */
router.get('/:id', note_controller_1.getNoteById);
/**
 * @swagger
 * /v1/api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
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
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: Note updated successfully
 */
router.put('/:id', (0, authMiddleware_1.auth)(), note_controller_1.updateNoteById);
/**
 * @swagger
 * /v1/api/notes/{id}:
 *   delete:
 *     summary: Delete a note (soft delete)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Note deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)(), note_controller_1.deleteNoteById);
exports.noteRouter = router;
