"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebase = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Initialize Firebase Admin SDK
 *
 * To use Firebase push notifications:
 * 1. Download your Firebase service account key JSON file from Firebase Console
 * 2. Place it in the backend root directory as 'firebase-service-account.json'
 * 3. Or set the path via FIREBASE_SERVICE_ACCOUNT_PATH environment variable
 *
 * For Flutter developers:
 * - Use the device token (FCM token) obtained from Firebase Messaging in your Flutter app
 * - Register the token using POST /api/notifications/device-token/register
 * - The backend will automatically send push notifications to registered devices
 */
let firebaseInitialized = false;
const initializeFirebase = () => {
    if (firebaseInitialized) {
        console.log('Firebase Admin SDK already initialized');
        return;
    }
    try {
        // Check if service account file exists
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
            path_1.default.join(process.cwd(), 'firebase-service-account.json');
        if (!fs_1.default.existsSync(serviceAccountPath)) {
            console.warn('⚠️  Firebase service account file not found at:', serviceAccountPath);
            console.warn('⚠️  Push notifications will be disabled.');
            console.warn('⚠️  To enable push notifications:');
            console.warn('   1. Download service account JSON from Firebase Console');
            console.warn('   2. Save it as firebase-service-account.json in the backend root');
            console.warn('   3. Or set FIREBASE_SERVICE_ACCOUNT_PATH environment variable');
            return;
        }
        // Read service account file
        const serviceAccount = JSON.parse(fs_1.default.readFileSync(serviceAccountPath, 'utf8'));
        // Initialize Firebase Admin
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount)
        });
        firebaseInitialized = true;
        console.log('✅ Firebase Admin SDK initialized successfully');
    }
    catch (error) {
        console.error('❌ Error initializing Firebase Admin SDK:', error);
        console.warn('⚠️  Push notifications will be disabled.');
    }
};
exports.initializeFirebase = initializeFirebase;
exports.default = firebase_admin_1.default;
