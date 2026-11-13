"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregated stats for the admin dashboard
 */
/**
 * @swagger
 * /v1/api/dashboard/stats:
 *   get:
 *     summary: Get dashboard stat cards
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Project / task / team / collection / invoice counts and totals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 statusCode: { type: integer }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     projects:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         ongoing: { type: integer }
 *                         completed: { type: integer }
 *                         cancelled: { type: integer }
 *                     tasks:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                     team:
 *                       type: object
 *                       properties:
 *                         active: { type: integer }
 *                     collection:
 *                       type: object
 *                       properties:
 *                         totalAmount: { type: number }
 *                         receivedAmount: { type: number }
 *                         pendingAmount: { type: number }
 *                     invoices:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         paid: { type: integer }
 *                         pending: { type: integer }
 */
router.get('/stats', dashboard_controller_1.getDashboardStats);
/**
 * @swagger
 * /v1/api/dashboard/recent:
 *   get:
 *     summary: Get recent projects, tasks and upcoming events
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Recent activity data
 */
router.get('/recent', dashboard_controller_1.getRecentActivity);
exports.dashboardRouter = router;
