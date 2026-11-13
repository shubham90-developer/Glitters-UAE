"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CollectionSchema = new mongoose_1.Schema({
    projectName: { type: String, required: true, trim: true },
    quotationNumber: { type: String, default: '', trim: true },
    lpoNumber: { type: String, default: '', trim: true },
    status: {
        type: String,
        enum: ['paid', 'unpaid', 'pending'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium',
    },
    ownerName: { type: String, default: '', trim: true },
    ownerMobile: { type: String, default: '', trim: true },
    ownerEmail: { type: String, default: '', trim: true, lowercase: true },
    ownerAddress: { type: String, default: '', trim: true },
    totalAmount: { type: Number, required: true, default: 0 },
    firstInstallment: { type: Number, default: 0 },
    secondInstallment: { type: Number, default: 0 },
    thirdInstallment: { type: Number, default: 0 },
    advanceAmount: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    paymentMethod: {
        type: String,
        enum: ['cash', 'cheque', 'dd', 'bank_transfer', 'card', 'upi', 'gpay', 'phonepe', 'paytm', 'wallet'],
    },
    paymentDate: { type: Date },
    dueDate: { type: Date },
    duration: { type: String, default: '', trim: true },
    assignedTo: { type: String, default: '', trim: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            if (ret.createdAt)
                ret.createdAt = new Date(ret.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            if (ret.updatedAt)
                ret.updatedAt = new Date(ret.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        },
    },
});
// Auto-calc pending amount when the relevant fields are set.
// Pending = (totalAmount + additionalCharges + tax + gst - discount) - (advanceAmount + receivedAmount)
CollectionSchema.pre('save', function (next) {
    const trackedFields = [
        'totalAmount',
        'additionalCharges',
        'tax',
        'gst',
        'discount',
        'advanceAmount',
        'receivedAmount',
    ];
    const shouldRecalc = trackedFields.some((f) => this.isModified(f));
    if (shouldRecalc) {
        const total = this.totalAmount || 0;
        const additional = this.additionalCharges || 0;
        const tax = this.tax || 0;
        const gst = this.gst || 0;
        const discount = this.discount || 0;
        const advance = this.advanceAmount || 0;
        const received = this.receivedAmount || 0;
        const grandTotal = total + additional + tax + gst - discount;
        this.pendingAmount = Math.max(grandTotal - advance - received, 0);
    }
    next();
});
exports.Collection = mongoose_1.default.model('Collection', CollectionSchema);
