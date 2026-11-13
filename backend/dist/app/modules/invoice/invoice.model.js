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
exports.Invoice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const IssuedFromSchema = new mongoose_1.Schema({
    name: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    address: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
}, { _id: false });
const InvoiceSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Project' },
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    issueDate: { type: Date },
    dueDate: { type: Date },
    status: {
        type: String,
        enum: ['paid', 'pending', 'cancel'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: [
            'cash',
            'cheque',
            'dd',
            'bank_transfer',
            'card',
            'upi',
            'gpay',
            'phonepe',
            'paytm',
            'wallet',
        ],
    },
    issuedFrom: { type: IssuedFromSchema, default: () => ({}) },
    firstInstallment: { type: Number, default: 0 },
    secondInstallment: { type: Number, default: 0 },
    thirdInstallment: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    estimatedTax: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
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
exports.Invoice = mongoose_1.default.model('Invoice', InvoiceSchema);
