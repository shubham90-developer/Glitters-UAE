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
exports.deleteEventById = exports.updateEventById = exports.getEventById = exports.getAllEvents = exports.createEvent = void 0;
const event_model_1 = require("./event.model");
const event_validation_1 = require("./event.validation");
const appError_1 = require("../../errors/appError");
const createEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = event_validation_1.eventValidation.parse(req.body);
        const event = new event_model_1.Event(validated);
        yield event.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Event created successfully',
            data: event,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createEvent = createEvent;
const getAllEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, search } = req.query;
        const filter = { isDeleted: false };
        if (from || to) {
            filter.start = {};
            if (from)
                filter.start.$gte = new Date(from);
            if (to)
                filter.start.$lte = new Date(to);
        }
        if (search) {
            const rx = new RegExp(search, 'i');
            filter.$or = [{ title: rx }, { description: rx }];
        }
        const events = yield event_model_1.Event.find(filter).sort({ start: 1 });
        res.json({
            success: true,
            statusCode: 200,
            message: 'Events retrieved successfully',
            data: events,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllEvents = getAllEvents;
const getEventById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.findOne({ _id: req.params.id, isDeleted: false });
        if (!event) {
            next(new appError_1.appError('Event not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Event retrieved successfully', data: event });
    }
    catch (error) {
        next(error);
    }
});
exports.getEventById = getEventById;
const updateEventById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = event_validation_1.eventUpdateValidation.parse(req.body);
        const updated = yield event_model_1.Event.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, validated, { new: true });
        if (!updated) {
            next(new appError_1.appError('Event not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Event updated successfully',
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateEventById = updateEventById;
const deleteEventById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!event) {
            next(new appError_1.appError('Event not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Event deleted successfully', data: event });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteEventById = deleteEventById;
