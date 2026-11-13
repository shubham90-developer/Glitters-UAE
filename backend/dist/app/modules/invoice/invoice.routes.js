"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRouter = void 0;
const express_1 = __importDefault(require("express"));
const invoice_controller_1 = require("./invoice.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoices with itemised billing, issued-from / issued-for parties
 */
/**
 * @swagger
 * /v1/api/invoices/stats/summary:
 *   get:
 *     summary: Invoice dashboard summary counts
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Total / pending / paid / cancelled invoice counts
 */
router.get('/stats/summary', invoice_controller_1.getInvoiceStats);
/**
 * @swagger
 * /v1/api/invoices:
 *   post:
 *     summary: Create an invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId: { type: string }
 *               invoiceNumber:
 *                 type: string
 *                 description: Auto-generated if not provided
 *                 example: "INV-001"
 *               issueDate: { type: string, format: date }
 *               dueDate: { type: string, format: date }
 *               status: { type: string, enum: [paid, pending, cancel] }
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, cheque, dd, bank_transfer, card, upi, gpay, phonepe, paytm, wallet]
 *               issuedFrom:
 *                 type: object
 *                 properties:
 *                   name: { type: string, example: "ATIS" }
 *                   email: { type: string, format: email, example: "info@atis.com" }
 *                   address: { type: string, example: "Pune, India" }
 *                   phone: { type: string, example: "+917517533579" }
 *               firstInstallment: { type: number, example: 50000 }
 *               secondInstallment: { type: number, example: 50000 }
 *               thirdInstallment: { type: number, example: 50000 }
 *               totalAmount: { type: number, example: 150000 }
 *               discount: { type: number, example: 0 }
 *               estimatedTax: { type: number, example: 0 }
 *               gst: { type: number, example: 5000 }
 *               grandTotal: { type: number, example: 155000 }
 *     responses:
 *       201:
 *         description: Invoice created successfully
 */
router.post('/', (0, authMiddleware_1.auth)('admin'), invoice_controller_1.createInvoice);
/**
 * @swagger
 * /v1/api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [paid, pending, cancel] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get('/', invoice_controller_1.getAllInvoices);
/**
 * @swagger
 * /v1/api/invoices/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', invoice_controller_1.getInvoiceById);
/**
 * @swagger
 * /v1/api/invoices/{id}:
 *   put:
 *     summary: Update an invoice
 *     tags: [Invoices]
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
 *               projectId: { type: string }
 *               invoiceNumber: { type: string }
 *               issueDate: { type: string, format: date }
 *               dueDate: { type: string, format: date }
 *               status: { type: string, enum: [paid, pending, cancel] }
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, cheque, dd, bank_transfer, card, upi, gpay, phonepe, paytm, wallet]
 *               issuedFrom:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   email: { type: string, format: email }
 *                   address: { type: string }
 *                   phone: { type: string }
 *               firstInstallment: { type: number }
 *               secondInstallment: { type: number }
 *               thirdInstallment: { type: number }
 *               totalAmount: { type: number }
 *               discount: { type: number }
 *               estimatedTax: { type: number }
 *               gst: { type: number }
 *               grandTotal: { type: number }
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       404:
 *         description: Invoice not found
 */
router.put('/:id', (0, authMiddleware_1.auth)('admin'), invoice_controller_1.updateInvoiceById);
/**
 * @swagger
 * /v1/api/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice (soft delete)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 */
router.delete('/:id', (0, authMiddleware_1.auth)('admin'), invoice_controller_1.deleteInvoiceById);
exports.invoiceRouter = router;
