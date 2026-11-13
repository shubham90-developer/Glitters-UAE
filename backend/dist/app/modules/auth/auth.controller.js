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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appleAuth = exports.deleteAccount = exports.getProfile = exports.changePassword = exports.updateProfile = exports.googleAuth = exports.checkEmailExists = exports.checkPhoneExists = exports.activateUser = exports.resetPassword = exports.getUserById = exports.getAllUsers = exports.loginController = exports.updateUser = exports.verifyOtp = exports.requestOtp = exports.singUpController = void 0;
const auth_model_1 = require("./auth.model");
const auth_validation_1 = require("./auth.validation");
const generateToken_1 = require("../../config/generateToken");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// import { AdminStaff } from "../admin-staff/admin-staff.model";
// Helper function to parse MongoDB duplicate key errors into user-friendly messages
const parseDuplicateKeyError = (error) => {
    var _a, _b, _c, _d;
    // Check if it's a MongoDB duplicate key error (code 11000)
    if (error.code === 11000 || ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('E11000'))) {
        const keyPattern = error.keyPattern || {};
        // Determine which field caused the duplicate
        if (keyPattern.email || ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            return 'An account with this email already exists. Please use a different email or try logging in.';
        }
        if (keyPattern.googleId || ((_c = error.message) === null || _c === void 0 ? void 0 : _c.includes('googleId'))) {
            return 'This Google account is already linked to another user.';
        }
        if (keyPattern.appleId || ((_d = error.message) === null || _d === void 0 ? void 0 : _d.includes('appleId'))) {
            return 'This Apple account is already linked to another user.';
        }
        // Generic duplicate error
        return 'An account with these details already exists. Please try logging in instead.';
    }
    // Return original message for non-duplicate errors
    return error.message || 'An unexpected error occurred';
};
const singUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, img, phone, email, role } = auth_validation_1.authValidation.parse(req.body);
        // Check for existing email (only email should be unique)
        const existingEmail = yield auth_model_1.User.findOne({ email });
        if (existingEmail) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Email already exists",
            });
            return;
        }
        const user = new auth_model_1.User({ name, password, img, phone, email, role, authProvider: 'local' });
        yield user.save();
        const _a = user.toObject(), { password: _ } = _a, userObject = __rest(_a, ["password"]);
        res.status(201).json({
            success: true,
            statusCode: 200,
            message: "User registered successfully",
            data: userObject,
        });
        return;
    }
    catch (error) {
        const userFriendlyMessage = parseDuplicateKeyError(error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: userFriendlyMessage
        });
    }
});
exports.singUpController = singUpController;
// Add these functions to your existing controller file
// Utility function to generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Request OTP handler - sends OTP via WhatsApp
const requestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = auth_validation_1.requestOtpValidation.parse(req.body);
        // Find or create user
        let user = yield auth_model_1.User.findOne({ phone });
        if (!user) {
            user = new auth_model_1.User({
                phone,
                role: 'user',
                status: 'active',
                authProvider: 'phone'
            });
        }
        else if (!user.authProvider) {
            user.authProvider = 'phone';
        }
        // Generate OTP and set expiration (5 minutes)
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = expiresAt;
        yield user.save();
        // Log OTP to console for development
        console.log(`📱 WhatsApp OTP for ${phone}: ${otp}`);
        console.log(`OTP expires at: ${expiresAt.toLocaleString()}`);
        // Send OTP via WhatsApp API (international)
        let whatsappSent = false;
        try {
            const whatsappApiUrl = `https://wapi.nationalsms.in/wapp/v2/api/send?apikey=274d09e223464ff89c9ba70a7b68434e&mobile=${phone}&msg=Your MovieMart login OTP is ${otp}. Valid for 5 minutes. Do not share this code with anyone.&intl=true`;
            const response = yield fetch(whatsappApiUrl);
            const result = yield response.text();
            console.log(`WhatsApp API Response: ${result}`);
            whatsappSent = true;
        }
        catch (whatsappError) {
            console.error('Failed to send WhatsApp OTP:', whatsappError);
            // Continue with the flow even if WhatsApp fails, for development purposes
        }
        res.json({
            success: true,
            statusCode: 200,
            message: whatsappSent
                ? "OTP sent successfully to your WhatsApp"
                : "OTP generated successfully",
            data: {
                otp, // Include OTP in response for development/testing - remove in production
                phone,
                expiresIn: 300, // 300 seconds = 5 minutes
                whatsappSent
            }
        });
        return;
    }
    catch (error) {
        const userFriendlyMessage = parseDuplicateKeyError(error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: userFriendlyMessage
        });
    }
});
exports.requestOtp = requestOtp;
// Verify OTP and login
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, otp } = auth_validation_1.verifyOtpValidation.parse(req.body);
        // Find user by phone
        const user = yield auth_model_1.User.findOne({ phone });
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        // Check if OTP is valid and not expired
        if (!user.compareOtp(otp)) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid or expired OTP"
            });
            return;
        }
        // Generate token for the user
        const token = (0, generateToken_1.generateToken)(user);
        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        yield user.save();
        // Remove password from response
        const _a = user.toObject(), { password: _ } = _a, userObject = __rest(_a, ["password"]);
        res.json({
            success: true,
            statusCode: 200,
            message: "OTP verified successfully",
            token,
            data: userObject
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
    }
});
exports.verifyOtp = verifyOtp;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a clean request body by filtering out undefined/null values
        const cleanBody = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== null));
        // Validate the clean data
        const validatedData = auth_validation_1.updateUserValidation.parse(cleanBody);
        // Check if email is being updated with a non-empty value and if it already exists
        if (validatedData.email && validatedData.email.length > 0) {
            const existingUser = yield auth_model_1.User.findOne({
                email: validatedData.email,
                _id: { $ne: req.params.id }
            });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Email already exists"
                });
                return;
            }
        }
        // If email is empty string, remove it from update data
        if (validatedData.email === '') {
            delete validatedData.email;
        }
        const updatedUser = yield auth_model_1.User.findByIdAndUpdate(req.params.id, validatedData, { new: true, select: '-password' });
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "User updated successfully",
            data: updatedUser
        });
        return;
    }
    catch (error) {
        const userFriendlyMessage = parseDuplicateKeyError(error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: userFriendlyMessage
        });
    }
});
exports.updateUser = updateUser;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = auth_validation_1.loginValidation.parse(req.body);
        // First try to find in User model
        let user = yield auth_model_1.User.findOne({ email });
        let userType = 'user';
        // If not found in User model, try AdminStaff model
        // if (!user) {
        //   user = await AdminStaff.findOne({ email });
        //   userType = 'admin-staff';
        // }
        if (!user) {
            res.status(401).json({
                success: false,
                statusCode: 400,
                message: "Invalid email or password",
            });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                statusCode: 400,
                message: "Invalid email or password",
            });
            return;
        }
        // Block check: admin can block a vendor/user account. Blocked users cannot log in.
        if (user.isBlocked) {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: ((_a = user.blockedReason) === null || _a === void 0 ? void 0 : _a.trim())
                    ? `Your account has been blocked by the admin. Reason: ${user.blockedReason}`
                    : "Your account has been blocked by the admin. Please contact support.",
            });
            return;
        }
        const token = (0, generateToken_1.generateToken)(user);
        // For vendors, recompute which services are currently usable (film_trade
        // is only active when the subscription is not expired). The menu & content
        // access layers rely on this value.
        // if ((user as any).role === 'vendor') {
        //   try {
        //     const { computeActiveServicesForVendor } = await import('../vendor/subscription.util');
        //     const active = await computeActiveServicesForVendor(user._id as any);
        //     (user as any).vendorActiveServices = active;
        //     await User.findByIdAndUpdate(user._id, { vendorActiveServices: active });
        //   } catch (e) {
        //     // Non-fatal: fall back to vendorServices if subscription lookup fails
        //   }
        // }
        // remove password
        const _b = user.toObject(), { password: _ } = _b, userObject = __rest(_b, ["password"]);
        res.json({
            success: true,
            statusCode: 200,
            message: "User logged in successfully",
            token,
            data: userObject,
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
        return;
    }
});
exports.loginController = loginController;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield auth_model_1.User.find({}, { password: 0 });
        if (users.length === 0) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "No users found",
            });
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "Users retrieved successfully",
            data: users,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error.message
        });
        return;
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_model_1.User.findById(req.params.id, { password: 0 });
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found",
            });
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "User retrieved successfully",
            data: user,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error.message
        });
        return;
    }
});
exports.getUserById = getUserById;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, newPassword } = auth_validation_1.resetPasswordValidation.parse(req.body);
        const user = yield auth_model_1.User.findOne({ phone });
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        user.password = newPassword;
        yield user.save();
        res.json({
            success: true,
            statusCode: 200,
            message: "Password reset successfully"
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
        return;
    }
});
exports.resetPassword = resetPassword;
const activateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = auth_validation_1.activateUserValidation.parse(req.body);
        const user = yield auth_model_1.User.findOne({ phone });
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        user.status = 'active';
        yield user.save();
        res.json({
            success: true,
            statusCode: 200,
            message: "User activated successfully"
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
        return;
    }
});
exports.activateUser = activateUser;
const checkPhoneExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = auth_validation_1.phoneCheckValidation.parse(req.body);
        const user = yield auth_model_1.User.findOne({ phone });
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Phone number not found"
            });
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "Phone number exists",
            data: {
                exists: true,
                phone: user.phone
            }
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
        return;
    }
});
exports.checkPhoneExists = checkPhoneExists;
const checkEmailExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = auth_validation_1.emailCheckValidation.parse(req.body);
        const user = yield auth_model_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Email not found"
            });
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: "Email exists",
            data: {
                exists: true,
                email: user.email
            }
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
        return;
    }
});
exports.checkEmailExists = checkEmailExists;
// Google Authentication - verify Firebase token and create/login user
const googleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = auth_validation_1.googleAuthValidation.parse(req.body);
        // Verify Firebase ID token
        let decodedToken;
        try {
            decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(idToken);
        }
        catch (firebaseError) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid or expired Firebase token"
            });
            return;
        }
        const { uid, email, name, picture } = decodedToken;
        if (!email) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Email not provided by Google"
            });
            return;
        }
        // Check if user already exists with this googleId or email
        let user = yield auth_model_1.User.findOne({
            $or: [
                { googleId: uid },
                { email: email }
            ]
        });
        if (user) {
            // User exists - update Google info if needed
            if (!user.googleId) {
                user.googleId = uid;
                user.authProvider = 'google';
                if (!user.img && picture)
                    user.img = picture;
                yield user.save();
            }
        }
        else {
            // Create new user
            user = new auth_model_1.User({
                name: name || email.split('@')[0],
                email: email,
                googleId: uid,
                img: picture || '',
                authProvider: 'google',
                role: 'user',
                status: 'active'
            });
            yield user.save();
        }
        // Generate JWT token
        const token = (0, generateToken_1.generateToken)(user);
        // Remove password from response
        const _a = user.toObject(), { password: _ } = _a, userObject = __rest(_a, ["password"]);
        res.json({
            success: true,
            statusCode: 200,
            message: "Google authentication successful",
            token,
            data: userObject
        });
        return;
    }
    catch (error) {
        const userFriendlyMessage = parseDuplicateKeyError(error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: userFriendlyMessage
        });
        return;
    }
});
exports.googleAuth = googleAuth;
// Update Profile - respects auth provider restrictions
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { name, phone, email } = req.body;
        // Get current user
        const user = yield auth_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        // Prepare update object based on auth provider
        const updateData = {};
        // Handle name - all users can update
        if (name !== undefined) {
            updateData.name = name;
        }
        // Handle phone - cannot change for phone auth provider (phone is their primary login)
        if (phone !== undefined) {
            // Phone users cannot change their phone (it's their login method)
            if (user.authProvider === 'phone') {
                // Skip phone update for phone login users
            }
            else {
                // Google and local users CAN add/update their phone
                if (phone && phone.length > 0) {
                    const existingPhone = yield auth_model_1.User.findOne({ phone, _id: { $ne: userId } });
                    if (existingPhone) {
                        res.status(400).json({
                            success: false,
                            statusCode: 400,
                            message: "This phone number is already registered with another account"
                        });
                        return;
                    }
                }
                updateData.phone = phone || undefined;
            }
        }
        // Handle email - cannot change for google and local auth provider (email is their primary login)
        if (email !== undefined) {
            // Google and local users cannot change their email (it's their login method)
            if (user.authProvider === 'google' || user.authProvider === 'local') {
                // Skip email update for these providers
            }
            else {
                // Phone users CAN add/update their email
                if (email && email.length > 0) {
                    const existingEmail = yield auth_model_1.User.findOne({ email, _id: { $ne: userId } });
                    if (existingEmail) {
                        res.status(400).json({
                            success: false,
                            statusCode: 400,
                            message: "This email is already registered with another account"
                        });
                        return;
                    }
                }
                updateData.email = email || undefined;
            }
        }
        // Handle image upload (from multer)
        if (req.file) {
            updateData.img = req.file.path;
        }
        // Update user
        const updatedUser = yield auth_model_1.User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, select: '-password -otp -otpExpires' });
        res.json({
            success: true,
            statusCode: 200,
            message: "Profile updated successfully",
            data: updatedUser
        });
        return;
    }
    catch (error) {
        const userFriendlyMessage = parseDuplicateKeyError(error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: userFriendlyMessage
        });
        return;
    }
});
exports.updateProfile = updateProfile;
// Change Password - only for local (email/password) users
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword } = req.body;
        // Validate input
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Current password and new password are required"
            });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: "New password must be at least 6 characters"
            });
            return;
        }
        // Get user with password
        const user = yield auth_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        // Check auth provider - only local users can change password
        if (user.authProvider !== 'local') {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: `Cannot change password for ${user.authProvider} login. Please use ${user.authProvider === 'google' ? 'Google' : 'Phone OTP'} to login.`
            });
            return;
        }
        // Verify current password
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Current password is incorrect"
            });
            return;
        }
        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        yield user.save();
        res.json({
            success: true,
            statusCode: 200,
            message: "Password changed successfully"
        });
        return;
    }
    catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message
        });
        return;
    }
});
exports.changePassword = changePassword;
// Get current user profile
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield auth_model_1.User.findById(userId, { password: 0, otp: 0, otpExpires: 0 });
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        // Refresh vendorActiveServices so the admin panel menu hides film_trade
        // items as soon as the subscription lapses (no re-login required).
        // if ((user as any).role === 'vendor') {
        //   try {
        //     const { computeActiveServicesForVendor } = await import('../vendor/subscription.util');
        //     const active = await computeActiveServicesForVendor(user._id as any);
        //     (user as any).vendorActiveServices = active;
        //     await User.findByIdAndUpdate(user._id, { vendorActiveServices: active });
        //   } catch (e) {
        //     // non-fatal
        //   }
        // }
        res.json({
            success: true,
            statusCode: 200,
            message: "Profile retrieved successfully",
            data: user
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error.message
        });
        return;
    }
});
exports.getProfile = getProfile;
// Delete Account - permanently delete user account and all associated data
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { password, confirmDelete } = req.body;
        // Validate confirmation
        if (confirmDelete !== 'DELETE') {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Please type 'DELETE' to confirm account deletion"
            });
            return;
        }
        // Get user
        const user = yield auth_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }
        // For local (email/password) users, verify password
        if (user.authProvider === 'local') {
            if (!password) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Password is required to delete account"
                });
                return;
            }
            const isMatch = yield user.comparePassword(password);
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: "Incorrect password"
                });
                return;
            }
        }
        // Delete the user account
        yield auth_model_1.User.findByIdAndDelete(userId);
        // TODO: Add cleanup for related data (bookings, watchlist, etc.) if needed
        // await Booking.deleteMany({ userId });
        // await Watchlist.deleteMany({ userId });
        console.log(`🗑️ Account deleted: ${userId} (${user.email || user.phone})`);
        res.json({
            success: true,
            statusCode: 200,
            message: "Account deleted successfully. We're sorry to see you go."
        });
        return;
    }
    catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to delete account. Please try again later."
        });
        return;
    }
});
exports.deleteAccount = deleteAccount;
// Apple Authentication - verify Apple identity token directly and create/login user
const appleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🍎 [Apple Auth] Request received");
        console.log("🍎 [Apple Auth] Body keys:", Object.keys(req.body));
        const { idToken, userIdentifier, fullName, email: providedEmail } = auth_validation_1.appleAuthValidation.parse(req.body);
        console.log("🍎 [Apple Auth] Validation passed");
        console.log("🍎 [Apple Auth] idToken length:", idToken === null || idToken === void 0 ? void 0 : idToken.length);
        console.log("🍎 [Apple Auth] userIdentifier:", userIdentifier);
        console.log("🍎 [Apple Auth] providedEmail:", providedEmail);
        console.log("🍎 [Apple Auth] fullName:", fullName);
        // Decode Apple's identity token (JWT) without verification for now
        // The token is signed by Apple and contains user info
        let decodedPayload;
        try {
            // Apple's identity token is a JWT - decode the payload
            const tokenParts = idToken.split('.');
            if (tokenParts.length !== 3) {
                throw new Error("Invalid Apple identity token format");
            }
            // Decode the payload (middle part)
            const payload = tokenParts[1];
            const decodedString = Buffer.from(payload, 'base64').toString('utf8');
            decodedPayload = JSON.parse(decodedString);
            console.log("🍎 [Apple Auth] Decoded token payload:");
            console.log("🍎 [Apple Auth] - iss:", decodedPayload.iss);
            console.log("🍎 [Apple Auth] - sub:", decodedPayload.sub);
            console.log("🍎 [Apple Auth] - aud:", decodedPayload.aud);
            console.log("🍎 [Apple Auth] - email:", decodedPayload.email);
            console.log("🍎 [Apple Auth] - email_verified:", decodedPayload.email_verified);
            // Verify issuer is Apple
            if (decodedPayload.iss !== 'https://appleid.apple.com') {
                throw new Error("Invalid token issuer");
            }
            // Verify token is not expired
            const now = Math.floor(Date.now() / 1000);
            if (decodedPayload.exp && decodedPayload.exp < now) {
                throw new Error("Apple identity token has expired");
            }
        }
        catch (decodeError) {
            console.log("❌ [Apple Auth] Token decode error:", decodeError.message);
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid Apple identity token: " + decodeError.message
            });
            return;
        }
        // Extract user info from decoded token
        // 'sub' is the unique Apple user ID (stable across sign-ins)
        const appleUserId = decodedPayload.sub || userIdentifier;
        const tokenEmail = decodedPayload.email;
        // Use email from token or provided email
        const email = tokenEmail || providedEmail;
        console.log("🍎 [Apple Auth] Apple User ID:", appleUserId);
        console.log("🍎 [Apple Auth] Final email:", email);
        // Build name from fullName if provided (Apple only sends name on first sign-in)
        let name = '';
        if (fullName) {
            const parts = [fullName.givenName, fullName.familyName].filter(Boolean);
            name = parts.join(' ');
        }
        console.log("🍎 [Apple Auth] Constructed name:", name);
        // Check if user already exists with this appleId or email
        let user = yield auth_model_1.User.findOne({
            $or: [
                { appleId: appleUserId },
                ...(email ? [{ email: email }] : [])
            ]
        });
        console.log("🍎 [Apple Auth] Existing user found:", !!user);
        if (user) {
            // User exists - update Apple info if needed
            if (!user.appleId) {
                user.appleId = appleUserId;
                user.authProvider = 'apple';
                yield user.save();
                console.log("🍎 [Apple Auth] Updated existing user with Apple ID");
            }
            // Update name if we have it and user doesn't have one
            if (name && !user.name) {
                user.name = name;
                yield user.save();
                console.log("🍎 [Apple Auth] Updated user name");
            }
        }
        else {
            // Create new user
            console.log("🍎 [Apple Auth] Creating new user...");
            user = new auth_model_1.User({
                name: name || (email ? email.split('@')[0] : `Apple User ${appleUserId.substring(0, 6)}`),
                email: email || undefined,
                appleId: appleUserId,
                authProvider: 'apple',
                role: 'user',
                status: 'active'
            });
            yield user.save();
            console.log("🍎 [Apple Auth] New user created with ID:", user._id);
        }
        // Generate JWT token
        const token = (0, generateToken_1.generateToken)(user);
        console.log("🍎 [Apple Auth] JWT token generated");
        // Remove password from response
        const _a = user.toObject(), { password: _ } = _a, userObject = __rest(_a, ["password"]);
        console.log("✅ [Apple Auth] Authentication successful for user:", user._id);
        res.json({
            success: true,
            statusCode: 200,
            message: "Apple authentication successful",
            token,
            data: userObject
        });
        return;
    }
    catch (error) {
        console.log("❌ [Apple Auth] Error:", error.message);
        const userFriendlyMessage = parseDuplicateKeyError(error);
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: userFriendlyMessage
        });
        return;
    }
});
exports.appleAuth = appleAuth;
