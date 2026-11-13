"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.getDashboardStats = void 0;
const project_model_1 = require("../project/project.model");
const task_model_1 = require("../task/task.model");
const team_member_model_1 = require("../team-member/team-member.model");
const collection_model_1 = require("../collection/collection.model");
const invoice_model_1 = require("../invoice/invoice.model");
const event_model_1 = require("../event/event.model");
const getDashboardStats = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalProjects, ongoingProjects, completedProjects, cancelledProjects, totalTasks, totalTeamMembers, collectionSummary, invoiceSummary,] = yield Promise.all([
            project_model_1.Project.countDocuments({ isDeleted: false }),
            project_model_1.Project.countDocuments({ isDeleted: false, status: 'in_progress' }),
            project_model_1.Project.countDocuments({ isDeleted: false, status: 'completed' }),
            project_model_1.Project.countDocuments({ isDeleted: false, status: 'cancelled' }),
            task_model_1.Task.countDocuments({ isDeleted: false }),
            team_member_model_1.TeamMember.countDocuments({ isDeleted: false, status: 'active' }),
            collection_model_1.Collection.aggregate([
                { $match: { isDeleted: false } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$totalAmount' },
                        receivedAmount: { $sum: '$receivedAmount' },
                        pendingAmount: { $sum: '$pendingAmount' },
                    },
                },
            ]),
            invoice_model_1.Invoice.aggregate([
                { $match: { isDeleted: false } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        paid: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    },
                },
            ]),
        ]);
        const collection = collectionSummary[0] || {
            totalAmount: 0,
            receivedAmount: 0,
            pendingAmount: 0,
        };
        const invoice = invoiceSummary[0] || { total: 0, paid: 0, pending: 0 };
        res.json({
            success: true,
            statusCode: 200,
            message: 'Dashboard stats retrieved successfully',
            data: {
                projects: {
                    total: totalProjects,
                    ongoing: ongoingProjects,
                    completed: completedProjects,
                    cancelled: cancelledProjects,
                },
                tasks: { total: totalTasks },
                team: { active: totalTeamMembers },
                collection: {
                    totalAmount: collection.totalAmount || 0,
                    receivedAmount: collection.receivedAmount || 0,
                    pendingAmount: collection.pendingAmount || 0,
                },
                invoices: {
                    total: invoice.total || 0,
                    paid: invoice.paid || 0,
                    pending: invoice.pending || 0,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getDashboardStats = getDashboardStats;
const getRecentActivity = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [recentProjects, recentTasks, upcomingEvents] = yield Promise.all([
            project_model_1.Project.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5),
            task_model_1.Task.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5),
            event_model_1.Event.find({ isDeleted: false, start: { $gte: new Date() } })
                .sort({ start: 1 })
                .limit(5),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Recent activity retrieved successfully',
            data: {
                recentProjects,
                recentTasks,
                upcomingEvents,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRecentActivity = getRecentActivity;
