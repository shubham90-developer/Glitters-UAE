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
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    quotationNumber: {
        type: String,
        default: '',
        trim: true,
    },
    lpoNumber: {
        type: String,
        default: '',
        trim: true,
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'on_hold', 'completed', 'cancelled'],
        default: 'new',
    },
    priority: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium',
    },
    projectType: {
        type: String,
        default: '',
        trim: true,
    },
    assignedMembers: {
        type: [String],
        default: [],
    },
    ownerName: {
        type: String,
        default: '',
        trim: true,
    },
    ownerMobile: {
        type: String,
        default: '',
        trim: true,
    },
    ownerEmail: {
        type: String,
        default: '',
        trim: true,
        lowercase: true,
    },
    ownerAddress: {
        type: String,
        default: '',
        trim: true,
    },
    projectManager: {
        type: String,
        default: '',
        trim: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    duration: {
        type: String,
        default: '',
        trim: true,
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    file: {
        type: String,
        default: '',
    },
    refUrl: {
        type: String,
        default: '',
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            if (ret.createdAt)
                ret.createdAt = new Date(ret.createdAt).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                });
            if (ret.updatedAt)
                ret.updatedAt = new Date(ret.updatedAt).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                });
        },
    },
});
exports.Project = mongoose_1.default.model('Project', ProjectSchema);
