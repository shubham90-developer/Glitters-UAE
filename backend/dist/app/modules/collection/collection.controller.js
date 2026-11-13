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
exports.deleteCollectionById = exports.updateCollectionById = exports.getCollectionById = exports.getCollectionDashboard = exports.getAllCollections = exports.createCollection = void 0;
const collection_model_1 = require("./collection.model");
const collection_validation_1 = require("./collection.validation");
const appError_1 = require("../../errors/appError");
const createCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = collection_validation_1.collectionValidation.parse(req.body);
        const collection = new collection_model_1.Collection(validated);
        yield collection.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Collection created successfully',
            data: collection,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createCollection = createCollection;
const getAllCollections = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, priority, paymentMethod, search, page = '1', limit = '10', } = req.query;
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        if (paymentMethod)
            filter.paymentMethod = paymentMethod;
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [
                { projectName: rx },
                { quotationNumber: rx },
                { lpoNumber: rx },
                { ownerName: rx },
                { ownerEmail: rx },
            ];
        }
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const [collections, total] = yield Promise.all([
            collection_model_1.Collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            collection_model_1.Collection.countDocuments(filter),
        ]);
        res.json({
            success: true,
            statusCode: 200,
            message: 'Collections retrieved successfully',
            meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
            data: collections,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCollections = getAllCollections;
const getCollectionDashboard = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [summary] = yield collection_model_1.Collection.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                    receivedAmount: { $sum: '$receivedAmount' },
                    pendingAmount: { $sum: '$pendingAmount' },
                    paidCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] },
                    },
                    pendingCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                    unpaidCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'unpaid'] }, 1, 0] },
                    },
                },
            },
        ]);
        const data = summary || {
            totalCount: 0,
            totalAmount: 0,
            receivedAmount: 0,
            pendingAmount: 0,
            paidCount: 0,
            pendingCount: 0,
            unpaidCount: 0,
        };
        delete data._id;
        res.json({
            success: true,
            statusCode: 200,
            message: 'Collection dashboard retrieved successfully',
            data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCollectionDashboard = getCollectionDashboard;
const getCollectionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield collection_model_1.Collection.findOne({ _id: req.params.id, isDeleted: false });
        if (!collection) {
            next(new appError_1.appError('Collection not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Collection retrieved successfully',
            data: collection,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCollectionById = getCollectionById;
const updateCollectionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield collection_model_1.Collection.findOne({ _id: req.params.id, isDeleted: false });
        if (!collection) {
            next(new appError_1.appError('Collection not found', 404));
            return;
        }
        const validated = collection_validation_1.collectionUpdateValidation.parse(req.body);
        Object.assign(collection, validated);
        yield collection.save();
        res.json({
            success: true,
            statusCode: 200,
            message: 'Collection updated successfully',
            data: collection,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCollectionById = updateCollectionById;
const deleteCollectionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield collection_model_1.Collection.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!collection) {
            next(new appError_1.appError('Collection not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Collection deleted successfully',
            data: collection,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCollectionById = deleteCollectionById;
