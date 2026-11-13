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
exports.deleteInvoiceById = exports.updateInvoiceById = exports.getInvoiceById = exports.getInvoiceStats = exports.getAllInvoices = exports.createInvoice = void 0;
const invoice_model_1 = require("./invoice.model");
const invoice_validation_1 = require("./invoice.validation");
const appError_1 = require("../../errors/appError");
const generateInvoiceNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const last = yield invoice_model_1.Invoice.findOne().sort({ createdAt: -1 });
    if (!last || !last.invoiceNumber)
        return 'INV-001';
    const match = last.invoiceNumber.match(/(\d+)$/);
    const next = match ? parseInt(match[1], 10) + 1 : 1;
    return `INV-${String(next).padStart(3, '0')}`;
});
const createInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = Object.assign({}, req.body);
        if (!payload.invoiceNumber)
            payload.invoiceNumber = yield generateInvoiceNumber();
        const validated = invoice_validation_1.invoiceValidation.parse(payload);
        const existing = yield invoice_model_1.Invoice.findOne({
            invoiceNumber: validated.invoiceNumber,
            isDeleted: false,
        });
        if (existing) {
            next(new appError_1.appError('Invoice with this number already exists', 400));
            return;
        }
        const invoice = new invoice_model_1.Invoice(validated);
        yield invoice.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Invoice created successfully',
            data: invoice,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createInvoice = createInvoice;
const getAllInvoices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, search, from, to, page = '1', limit = '10', } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (from || to) {
            filter.issueDate = {};
            if (from)
                filter.issueDate.$gte = new Date(from);
            if (to)
                filter.issueDate.$lte = new Date(to);
        }
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [
                { invoiceNumber: rx },
                { 'issuedFrom.name': rx },
                { 'issuedFrom.email': rx },
            ];
        }
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const [invoices, total] = yield Promise.all([
            invoice_model_1.Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            invoice_model_1.Invoice.countDocuments(filter),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Invoices retrieved successfully',
            meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
            data: invoices,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllInvoices = getAllInvoices;
const getInvoiceStats = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [summary] = yield invoice_model_1.Invoice.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: null,
                    totalInvoices: { $sum: 1 },
                    pendingInvoices: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    paidInvoices: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
                    cancelledInvoices: { $sum: { $cond: [{ $eq: ['$status', 'cancel'] }, 1, 0] } },
                    totalAmount: { $sum: '$grandTotal' },
                },
            },
        ]);
        const data = summary || {
            totalInvoices: 0,
            pendingInvoices: 0,
            paidInvoices: 0,
            cancelledInvoices: 0,
            totalAmount: 0,
        };
        delete data._id;
        res.json({
            success: true,
            statusCode: 200,
            message: 'Invoice stats retrieved successfully',
            data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getInvoiceStats = getInvoiceStats;
const getInvoiceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield invoice_model_1.Invoice.findOne({ _id: req.params.id, isDeleted: false });
        if (!invoice) {
            next(new appError_1.appError('Invoice not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Invoice retrieved successfully',
            data: invoice,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getInvoiceById = getInvoiceById;
const updateInvoiceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield invoice_model_1.Invoice.findOne({ _id: req.params.id, isDeleted: false });
        if (!invoice) {
            next(new appError_1.appError('Invoice not found', 404));
            return;
        }
        const payload = Object.assign({}, req.body);
        const validated = invoice_validation_1.invoiceUpdateValidation.parse(payload);
        if (validated.invoiceNumber && validated.invoiceNumber !== invoice.invoiceNumber) {
            const existing = yield invoice_model_1.Invoice.findOne({
                invoiceNumber: validated.invoiceNumber,
                isDeleted: false,
                _id: { $ne: req.params.id },
            });
            if (existing) {
                next(new appError_1.appError('Invoice with this number already exists', 400));
                return;
            }
        }
        Object.assign(invoice, validated);
        yield invoice.save();
        res.json({
            success: true,
            statusCode: 200,
            message: 'Invoice updated successfully',
            data: invoice,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateInvoiceById = updateInvoiceById;
const deleteInvoiceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield invoice_model_1.Invoice.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!invoice) {
            next(new appError_1.appError('Invoice not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Invoice deleted successfully',
            data: invoice,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteInvoiceById = deleteInvoiceById;
