"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionRouter = void 0;
const express_1 = __importDefault(require("express"));
const collection_controller_1 = require("./collection.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Payment collections / installments per project
 */
/**
 * @swagger
 * /v1/api/collections/dashboard/summary:
 *   get:
 *     summary: Dashboard summary cards for collections
 *     tags: [Collections]
 *     responses:
 *       200:
 *         description: Aggregated totals (total / received / pending, counts by status)
 */
router.get('/dashboard/summary', collection_controller_1.getCollectionDashboard);
/**
 * @swagger
 * /v1/api/collections:
 *   post:
 *     summary: Create a collection entry
 *     tags: [Collections]
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
 *               projectName: { type: string, example: "Prapti Cycle Website" }
 *               quotationNumber: { type: string, example: "QT-001" }
 *               lpoNumber: { type: string, example: "LPO-001" }
 *               status: { type: string, enum: [paid, unpaid, pending] }
 *               priority: { type: string, enum: [critical, high, medium, low] }
 *               ownerName: { type: string }
 *               ownerMobile: { type: string }
 *               ownerEmail: { type: string, format: email }
 *               ownerAddress: { type: string, example: "Pune, Maharashtra" }
 *               totalAmount: { type: number, example: 85000 }
 *               firstInstallment: { type: number }
 *               secondInstallment: { type: number }
 *               thirdInstallment: { type: number }
 *               advanceAmount: { type: number, example: 10000 }
 *               additionalCharges: { type: number, example: 0 }
 *               tax: { type: number, example: 0, description: "Tax amount" }
 *               gst: { type: number, example: 18, description: "GST amount" }
 *               discount: { type: number, example: 0 }
 *               receivedAmount: { type: number, example: 5000 }
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, cheque, dd, bank_transfer, card, upi, gpay, phonepe, paytm, wallet]
 *               paymentDate: { type: string, format: date }
 *               dueDate: { type: string, format: date }
 *               duration: { type: string, example: "30 days" }
 *               assignedTo: { type: string }
 *               progress: { type: integer, minimum: 0, maximum: 100 }
 *     responses:
 *       201:
 *         description: Collection created successfully
 */
router.post('/', (0, authMiddleware_1.auth)('admin'), collection_controller_1.createCollection);
/**
 * @swagger
 * /v1/api/collections:
 *   get:
 *     summary: List collections with filters
 *     tags: [Collections]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [paid, unpaid, pending] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [critical, high, medium, low] }
 *       - in: query
 *         name: paymentMethod
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
 *         description: List of collections
 */
router.get('/', collection_controller_1.getAllCollections);
/**
 * @swagger
 * /v1/api/collections/{id}:
 *   get:
 *     summary: Get a collection by ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Collection details
 *       404:
 *         description: Collection not found
 */
router.get('/:id', collection_controller_1.getCollectionById);
/**
 * @swagger
 * /v1/api/collections/{id}:
 *   put:
 *     summary: Update a collection
 *     tags: [Collections]
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
 *               quotationNumber: { type: string }
 *               lpoNumber: { type: string }
 *               status: { type: string, enum: [paid, unpaid, pending] }
 *               priority: { type: string, enum: [critical, high, medium, low] }
 *               ownerName: { type: string }
 *               ownerMobile: { type: string }
 *               ownerEmail: { type: string, format: email }
 *               ownerAddress: { type: string }
 *               totalAmount: { type: number }
 *               firstInstallment: { type: number }
 *               secondInstallment: { type: number }
 *               thirdInstallment: { type: number }
 *               advanceAmount: { type: number }
 *               additionalCharges: { type: number }
 *               tax: { type: number }
 *               gst: { type: number }
 *               discount: { type: number }
 *               receivedAmount: { type: number }
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, cheque, dd, bank_transfer, card, upi, gpay, phonepe, paytm, wallet]
 *               paymentDate: { type: string, format: date }
 *               dueDate: { type: string, format: date }
 *               duration: { type: string }
 *               assignedTo: { type: string }
 *               progress: { type: integer, minimum: 0, maximum: 100 }
 *     responses:
 *       200:
 *         description: Collection updated successfully
 *       404:
 *         description: Collection not found
 */
router.put('/:id', (0, authMiddleware_1.auth)('admin'), collection_controller_1.updateCollectionById);
/**
 * @swagger
 * /v1/api/collections/{id}:
 *   delete:
 *     summary: Delete a collection (soft delete)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Collection deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)('admin'), collection_controller_1.deleteCollectionById);
exports.collectionRouter = router;
