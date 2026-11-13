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
exports.deleteNoteById = exports.updateNoteById = exports.getNoteById = exports.getAllNotes = exports.createNote = void 0;
const note_model_1 = require("./note.model");
const note_validation_1 = require("./note.validation");
const appError_1 = require("../../errors/appError");
const createNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = note_validation_1.noteValidation.parse(req.body);
        const note = new note_model_1.Note(validated);
        yield note.save();
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Note created successfully',
            data: note,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createNote = createNote;
const getAllNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        const filter = { isDeleted: false };
        if (search) {
            filter.content = new RegExp(search, 'i');
        }
        const notes = yield note_model_1.Note.find(filter).sort({ updatedAt: -1 });
        res.json({
            success: true,
            statusCode: 200,
            message: 'Notes retrieved successfully',
            data: notes,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllNotes = getAllNotes;
const getNoteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.Note.findOne({ _id: req.params.id, isDeleted: false });
        if (!note) {
            next(new appError_1.appError('Note not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Note retrieved successfully', data: note });
    }
    catch (error) {
        next(error);
    }
});
exports.getNoteById = getNoteById;
const updateNoteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validated = note_validation_1.noteUpdateValidation.parse(req.body);
        const updated = yield note_model_1.Note.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, validated, { new: true });
        if (!updated) {
            next(new appError_1.appError('Note not found', 404));
            return;
        }
        res.json({
            success: true,
            statusCode: 200,
            message: 'Note updated successfully',
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateNoteById = updateNoteById;
const deleteNoteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_model_1.Note.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!note) {
            next(new appError_1.appError('Note not found', 404));
            return;
        }
        res.json({ success: true, statusCode: 200, message: 'Note deleted successfully', data: note });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNoteById = deleteNoteById;
