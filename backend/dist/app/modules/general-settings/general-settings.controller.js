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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGeneralSettings = exports.getGeneralSettings = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const general_settings_model_1 = require("./general-settings.model");
const general_settings_validation_1 = require("./general-settings.validation");
const getGeneralSettings = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield general_settings_model_1.GeneralSettings.findOne();
        if (!settings) {
            settings = yield general_settings_model_1.GeneralSettings.create({});
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'General settings retrieved successfully',
            data: settings,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getGeneralSettings = getGeneralSettings;
const updateGeneralSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = Object.assign({}, (req.body || {}));
        // If logo file uploaded
        if (req.file) {
            payload.logo = req.file.path;
        }
        const validated = general_settings_validation_1.generalSettingsValidation.parse(payload);
        const update = {};
        if (validated.logo !== undefined)
            update.logo = validated.logo;
        if (validated.username !== undefined)
            update.username = validated.username;
        if (validated.changePassword) {
            const salt = yield bcrypt_1.default.genSalt(10);
            update.password = yield bcrypt_1.default.hash(validated.changePassword, salt);
        }
        let settings = yield general_settings_model_1.GeneralSettings.findOne();
        if (!settings) {
            settings = yield general_settings_model_1.GeneralSettings.create(update);
        }
        else {
            Object.assign(settings, update);
            yield settings.save();
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'General settings updated successfully',
            data: settings,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateGeneralSettings = updateGeneralSettings;
