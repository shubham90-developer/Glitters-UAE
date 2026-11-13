"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const swagger_1 = require("./app/config/swagger");
const firebase_1 = require("./app/config/firebase");
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
// Initialize Firebase Admin SDK (for both Google Auth and Push Notifications)
try {
    (0, firebase_1.initializeFirebase)();
}
catch (error) {
    console.warn('⚠️ Firebase not initialized - Google auth and push notifications will not work');
}
// parsers
app.use(express_1.default.json());
// CORS configuration for production
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://moviemart.org',
        'https://www.moviemart.org',
        'https://panel.moviemart.org',
        'http://localhost:3002'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        // TUS protocol headers for video uploads
        'Tus-Resumable',
        'Upload-Length',
        'Upload-Metadata',
        'Upload-Offset',
        'Upload-Concat',
        'Upload-Defer-Length',
        'X-HTTP-Method-Override',
        'X-Request-ID',
        'X-Requested-With'
    ],
    exposedHeaders: [
        'Location',
        'Upload-Offset',
        'Upload-Length',
        'Tus-Version',
        'Tus-Resumable',
        'Tus-Max-Size',
        'Tus-Extension',
        'Upload-Metadata',
        'Stream-Media-Id'
    ],
    credentials: true
}));
// swagger configuration
(0, swagger_1.setupSwagger)(app);
// application routes
app.use('/v1/api', routes_1.default);
const entryRoute = (req, res) => {
    const message = 'Surver is running...';
    res.send(message);
};
app.get('/', entryRoute);
//Not Found
app.use(notFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
